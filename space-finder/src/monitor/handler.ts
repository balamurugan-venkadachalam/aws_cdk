
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { SNSEvent } from "aws-lambda";

const webhookUrl = process.env.SLACK_WEBHOOK_URL;


async function handler(event: SNSEvent, context: Context) {

    for (const record of event.Records) {
        console.log(record.Sns.Message)
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": `Team, we have a problem: ${record.Sns.Message}`
            })
        }).then(() => {
            console.log('success')
        }).catch((error) => {
            console.log(error)
        });
    }

    const message = event.Records[0].Sns.Message;

    console.log(message)

}
    
export { handler }  