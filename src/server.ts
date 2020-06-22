import express from 'express';
import cors from 'cors';
import { runScrape } from './index';

const app = express();

app.use(cors({origin: ['https://gloodscraper-test.herokuapp.com/']}));

app.get('/availability', async (req, res) => {
  try {
    const scrape = await runScrape();
    res.json(scrape);
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
});

console.log('Application started! 🍬')
app.listen(process.env.PORT || 3333);