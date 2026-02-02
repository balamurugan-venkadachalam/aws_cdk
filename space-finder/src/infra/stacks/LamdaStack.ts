import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

import { DataStack } from './DataStack';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Tracing } from 'aws-cdk-lib/aws-lambda';

interface LamdaStackProps extends cdk.StackProps {
    spaceTable: Table;
}

export class LamdaStack extends cdk.Stack {

    public helloLambdaIntegration: LambdaIntegration;

    constructor(scope: cdk.App, id: string, props: LamdaStackProps) {
        super(scope, id, props);

        const helloLambda = new NodejsFunction(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: join(__dirname, '..', '..', 'services', 'hello.ts'),
            environment: {
                SPACE_TABLE_NAME: props.spaceTable.tableName,
        },
        tracing: Tracing.ACTIVE,
        timeout: cdk.Duration.seconds(40),
        });

        helloLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:ListAllMyBuckets',
                's3:ListBuckets'
            ],
            resources: ['*'], // TODO: fix bad practice
        }));

        new cdk.CfnOutput(this, 'HelloLambdaArn', {
            value: helloLambda.functionArn,
        });
        this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
    
        

        
        
    }


}
