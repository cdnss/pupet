const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const app = express();
const port = 8080;

// Konfigurasi Puppeteer Extra Stealth
puppeteer.use(StealthPlugin());

app.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Ganti URL dengan URL yang ingin Anda scrape
    await page.goto('https://xtgem.com');

    // Selektor CSS untuk mengambil data yang Anda inginkan
    const data = await page.$$eval('.product-title', elements => {
      return elements.map(element => element.textContent);
    });

    await browser.close();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during scraping');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
