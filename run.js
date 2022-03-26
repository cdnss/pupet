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
  args: chrome.args,
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
 
 http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var ik = q.query;
  var id = ik.url;
  
  await page.goto(id, {
   waitUntil: 'networkidle0'
  });

  const data = await page.evaluate(() => document.querySelector('*').outerHTML);

  const $ = cheerio.load(data);
  $("script").remove();
  //await fs.promises.writeFile('public/index.html', `${$.html()}`);
  res.writeHead(200, {'Content-Type': 'text/html'});
    res.write($.html());
    return res.end();
 }).listen(8080);

 await browser.close();
})();