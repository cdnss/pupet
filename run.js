const fs = require('fs');
const url = require('url');
var http = require('http');
const cheerio = require('cheerio');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
//const express = require('express');
//const app = express();
//const port = process.env.PORT || 4040;

(async () => {
 await fs.promises.mkdir('public', {
  recursive: true
 });

 const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
  args: [
     chrome.args,
    '--disable-web-security'
  ],
  executablePath: await chrome.executablePath,
  headless: chrome.headless
 }: {
  args: [],
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
 });

 const page = await browser.newPage();

 await page.setViewport({
  width: 400,
  height: 400,
  deviceScaleFactor: 1
 });
 var id = 'https://liteapks.com/download/puffin-browser-pro-3924/1';
 http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var ik = q.query;
  id += ik.url;
 });
 if(id){

  await page.goto(id, {
   waitUntil: 'networkidle0'
  });
  await page.waitForSelector(".align-middle");



  const data = await page.evaluate(() => document.querySelector('*').outerHTML);

  const $ = cheerio.load(data);
  //$("script").remove();
  await fs.promises.writeFile('public/index.html', `${$.html()}`);
 
} else {
    await fs.promises.writeFile('public/index.html', `${id}`);
 }

 await browser.close();
})();
