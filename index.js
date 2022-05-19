const puppeteer = require('puppeteer');

let browser = null;
const wordToSearch = "Coucou";
let searchResults = [];

const getGoogleLinks = async () => {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/", {waitUntil: "domcontentloaded"});

  // accept cookies
  await page.waitForSelector('button[id="L2AGLb"]')
  await page.click('button[id="L2AGLb"]')

  // search in google
  await page.type('input[class="gLFyf gsfi"]', wordToSearch);

  await Promise.all([
    page.waitForNavigation(),
    page.keyboard.press("Enter"),
  ]);

  await page.waitForSelector(".LC20lb", {visible: true});
  searchResults = await page.$$eval(".LC20lb", els => 
    els.map(e => ({title: e.innerText, link: e.parentNode.href}))
  );
  await page.close();

  // await browser.close();
}

const getEmailFromPages = async (link) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(link);

  console.log(link);
 
  await page.close();
  
  // await browser.close();
}

const main = async () => {
  browser = await puppeteer.launch({ headless: false });

  await getGoogleLinks();

  searchResults.forEach(async (page) => {
    await getEmailFromPages(page.link);
  })

  await browser.close();
}

main();