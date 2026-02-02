import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";



export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {


    const randomId = v4();
    const item = JSON.parse(event.body);
    const dynamoDbClient = DynamoDBDocumentClient.from(ddbClient);

        if (!item.location) {
        throw new Error('Missing required field: location');
    }
    const result = await dynamoDbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: item
    }));
    console.log(result);

    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
}