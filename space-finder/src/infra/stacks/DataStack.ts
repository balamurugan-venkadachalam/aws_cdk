import * as cdk from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Fn } from 'aws-cdk-lib/core';
import { getSuffixFromStack } from '../Utils';


export class DataStack extends cdk.Stack {

    public spaceTable: Table;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stackSuffix = getSuffixFromStack(this);

        this.spaceTable = new Table(this, 'SpaceDynamoTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            tableName: `space-finder-${stackSuffix}`,
            billingMode: BillingMode.PAY_PER_REQUEST,
        });

    }


}
