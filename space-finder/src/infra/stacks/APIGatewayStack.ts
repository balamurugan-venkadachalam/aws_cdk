import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

interface APIGatewayStackProps extends cdk.StackProps {
    helloLambdaIntegration: LambdaIntegration
}

export class APIGatewayStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props: APIGatewayStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'HelloApi', {
            restApiName: 'Hello API',
            description: 'This is a Hello API',
        });

        const helloResource = api.root.addResource('hello');
        const helloLambda =  helloResource.addMethod('GET', 
            props.helloLambdaIntegration);
      }


}
