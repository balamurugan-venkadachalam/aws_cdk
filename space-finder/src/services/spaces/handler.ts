import { captureAWSv3Client } from "aws-xray-sdk-core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postDocumentClientSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";

const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {


    try {
        switch (event.httpMethod) {
            case 'GET':
                return getSpaces(event, ddbClient);
                break;
            case 'POST':
                return postDocumentClientSpaces(event, ddbClient);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error(error);
        return {
        statusCode: 500,
            body: JSON.stringify({ 
                message: error instanceof Error ? error.message : 'Internal server error'
            })  
        }
    }

}

export { handler }