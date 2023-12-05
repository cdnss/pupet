import asyncio
import traceback

from pyppeteer import launch
from requests_html import HTML

URL = 'https://secure.louisvuitton.com/eng-gb/checkout/review'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'


async def fetch(url, browser):
    page = await browser.newPage()
    await page.setUserAgent(UA)

    try:
        await page.goto(url, {'waitUntil': 'load'})
    except:
        traceback.print_exc()
    else:
        return await page.content()
    finally:
        await page.close()


async def main():
    browser = await launch(headless=True, args=['--no-sandbox'])

    doc = await fetch(URL, browser)
    await browser.close()

    html = HTML(html=doc)
    print(html.links)


if __name__ == '__main__':
    asyncio.run(main())
