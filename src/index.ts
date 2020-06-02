import puppeteer from 'puppeteer';

const scrapePage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.glood.pt/produto/3279/barao-erva-mate-chimarrao-500g');

  
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
  
  browser.close();
  return result;
}

function runScrape() {
  scrapePage().then(({price, oeirasStock}) => {
    console.log('The product price is: ', price);
    console.log('Stock in Oeiras:', oeirasStock);
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
