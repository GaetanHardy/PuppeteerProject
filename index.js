const puppeteer = require('puppeteer');

let browser = null;
const wordToSearch = "agence immobiliere";
let searchResults = [];
const emailsFound = []

const normalizeEmails = async (text) => {
  const phrase = text.split("/n").filter((word) => word.includes("@")).join(" ")
  emails = phrase.split(' ').filter((word) => word.includes("@")).map((email) => 
    email.split("\n").filter((e) => e.includes("@")).join(" ")
  )

  emails = emails.map((email) => {
    let emailNormalize = email.replaceAll("(", "").replaceAll(")", "");
    if(emailNormalize.charAt(emailNormalize.length - 1) === '.') {
      emailNormalize = emailNormalize.substring(0, emailNormalize.length - 1);
    }
    return emailNormalize;
  })

  return emails
}

const getEmailFromPage = async (page) => {
  
  // Récupère toutes les div de la page 
  const divHTML = await page.$$('div');
  
  // On regarde pour chaque div récupérer
  for (var i=0; i < divHTML.length; i++) {
    // on récupère le texte de chaque div
    let valueHandle = await divHTML[i].getProperty('innerText');
    let linkText = await valueHandle.jsonValue();
    const text = !!linkText ? getText(linkText) : undefined;

    // Si le texte existe et qu'il contient le symbole @
    if(!!text && text.includes('@')) {
      const emails = await normalizeEmails(text);

      emails.forEach((email) => {
        if(!emailsFound.includes(email)) {
          emailsFound.push(email)
        }
      })
    }
  }

}

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
  await getEmailFromPage(page);

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