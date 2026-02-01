import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import {Function as LamdaFunction, Runtime, Code} from 'aws-cdk-lib/aws-lambda'
import { Fn } from 'aws-cdk-lib/core';
// import * as sqs from 'aws-cdk-lib/aws-sqs'; 

interface PhotosHanderStackProps extends cdk.StackProps {
  targetBucketArn: string
}


export class PhotosHandlerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PhotosHanderStackProps) {
    super(scope, id, props);

    //const targetBucket = Fn.importValue('photos-bucket');

    new LamdaFunction(this, 'PhotosHandler', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = asyc (event) => {
          console.log("hello : " + process.env.TARGET_BUCKET )  
        }
      `),
      environment: {
        TARGET_BUCKET: props.targetBucketArn
      }

    }); 

  }
}