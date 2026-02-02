
import * as cdk from 'aws-cdk-lib';
import { Alarm, Metric, Unit } from 'aws-cdk-lib/aws-cloudwatch';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';


export class MonitorStack extends cdk.Stack {

      constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const webhookLamda = new NodejsFunction(this, 'WebhookLambda', {
            runtime: Runtime.NODEJS_22_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'monitor', 'handler.ts')),
        });

        // const alaramTopic = new Topic(this, 'AlarmTopic', {
        //     displayName: 'Alarm Topic',
        //     topicName: 'alarm-topic',
        // });
        const warningAlarmTopic = new Topic(this, 'WarningAlarmTopic', {
            displayName: 'Warning Alarms (4XX)',
            topicName: 'warning-alarm-topic',
        });

        warningAlarmTopic.addSubscription(new LambdaSubscription(webhookLamda));

        const spacesApi4XXAlarm = new Alarm(this, 'SpacesApi4XXAlarm', {
             metric: new Metric({
                metricName: '4XXError',
                namespace: 'AWS/ApiGateway',
                period: cdk.Duration.minutes(5),
                statistic: 'Sum',
                unit: Unit.COUNT,
                dimensionsMap: {
                    "ApiName": "spaces",

                }   
             }),
             evaluationPeriods: 1,
             threshold: 1, 
             alarmDescription: 'Alarm when 4XX errors are greater than 1',
             alarmName: 'SpacesApi4XXAlarm',

        });

        const warningAlarmSnsAction = new SnsAction(warningAlarmTopic);
        spacesApi4XXAlarm.addAlarmAction(warningAlarmSnsAction);
        spacesApi4XXAlarm.addOkAction(warningAlarmSnsAction);

        const criticalAlarmTopic = new Topic(this, 'CriticalAlarmTopic', {
                displayName: 'Critical Alarms (5XX)',
                topicName: 'critical-alarm-topic',
            });

        criticalAlarmTopic.addSubscription(new LambdaSubscription(webhookLamda));

        const spacesApi5XXAlarm = new Alarm(this, 'SpacesApi5XXAlarm', {
            metric: new Metric({
                metricName: '5XXError',
                namespace: 'AWS/ApiGateway',
                period: cdk.Duration.minutes(1),  // Faster detection for critical errors
                statistic: 'Sum',
                unit: Unit.COUNT,
                dimensionsMap: {
                    "ApiName": "spaces",
                }   
            }),
            evaluationPeriods: 1,
            threshold: 0,  // Alert on ANY 5XX error (stricter than 4XX)
            alarmDescription: 'Alarm when any 5XX server errors occur',
            alarmName: 'SpacesApi5XXAlarm',
        });

        const criticalAlarmSnsAction = new SnsAction(criticalAlarmTopic);
        spacesApi5XXAlarm.addAlarmAction(criticalAlarmSnsAction);
        spacesApi5XXAlarm.addOkAction(criticalAlarmSnsAction);
        
        spacesApi4XXAlarm.addInsufficientDataAction(warningAlarmSnsAction);
        spacesApi5XXAlarm.addInsufficientDataAction(criticalAlarmSnsAction);

    }


}
