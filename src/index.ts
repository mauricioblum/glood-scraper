import puppeteer from 'puppeteer';

interface PageResult {
  productName: string | undefined;
  price: string | undefined;
  oeirasStock: string | undefined;
}

const scrapePage = async () => {
  const results: PageResult[] = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const pageOneKg = await browser.newPage();
  await page.goto('https://www.glood.pt/produto/3279/barao-erva-mate-chimarrao-500g');
  await pageOneKg.goto('https://www.glood.pt/produto/3926/barao-erva-mate-chimarrao-1kg');
  
  const result = await evaluatePage(page, 'Barao-500g');
  results.push(result);

  const resultOneKg = await evaluatePage(pageOneKg, 'Barao-1kg');
  results.push(resultOneKg);

  browser.close();
  return results;
}

async function evaluatePage(page: puppeteer.Page, pageName: string): Promise<PageResult> {
  const result = await page.evaluate(() => {
    const productStockList: Element[] = [];
    const stocks = document.getElementById('stocks');
    stocks?.querySelectorAll('div.row > div.col-lg-6.m-b-x1').forEach(item => productStockList.push(item));
    const productPrice = document.querySelector('div.current.red.h3');

    const oeiras = productStockList.find(stock => stock.innerHTML.includes('Oeiras'));

    const oeirasStock = oeiras?.querySelector('span + span')?.innerHTML;

    return {
      price: productPrice?.innerHTML,
      oeirasStock,
    };
  })

  return {
    productName: pageName,
    ...result,
  };
}

function runScrape() {
  scrapePage().then((results) => {
    results.forEach(result => {
      if (result.price && result.oeirasStock){
        console.log('-----------');
        console.log('Results for: ', result.productName);
        console.log('The product price is: ', result.price);
        console.log('Stock in Oeiras:', result.oeirasStock);
        console.log('-----------\n');
      } else {
        console.log('-----------');
        console.log('Results for: ', result.productName);
        console.log('Not available in the website at the moment!');
        console.log('-----------\n');
      }
    });
    setTimeout(() => {
      main();
    }, 5000)
  });
}

function main() {
  console.log('Fetching data, please wait...');
  try {
    runScrape();
  } catch(err){
    console.log(err);
  }
}

main();
