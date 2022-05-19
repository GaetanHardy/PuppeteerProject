const puppeteer = require('puppeteer');

let browser = null;
const wordToSearch = "immobilier commercial";
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
}

const getEmailFromPages = async (link) => {
  const page = await browser.newPage();
  await page.goto(link);
  // https://trello.com/b/4JMEhTfo/m08
  console.log(link) //http//[]'https:', 'trello.com/b/4JMEhTfo/m08';

  let service = link.split("//")[1].split("/")[0];
  

  if(service.includes("www")) {
    service = service.split("www.")[1]
  } 
  console.log(service);
  
  await page.close();
}

const main = async () => {
  browser = await puppeteer.launch();

  await getGoogleLinks();

  for(let i=0; i < searchResults.length; i++) {
    await getEmailFromPages(searchResults[i].link);
  }

  await browser.close();
}

main();