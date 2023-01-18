import { App, RemovalPolicy, Stack, Environment, CfnParameter, StackProps, Duration } from 'aws-cdk-lib';
import { DefaultInstanceTenancy, InstanceClass, InstanceSize, InstanceType, SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { AwsLogDriver, Cluster, ContainerImage, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, DatabaseSecret, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';

import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

const createContainerLogger = (scope: Construct, serviceName: string): LogDriver => {
    const logGroup = new LogGroup(scope, `/ecs/${serviceName}`, {
        logGroupName: `/ecs/${serviceName}`,
        retention: RetentionDays.THREE_DAYS
    });
    const logDriver = new AwsLogDriver({
        streamPrefix: `ecs`,
        logGroup: logGroup,
    });
    return logDriver;
}

const stackName = 'company';
const env: Environment = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.REGION
};

const app = new App();

const stack = new Stack(app, 'prod', { stackName, env });

const vpc = new Vpc(stack, "vpc", {
    cidr: "172.30.0.0/16",

    defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
    maxAzs: 2,
    natGateways: 0,
});


const sg = new SecurityGroup(stack, `${stackName}-sg`, {
    vpc,
    securityGroupName: `${stackName}-sg`,
    allowAllOutbound: true
});

const dbSecret = new DatabaseSecret(stack, `${stackName}-rds-cred`, {
    secretName: `${stackName}-rds-cred`,
    username: 'dev'
})

const dbCredentials = Credentials.fromSecret(dbSecret);

const dbServer = new DatabaseInstance(stack, `${stackName}-rds-pg`, {
    vpcSubnets: {
      onePerAz: true,
      subnetType: SubnetType.PRIVATE_ISOLATED
    },
    credentials: dbCredentials,
    vpc: vpc,
    port: 5432,
    databaseName: 'main',
    allocatedStorage: 20,
    instanceIdentifier: `${stackName}-rds-pg`,
    engine: DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_12_7
    }),
    instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO)
  });

/*
sg.addIngressRule(ec2.Peer.ipv4("0.0.0.0/0"), ec2.Port.tcp(5432))
*/

const repository = new Repository(stack, `${stackName}-backend`, {
    repositoryName: `${stackName}-backend`,
    imageScanOnPush: false
});

// ECS Cluster
const cluster = new Cluster(stack, `${stackName}-services`, {
    clusterName: `${stackName}-services`,
    vpc,
});


// Task Exec Rol
const executionRole = new Role(stack, `${stackName}-ecs-task-exec`, {
    roleName: `${stackName}-ecs-task-exec`,
    assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
});

// Task's Role
const taskRole = new Role(stack, `${stackName}-ecs-task`, {
    roleName: `${stackName}-ecs-task`,
    assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonRDSFullAccess'),
    ]
});

const taskDef = new FargateTaskDefinition(stack,`${stackName}-task-def`, {
    family: `${stackName}-task-def`,
    memoryLimitMiB: 512,
    cpu: 256,
    taskRole,
    executionRole
});

console.log('credentials', dbCredentials.username, dbCredentials.password);

const connectionUri = `${dbCredentials.username}:${dbCredentials.password}@${dbServer.dbInstanceEndpointAddress}:${dbServer.dbInstanceEndpointPort}`;
console.log('connectionUri', connectionUri);

const container = taskDef.addContainer(`${stackName}-services`, {
    image: ContainerImage.fromEcrRepository(repository),
    startTimeout: Duration.seconds(10),
    memoryLimitMiB: 420,
    essential: true,
    logging: createContainerLogger(stack, `${stackName}-services`),
    environment: {
        'PG_URL': `pg://${connectionUri}/?ssl=true&sslInvalidHostNameAllowed=false&retryWrites=false`,
        'PG_DATABASE': 'dev',
    }
});

container.addPortMappings({
    containerPort: 8000,
    hostPort: 8000
});