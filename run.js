 const fs = require('fs');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
//const express = require('express');
//const app = express();
//const port = process.env.PORT || 4040;

(async () => {
  await fs.promises.mkdir('public', { recursive: true });

  const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  } : {
    args: [],
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 400,
    height: 400,
    deviceScaleFactor: 1
  });
await page.goto('https://jutsuterlarang.blogspot.com/', { waitUntil: 'networkidle2' });
var data = page.content();

  await fs.promises.writeFile('public/index.html', 'jjj');


 // await page.screenshot({ path: 'public/image.png' });
  await browser.close();
})();




