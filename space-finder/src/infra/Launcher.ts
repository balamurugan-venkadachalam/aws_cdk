import { DataStack } from "./stacks/DataStack";
import { LamdaStack } from "./stacks/LamdaStack";
import { APIGatewayStack } from "./stacks/APIGatewayStack";
import * as cdk from 'aws-cdk-lib';


const app = new cdk.App();

const dataStack = new DataStack(app, 'DataStack');
const helloLambda = new LamdaStack(app, 'LamdaStack', {
    spaceTable: dataStack.spaceTable
});

new APIGatewayStack(app, 'APIGatewayStack', {
    helloLambdaIntegration: helloLambda.helloLambdaIntegration
});