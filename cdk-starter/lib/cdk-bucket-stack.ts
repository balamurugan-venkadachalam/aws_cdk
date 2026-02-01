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

export class CdkBucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        
    const durationInDays = new cdk.CfnParameter(this, 'durationInDays', {
      type: 'Number',
      default: 6,
      minValue: 1,
      maxValue: 10,
      description: 'Number of days to expire objects in the bucket',
    });

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
          expiration: cdk.Duration.days(durationInDays.valueAsNumber),
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
    
    new cdk.CfnOutput(this, 'CFNOutputL2BucketName', {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, 'CFNOutputL1BucketName', {
      value: bucketL1.bucketName || '',
    });
    new cdk.CfnOutput(this, 'CFNOutputL3BucketName', {
      value: bucket.bucketName,
    });
  
  }
}

