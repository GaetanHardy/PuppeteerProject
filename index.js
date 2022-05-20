const puppeteer = require('puppeteer');

let browser = null;
const wordToSearch = "agence immobiliere";
let searchResults = [];
const emailsFound = []

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

function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space 
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
}

const getEmailFromPages = async (link) => {
  const page = await browser.newPage();
  await page.goto(link);
  console.log("----------------------")
  console.log(link)

  // Get service
  let service = link.split("//")[1].split("/")[0];
  
  if (service.includes("www")) {
    service = service.split("www.")[1]
  }

  // Get email
  const links = await page.$$('div')
  for (var i=0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty('innerText');
    let linkText = await valueHandle.jsonValue();
    const text = !!linkText ? getText(linkText) : undefined;
    if(!!text && text.includes('@')) {
      const phrase = text.split("/n").filter((word) => word.includes("@")).join(" ")
      const emails = phrase.split(' ').filter((word) => word.includes("@")).map((email) => {
        const normalizeEmail = email.split("\n");
        return normalizeEmail.filter((e) => e.includes("@")).join(" ")
      })
      emails.forEach((email) => {
        const emailN = email.replaceAll("(", "").replaceAll(")", "")
        if(!emailsFound.includes(emailN)) {
          emailsFound.push(emailN)
        }
      })
    }
  }

  console.log(emailsFound)
  
  await page.close();
}

const main = async () => {
  browser = await puppeteer.launch()

  await getGoogleLinks();

  for(let i=0; i < searchResults.length; i++) {
    await getEmailFromPages(searchResults[i].link);
  }

  console.log("FINAl", emailsFound)

  await browser.close();
}

main();