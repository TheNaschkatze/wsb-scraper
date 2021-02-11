import puppeteer from 'puppeteer'

function extractComments(): Array<string | null> {
    const items = Array.from(document.querySelectorAll('._3cjCphgls6DH-irkVaA0GM > ._292iotee39Lmt0MkQZ2hPV > p'));
    return items.map(comment => {
        return comment.textContent
    });
}

async function scrapeComments(
    page: any,
    extractComments: ()=> Array<string | null>,
    commentTargetCount: number,
    scrollDelay = 1000,
): Promise<Array<string>> {
    let comments = [];
    try {
        let previousHeight;
        while (comments.length <= commentTargetCount) {
            console.log(comments.length / commentTargetCount)
            comments = await page.evaluate(extractComments);
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitForTimeout(scrollDelay);
        }
    } catch(e) { }
    return comments;
}

export default async function getDailyComments() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.reddit.com/r/wallstreetbets/');
    await page.click('#t3_lhifig')
    await page.waitForSelector('._1qeIAgB0cPwnLhDF9XSiJM')
    const comments = await scrapeComments(page, extractComments, 100);
    console.log(comments)
    await page.screenshot({path: 'example.png'});
    await browser.close();
}
