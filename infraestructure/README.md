# Project setup

```bash
yarn init -y
yarn -D add typescript ts-node @types/node aws-cdk aws-cdk-lib constructs
./node_modules/.bin/tsc --init
```

# Create config file

`cdk.json`:
```json
{
  "app": "npx ts-node index.ts"
}
```
