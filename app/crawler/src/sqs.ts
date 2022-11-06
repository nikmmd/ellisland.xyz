import { Browser } from "puppeteer";
import { scrapePage } from "./parser";
import { SQSRecord } from 'aws-lambda';

export const sendBatchToSuccessSQSQueue = async (payload: any[], sqsQueue: string) => {
    console.debug(`Sending ${payload.length} to SQS ${sqsQueue}`)
    return Promise.resolve(payload)
}

export const receiveSQSRecord = async (record: SQSRecord, browser: Browser) => {
    console.info("Received: ", record.messageId)
    const { receipt_number } = JSON.parse(record.body);
    //hack to get messageId on rejections
    try {
        console.debug("Beginning scrape")
        return await scrapePage(receipt_number, browser!)
    } catch (error) {
        console.error(error.message)
        throw new Error(record.messageId)
    }
}
