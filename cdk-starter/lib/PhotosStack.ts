import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Fn } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs'; 

export class PhotosStack extends cdk.Stack {

  private stackSuffix = "";

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    this.initilizeSuffix();

    const photosBucket = new Bucket(this, 'PhotosBucket', {
      bucketName: `photos-bucket-${this.stackSuffix}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    //Export photos bucket arn
    new cdk.CfnOutput(this, 'photos-bucket', {
      value: photosBucket.bucketArn,
      exportName: 'photos-bucket'
    })
  }

  private initilizeSuffix(){
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId));
  }
}