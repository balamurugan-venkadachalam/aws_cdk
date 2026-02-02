import { handler } from "../src/services/spaces/handler";
import 'dotenv/config';

handler({
    httpMethod: 'GET',
    queryStringParameters: {}
} as any, {} as any).then(result =>{
    console.log(result)
});

handler({
    httpMethod: 'POST',
    body: JSON.stringify({
        location: 'Test Location 123',
        capacity: 10
    })
} as any, {} as any).then(result =>{
    console.log(result)
});