//import Puppeteer, { launch, Page } from "puppeteer-core";
const chrome = require("@sparticuz/chromium")
 
import Puppeteer from 'puppeteer-extra'
require('puppeteer-extra-plugin-stealth/evasions/chrome.app')
require('puppeteer-extra-plugin-stealth/evasions/chrome.csi')
require('puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes')
require('puppeteer-extra-plugin-stealth/evasions/chrome.runtime')
require('puppeteer-extra-plugin-stealth/evasions/defaultArgs') // pkg warned me this one was missing
require('puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow')
require('puppeteer-extra-plugin-stealth/evasions/media.codecs')
require('puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency')
require('puppeteer-extra-plugin-stealth/evasions/navigator.languages')
require('puppeteer-extra-plugin-stealth/evasions/navigator.permissions')
require('puppeteer-extra-plugin-stealth/evasions/navigator.plugins')
require('puppeteer-extra-plugin-stealth/evasions/navigator.vendor')
require('puppeteer-extra-plugin-stealth/evasions/navigator.webdriver')
require('puppeteer-extra-plugin-stealth/evasions/sourceurl')
require('puppeteer-extra-plugin-stealth/evasions/user-agent-override')
require('puppeteer-extra-plugin-stealth/evasions/webgl.vendor')
require('puppeteer-extra-plugin-stealth/evasions/window.outerdimensions')

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
//let _page: Page | null;
let _page = null
Puppeteer.use(StealthPlugin());

async function getPage() {
    //if (_page) return _page;
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
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    // await page.waitForNavigation();
    const content = await page.content();
    return content;
}
