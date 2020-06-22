require('dotenv').config();
import puppeteer from 'puppeteer';
import { sendMail } from './mail';

interface PageResult {
  productName: string | undefined;
  price: string | undefined;
  oeirasStock: string | undefined;
}

interface DataResponse {
  availability: {
    productName: string,
    price: string,
    stock: string,
  } | null;
}

const scrapePage = async () => {
  const results: PageResult[] = [];
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
    ],
  });
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
  });

  return {
    productName: pageName,
    ...result,
  };
}

async function testEvaluation(page: puppeteer.Page, pageName: string): Promise<PageResult> {
  const result = await page.evaluate(() => {
    const testString = document.querySelector('div#productSearchResults > h2');

    if (testString) {
      return {
        price: '5,00',
        oeirasStock: 'Disponível',
      }
    }

    return {
      price: undefined,
      oeirasStock: undefined,
    }

  });

  return {
    productName: pageName,
    ...result,
  };
}

const isAvailableStock = (stock: string) => {
  if (stock.includes('Sem Stock')){
    return false;
  }
  return true;
}

export async function runScrape(): Promise<DataResponse> {
  let mailBody = '';
  let hasStock = false;
  let data: DataResponse = {
    availability: null,
  };
  const scrape = scrapePage().then(async (results) => {
    results.forEach(result => {
      if (result.price && result.oeirasStock && isAvailableStock(result.oeirasStock)){
        console.log('-----------');
        console.log('Results for: ', result.productName);
        console.log('The product price is: ', result.price);
        console.log('Stock in Oeiras:', result.oeirasStock);
        console.log('-----------\n');
        hasStock = true;
        mailBody += `
        <h3>Nome do produto: ${result.productName}</h3>
        <h4>Valor: ${result.price}</h4>
        <h4>Estoque: <span style="font-size:30px">${result.oeirasStock}</span></h4>
        <br/>
        `;
        data = {
          availability: {
            productName: result.productName || '',
            price: result.price,
            stock: result.oeirasStock,
          }
        };
      } else {
        console.log('-----------');
        console.log('Results for: ', result.productName);
        console.log('Not available in the website at the moment!');
        console.log('-----------\n');
        mailBody += `
        <h3>Nome do produto: ${result.productName}</h3>
        <h4>PRODUTO SEM ESTOQUE OU INDISPONÍVEL</h4>
        <br/>
        `;
        data = {
          availability: null,
        };
      }
    });
    if(hasStock){
      await sendMail({
        from:'no-reply@gloodscraper.com',
        replyTo:'no-reply@gloodscraper.com',
        subject: 'Atualização de disponibilidade da Erva Mate no Glood.pt', 
        text:' Hello GloodScraper 2',
        html: '<p>Confira o resultado mais recente da disponiblidade dos produtos:<p><br/>' + mailBody,
      });
    }
  });
  await scrape;
  return data;
}
