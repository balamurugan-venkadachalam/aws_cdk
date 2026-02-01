import { Bucket } from 'aws-cdk-lib/aws-s3';
import { EventType } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Fn } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { Function as LambdaFunction, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class PhotosUploaderStack extends cdk.Stack {
  private stackSuffix = "";
  readonly photosBucket: Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    this.initilizeSuffix();

    this.photosBucket = new Bucket(this, 'PhotosBucket', {
      bucketName: `photos-bucket-${this.stackSuffix}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda handler
    const photosHandler = new LambdaFunction(this, 'PhotosHandler', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Photo uploaded to: " + process.env.TARGET_BUCKET);
          console.log("Event: ", JSON.stringify(event, null, 2));
        }
      `),
      environment: {
        TARGET_BUCKET: this.photosBucket.bucketArn
      }
    });

    // Grant permissions
    this.photosBucket.grantRead(photosHandler);

    // Add S3 event trigger
    photosHandler.addEventSource(
      new S3EventSource(this.photosBucket, {
        events: [EventType.OBJECT_CREATED],
      })
    );
  }

  private initilizeSuffix(){
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId));
  }
}