import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

    const s3Client = new S3Client();
    


export async function handler(event: APIGatewayProxyEvent, context: Context) {

    console.log(event);
    console.log(context);
    
    const listBucketsCommand = new ListBucketsCommand({});
    const listBucketsResponse = (await s3Client.send(listBucketsCommand)).Buckets;
    console.log(listBucketsResponse);

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({ 
            message: `Hello from Lambda ${process.env.SPACE_TABLE_NAME}`,
            uuid: uuidv4(),
            listBucketsResponse
        })
    }
    
    return response;
}