import puppeteer from "puppeteer";
import { parseCaseToISODateString, parseFormName } from "./parser";

const site = "https://egov.uscis.gov/casestatus/landing.do";

export const handler = async (event, context) => {
  let browser = null;
  const { receipt_number } = event;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(site);

    // Type into search box.
    await page.type("#receipt_number", receipt_number);

    await Promise.all([
      page.waitForNavigation({ timeout: 9000 }),
      page.$eval("form", (form) => form.submit()),
    ]);

    const receiptError = await page.$eval(".errorMessages", (el) =>
      el.textContent.trim()
    );

    if (receiptError.length) {
      throw new Error(
        `Invalid Receipt # ${receipt_number}, Error: ${receiptError}`
      );
    }

    const status = await page.$eval(".rows > h1", (el) => el.textContent);
    const body = await page.$eval(".rows > p", (el) => el.textContent);

    const date = parseCaseToISODateString(body);
    const form = parseFormName(body);

    return {
      status,
      body,
      date,
      form,
    };
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
};
