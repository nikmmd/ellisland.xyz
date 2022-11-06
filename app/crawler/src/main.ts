import puppeteer, { Browser } from "puppeteer";
import { SQSBatchItemFailure, SQSBatchResponse, SQSHandler } from 'aws-lambda';
import { receiveSQSRecord, sendBatchToSuccessSQSQueue } from "./sqs";
import {env} from 'process'
let browser: puppeteer.Browser | null = null;
const successQueue = "";



export const handler: SQSHandler = async (event, _): Promise<SQSBatchResponse | void> => {
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        headless: true,
      });
    } catch (e) {
      throw e
    }
  }

  try {

    console.debug(`Received ${event.Records.length} events`)
    const promises = event.Records.map((record) => receiveSQSRecord(record, browser!))

    const results = await Promise.allSettled(promises);

    //Catch failures and report
    const success = results.filter((res) => res.status == "fulfilled")
    const failure = results.filter((res) => res.status == "rejected")

    await sendBatchToSuccessSQSQueue(success.map((r: any) => r.value), successQueue)

    const response: SQSBatchItemFailure[] = failure.map((item: any) => {
      return { itemIdentifier: item.reason.message }
    })

    if (response.length) {
      return { batchItemFailures: response}
    }
    return Promise.resolve()

  } catch (error) {
    throw error;
  } finally {
    if (!["production", "prod", "test"].includes(env.NODE_ENV!)) {
      await browser.close();
    }
  }
};
``