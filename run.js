
const cheerio = require('cheerio');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
module.exports = async (req, res) => {
  const url = req.query.page;

  try {
    // check for https for safety!
    if (!pageToScreenshot.includes("https://")) {
      res.statusCode = 404;
      res.json({
        body: "Sorry, we couldn't screenshot that page. Did you include https://?",
      });
    }

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
 
 
  
  await page.goto(url, {
   waitUntil: 'networkidle0'
  });

  const data = await page.evaluate(() => document.querySelector('*').outerHTML);

  const $ = cheerio.load(data);
  $("script").remove();
  
  
//  await fs.promises.writeFile('public/index.html', `${$.html()}`);
 
 
 await browser.close();
 
 
    res.statusCode = 200;
    res.setHeader("Content-Type", `text/html`);

    // return the file!
    res.end($.html());
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }

 
};