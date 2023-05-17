/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

import { Actor } from "apify";
import { PuppeteerCrawler } from "crawlee";
import { router } from "./routes.js";
import puppeteer from "puppeteer";
import * as dot from "dotenv";
dot.config();
// Initialize the Apify SDK
await Actor.init();

const { EMAIL, PASSWORD } = process.env;
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
// await page.setExtraHTTPHeaders({
//     "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
// });
await page.setDefaultNavigationTimeout(0);
// await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
// );
//await page.setDefaultNavigationTimeout(0);
await page.goto("https://app.synchub.io/", {
    waitUntil: "networkidle0",
    timeout: 18000,
});
try {
    await Promise.all([
        page.waitForNavigation({ waitUntil: "load" }),
        page.click(
            "#AppContainer > div > div > div.welcome-con > fieldset > div:nth-child(4) > button.primary"
        ),
    ]);

    await delay(8000);
    await page.type("#UserName", EMAIL);
    await page.type("#Password", PASSWORD);
    await Promise.all([
        page.waitForNavigation(),
        page.click(
            "#SignIn > div > form > div.buttons > button.primary.loadable"
        ),

        await delay(8000),
        page.waitForNavigation(),
        page.click(
            "#AppContainer > div > div > div.welcome-con > fieldset > div:nth-child(3) > button"
        ),

        await delay(10000),
        page.waitForNavigation(),
        page.click(
            "#AppContainer > div > div.module-body.page > div > div:nth-child(2) > div > table > tbody"
        ),
        await delay(10000),

        page.click(
            "#AppContainer > div > div.module-body.page > div.entities-con > div.dashboard-status-overall-con > div.header-con > button"
        ),
        await delay(90000),

        await browser.close(),
    ]);
} catch (err) {
    console.log("err: ", err);
}

await Actor.exit();
