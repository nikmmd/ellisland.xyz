import { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import { handler } from './main'
import { expect } from '@jest/globals';
import { it } from '@jest/globals'
import * as sqs from './sqs';



beforeEach(() => {
    jest.resetAllMocks()

    //@ts-ignore
    sqs.sendBatchToSuccessSQSQueue = jest.fn()
})


it("Should succeed when good receipt number", async () => {
    const payload = { receipt_number: "IOE0916878702" }

    const messageBase = {
        messageId: "1",
        receiptHandle: "1...",
        body: JSON.stringify(payload),
        attributes: {
            "ApproximateReceiveCount": "1",
            "SentTimestamp": "1545082649183",
            "SenderId": "AIDAIENQZJOLO23YVJ4VO",
            "ApproximateFirstReceiveTimestamp": "1545082649185"
        },
        messageAttributes: {},
        md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:us-east-1:mock:my-queue",
        awsRegion: "us-east-1"
    }

    const event: SQSEvent = {
        Records: [messageBase]
    }


    expect(jest.isMockFunction(sqs.sendBatchToSuccessSQSQueue)).toBeTruthy();

    const result = await handler(event, {} as any, {} as any)

    //@ts-ignore
    console.log(sqs.sendBatchToSuccessSQSQueue.mock.calls[0][0])
    //@ts-ignore
    expect(sqs.sendBatchToSuccessSQSQueue.mock.calls[0][0].length == 1)

}, 10000)

it("Should fail when bad receipt number", async () => {
    const payload = { receipt_number: "IOEXYZ" }

    const messageBase = {
        messageId: "1",
        receiptHandle: "1...",
        body: JSON.stringify(payload),
        attributes: {
            "ApproximateReceiveCount": "1",
            "SentTimestamp": "1545082649183",
            "SenderId": "AIDAIENQZJOLO23YVJ4VO",
            "ApproximateFirstReceiveTimestamp": "1545082649185"
        },
        messageAttributes: {},
        md5OfBody: "e4e68fb7bd0e697a0ae8f1bb342846b3",
        eventSource: "aws:sqs",
        eventSourceARN: "arn:aws:sqs:us-east-1:mock:my-queue",
        awsRegion: "us-east-1"
    }

    const event: SQSEvent = {
        Records: [
            messageBase
        ]
    }
    const result = await handler(event, {} as any, {} as any) as SQSBatchResponse
    console.log(result)
    expect(result).toBeDefined()
    expect(result.batchItemFailures.length == 1)
}, 20000)