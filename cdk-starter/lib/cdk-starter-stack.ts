import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expirationInDays: number) {
    super(scope, id);

      new CfnBucket(this, 'MyL3BucketBalam123', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: expirationInDays,
          status: 'Enabled',
        }]
      }
  });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkStarterQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Create S3 bucket 3 ways:
    // L2 construct
    const bucket = new Bucket(this, 'MyL2BucketBalam122', {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(365),
        },
      ],
    });

    // L1 construct
    const bucketL1 = new CfnBucket(this, 'MyL1BucketBalam123', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 365,
          status: 'Enabled',
        }]
      }

    });

    //L3 construct
    const bucketL3 = new L3Bucket(this, 'MyL3BucketBalam123', 365);

    

   

  }
}
