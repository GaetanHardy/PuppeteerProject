const puppeteer = require('puppeteer');
// https://stackoverflow.com/questions/17450412/how-to-create-an-excel-file-with-nodejs
const  excel = require('excel4node');

const getGoogleLinks = async (browser: any, search: string, nbPage: number) => {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/", {waitUntil: "domcontentloaded"});

  // accept cookies
  await page.waitForSelector('button[id="L2AGLb"]')
  await page.click('button[id="L2AGLb"]')

  // search in google
  await page.type('input[class="gLFyf gsfi"]', search);

  await Promise.all([
    page.waitForNavigation(),
    page.keyboard.press("Enter"),
  ]);

  let currentNav: number = 1;
  const searchResults: any[] = []

  do {
    if(currentNav > 1) {
      await page.waitForSelector("a[aria-label='Page " + currentNav +"']", {visible: true});
      await page.click('a[aria-label="Page ' + currentNav +'"]')
    }

    await page.waitForSelector(".LC20lb", {visible: true});
    const googleLinks = await page.$$eval(".LC20lb", (els: any[]) => 
      els.map(e => ({title: e.innerText, link: e.parentNode.href}))
    );

    for (let i = 0; i < googleLinks.length; i++) {
      if (searchResults.length < nbPage) {
        const resultatSite = {
          url: googleLinks[i].link,
          mails: []
        }

        searchResults.push(resultatSite)
      }
    }

    if (searchResults.length < nbPage) {
      currentNav++
    }

  }
  while (searchResults.length < nbPage)

  await page.close();

  return searchResults;
}

const normalizeTest = (text: string) => {
  text = text.replace(/\r\n|\r/g, "\n");
  text = text.replace(/\ +/g, " ");

  // Replace &nbsp; with a space 
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return text.replace(nbspPattern, " ");
}

const normalizeEmails = async (text: string) => {
  const phrase = text.split("/n").filter((word) => word.includes("@")).join(" ")
  let emails: string[] = phrase.split(' ').filter((word) => word.includes("@")).map((email) => 
    email.split("\n").filter((e) => e.includes("@")).join(" ")
  )

  emails = emails.map((email) => {
    let emailNormalize = email.split("(").join("").split(")").join("");
    if(emailNormalize.charAt(emailNormalize.length - 1) === '.') {
      emailNormalize = emailNormalize.substring(0, emailNormalize.length - 1);
    }
    return emailNormalize;
  })

  return emails
}

const getEmailsFromPage = async (browser: any, searchPage: any) => {
  const page = await browser.newPage();
  await page.goto(searchPage.url);

  // On récupère toutes les div de la page 
  const divHTML = await page.$$('div');

  // On regarde pour chaque div récupérer
  for (var i=0; i < divHTML.length; i++) {
    // on récupère le texte de chaque div
    let valueHandle = await divHTML[i].getProperty('innerText');
    let linkText = await valueHandle.jsonValue();
    const text = !!linkText ? normalizeTest(linkText) : undefined;

    // Si le texte existe et qu'il contient le symbole @
    if(!!text && text.includes('@')) {
      const emails = await normalizeEmails(text);

      emails.forEach((email) => {
        if(!searchPage.mails.includes(email)) {
          searchPage.mails.push(email)
        }
      })
    }
  }

  await page.close();

  return searchPage;
}

export const scrapEmail = async (search: string, nbPage = 10) => {
  const browser = await puppeteer.launch();

  const searchResults = await getGoogleLinks(browser, search, nbPage);
  for(let i=0; i < searchResults.length; i++) {
    searchResults[i] = await getEmailsFromPage(browser, searchResults[i]);
  }
  
  await browser.close();

  return searchResults;
}

export const excelResults = (result: any[]) => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Mails de service');
  
  worksheet.cell(1,1).string('URL');
  worksheet.cell(1,2).string('Mail');
  
  let cpt = 2
  for (let i = 0; i < result.length; i++) {
    worksheet.cell(cpt, 1).string(result[i].url);
    for(let j = 0; j < result[i].mails.length; j++) {
      worksheet.cell(cpt, 2).string(result[i].mails);
      cpt++;
    }
    
  }
  
  workbook.write('mails.xlsx');
}