const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
async function handler(event, context){
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://doujindesu.tv');

    // Your Puppeteer automation here, e.g.,
    const title = await page.title();

    await browser.close();

    return {
        statusCode: 200,
        body: JSON.stringify({ title }),
    };
};

export default handler;
