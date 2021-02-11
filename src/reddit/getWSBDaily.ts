import puppeteer from 'puppeteer'
async function getCommentsInPage(page: any) {
    return await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('._3cjCphgls6DH-irkVaA0GM > ._292iotee39Lmt0MkQZ2hPV > p'));
        console.log(items)
        return items.map(comment => {
            return comment.textContent
        });
    });
}

export default async function getDaily() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/wallstreetbets/');
    await page.click('#t3_lhifig')
    await page.waitForSelector('._1qeIAgB0cPwnLhDF9XSiJM')
    const test = await getCommentsInPage(page)
    console.log('test', test)
    await page.screenshot({path: 'example.png'});
    await browser.close();
}
