import { Browser } from 'puppeteer';
import { format, parse } from "date-fns";

const dateRegex =
  /(January|February|March|April|May|June|July|August|September|October|November|December).*?([0-9]{4})/;
const formNumberRegex = /(?<=Form\s).*?(?=,)/;

const site = "https://egov.uscis.gov/casestatus/landing.do";


export const parseCaseToISODateString = (body: string) => {
  return format(
    parse(dateRegex.exec(body)![0], "MMMM d, yyyy", new Date()),
    "yyyy-MM-dd"
  );
};

export const parseFormName = (body: string) => {
  return formNumberRegex.exec(body)![0];
};

export const scrapePage = async (receipt_number: string, browser: Browser) => {
  try {
    const page = await browser.newPage();

    await page.goto(site);

    // Type into search box.
    await page.type("#receipt_number", receipt_number);

    await Promise.all([
      page.waitForNavigation({ timeout: 9000 }),
      page.$eval("form", (form) => form.submit()),
    ]);

    const receiptError = await page.$eval(".errorMessages", (el) =>
      el.textContent!.trim()
    );

    if (receiptError.length) {
      throw new Error(
        `Invalid Receipt # ${receipt_number}, Error: ${receiptError}`
      );
    }

    const status = await page.$eval(".rows > h1", (el) => el.textContent);
    const body = await page.$eval(".rows > p", (el) => el.textContent);

    const date = parseCaseToISODateString(body!);
    const form = parseFormName(body!);

    return {
      status,
      body,
      date,
      form,
      receipt_number,
    };
  } catch (error) {
    throw error;
  }
}

