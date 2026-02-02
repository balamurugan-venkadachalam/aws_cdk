//monitorLauncher.ts
import { SNSEvent } from "aws-lambda";
import { handler } from "../src/monitor/handler";

const snsEvent: SNSEvent = {
    Records: [{
            Sns: {
               Message: "test"
            }
        }]
} as any

handler(snsEvent, {} as any);