import { Stack } from "aws-cdk-lib";
import { IVpc, Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Cluster, FargateService, IEcsLoadBalancerTarget, TaskDefinition } from "aws-cdk-lib/aws-ecs";
import { NetworkLoadBalancer, NetworkTargetGroup, Protocol, TargetType } from "aws-cdk-lib/aws-elasticloadbalancingv2";

export default function AppServices(stackName: string, stack: Stack, vpc: IVpc, cluster: Cluster, taskDefs: TaskDefinition[]) {

    const sgLoadBalancer = new SecurityGroup(stack, '${stackName}-sg-lb', {
        vpc,
        securityGroupName: '${stackName}-sg-lb',
        allowAllOutbound: true
    });

    [80,443].forEach(port => {
        sgLoadBalancer.addIngressRule(Peer.anyIpv4(), Port.tcp(port));
        sgLoadBalancer.addIngressRule(Peer.anyIpv6(), Port.tcp(port));
    });

    const loadBalancer = new NetworkLoadBalancer(stack, '${stackName}-lb', {
        vpc,
        internetFacing: true,
    });

    const sg = new SecurityGroup(stack, `${stackName}-api`, {
        vpc,
        securityGroupName: 'Web API Service',
        allowAllOutbound: true
    });

    sg.addIngressRule(Peer.ipv4("0.0.0.0/0"), Port.tcp(8000));

    const targets: IEcsLoadBalancerTarget[] = [];

    for (const taskDef of taskDefs) {
        const srv = new FargateService(stack, `${stackName}-srv`, {
            serviceName: `${stackName}-srv`,
            cluster,
            taskDefinition: taskDef, // as unknown as TaskDefinition,
            assignPublicIp: true,
            securityGroups: [sg]
        });

        if (!taskDef.defaultContainer?.containerName) {
            throw new Error('No defaultContainer containerName');
        }
    
        targets.push(
            srv.loadBalancerTarget({
                containerName: taskDef.defaultContainer?.containerName,
                containerPort: 8000
            })
        );
    }

    const targetGroup = new NetworkTargetGroup(stack, `${stackName}-tg`, {
        targetGroupName: `tg-${id}`,
        targetType: TargetType.IP,
        port: 8000, // resolve as dependency ??
        healthCheck: {
            enabled: true,
            path: "/service",
            protocol: Protocol.HTTP
        },
        vpc,
        targets
    });

    const listener = loadBalancer.addListener(`http-${id}`, {
        port: 80,
        defaultTargetGroups: [targetGroup]
    });
}