const puppeteer  = require("puppeteer-core") ;
 
const BROWSERLESS_API_KEY = "dcc295fa-ca49-43e1-9b1c-da12bb402563";

 
const getCompaniesInfo = async (page) =>
  await page.evaluate(() => {

    let data = [...document.querySelectorAll('[data-test="pay-period-ANNUAL-label"]')].map(e=>{
        return e.querySelector('[data-test="pay-period-ANNUAL"]').innerHTML
        // return e.innerText
    });
    // console.log(data);
    return {
        salary: document.querySelector('[data-test="formatted-pay"]').innerText,
        base: data[0],
        additional: data[1],
        confidence: document.querySelector('aside[data-test="confidence-badge"] span.css-18stkbk').innerText
        };
  });
 
const delaySecond = (time) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(true);
        }, time*1000);
    })
}

const getGlassdoorData = async (searchKeywords, searchLocation) => {
  const _browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`
  });
 
  const _page = await _browser.newPage();
 
  await _page.setViewport({ 'width': 1920, 'height': 1080 });
 
  await _page.goto('https://www.glassdoor.com/Salaries/index.htm');
 
  await _page.type('#KeywordSearch', searchKeywords);


  await _page.click('#HeroSearchButton');

  await _page.screenshot({path: 'buddy-screenshot1.png'});

  const experienceInput = await _page.$('[aria-label="All years of Experience"]');
  
  await experienceInput.select('LESS_THAN_ONE');

  const industryInput = await _page.$('[aria-label="All industries"]');

  await industryInput.select('10001');
//   await page.setRequestInterceptionEnabled(true);
//   _page.on('request', request => {
//     const overrides = {};
//     console.log(request);
//     request.continue(overrides);
//   });

  await delaySecond(2);

  await _page.screenshot({path: 'buddy-screenshot.png'});

  const companies = await getCompaniesInfo(_page);


//   const scLocationInput = await _page.$('#LocationSearch');
  
//   await scLocationInput.click({ clickCount: 3 });


//   await _page.waitForNavigation();

//   await _page.type('#sc\\.location', searchLocation);
 
 
  
 
//   await _page.evaluate(() => {
//     const links = document.querySelectorAll('[data-test="jobs-location-see-all-link"]');
//     // console.log(links);
//     links[links.length-1].click();
//   })
 
//   await _page.waitForNavigation();
 
//   await getCompaniesInfo(_page);
 
//   const companies = await getCompaniesInfo(_page);
 
  _browser.disconnect();
 
  return companies;
}
 
const main = async () => {
    
const data = await getGlassdoorData('Account Executive', 'London');
console.log(data);
}

main().then(() => {

});