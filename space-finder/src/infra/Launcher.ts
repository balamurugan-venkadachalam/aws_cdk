import { DataStack } from "./stacks/DataStack";
        
import * as cdk from 'aws-cdk-lib';
import { SpacesLambdaStack } from "./stacks/SpacesLambdaStack";
import { APIGatewayStack } from "./stacks/APIGatewayStack"; 
import { ApiStack } from "./stacks/ApiStack";
import { LamdaStack } from "./stacks/LamdaStack";
import { MonitorStack } from "./stacks/MonitorStack";

const app = new cdk.App();

const dataStack = new DataStack(app, 'DataStack');
// const helloLambda = new LamdaStack(app, 'LamdaStack', {
//     spaceTable: dataStack.spaceTable
// });

// new APIGatewayStack(app, 'APIGatewayStack', {
//     helloLambdaIntegration: helloLambda.helloLambdaIntegration
// }); 

const spacesLambdaStack = new SpacesLambdaStack(app, 'SpacesLambdaStack', {
    spacesTable: dataStack.spaceTable
});

new ApiStack(app, 'ApiStack', {
    spacesLambdaIntegration: spacesLambdaStack.spacesLambdaIntegration
})

new MonitorStack(app, 'MonitorStack')