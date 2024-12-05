import { getContent } from "./_lib/puppeteer";

module.exports = async function (req, res) {
  try {
    const content = await getContent("https://vangke.xtgem.com");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "public, immutable, no-transform, s-maxage=86400, max-age=86400");
    res.status(200).end(content);
  } catch (error) {
    console.error(error)
    res.status(500).send("The server encountered an error. You may have inputted an invalid query.");
  }
}
