import { getScreenshot, getContent } from "./_lib/puppeteer";

module.exports = async function (req, res) {
  
    const content = await getContent("https://xtgem.com");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, immutable, no-transform, s-maxage=86400, max-age=86400");
    res.status(200).end(content);
  
}


