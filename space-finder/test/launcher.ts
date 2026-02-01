import { handler } from "../src/services/spaces/handler";
import 'dotenv/config';

handler({
    httpMethod: 'GET',
    queryStringParameters: {}
} as any, {} as any);