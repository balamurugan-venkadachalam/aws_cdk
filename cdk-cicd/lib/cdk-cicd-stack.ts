import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'MyFirstPipeline', {
      pipelineName: 'MyFirstPipeline',
        codeBuildDefaults: {
          buildEnvironment: {
            buildImage: codebuild.LinuxBuildImage.STANDARD_7_0
          }
        },
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('balamurugan-venkadachalam/aws_cdk', 'cicd-practice',
          {
            authentication: cdk.SecretValue.secretsManager('github-token')
          }
        ),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out'
      })
    });

    const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
      stageName: 'test'
    }));

    testStage.addPre(new CodeBuildStep('unit-tests', {
      commands: [
        'cd cdk-cicd',
        'npm ci',
        'npm test'
      ]
    }))

   }
}
