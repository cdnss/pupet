import Puppeteer, { launch, Page } from "puppeteer-core";
const chrome = require("@sparticuz/chromium")
let _page: Page | null;



async function getPage() {
    if (_page) return _page;
    const options = { 
        args: chrome.args,
        executablePath: await chrome.executablePath(),
        headless: chrome.headless,    
        ignoreDefaultArgs: ['--disable-extensions']
    };
    const browser = await Puppeteer.launch(options);
    _page = await browser.newPage();
    return _page;
}



export async function getContent(url) {
    const page = await getPage();
    await page.goto(url);
    await page.waitForSelector('#anu img', {
  visible: true,
});
    // await page.waitForNavigation();
    const content = await page.content();
    return content;
}
