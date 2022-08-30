const express = require("express");
const app = express();
const port = 3000;

const puppeteer = require("puppeteer");
const fs = require("fs/promises");
let items = []
let item = [];
let data;
let high;
let low;
let lastPrice;
let highs = [];
  let change = [];
  let value = [];
const fun = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  // https://www.moneycontrol.com/stocks/marketstats/nse-mostactive-stocks/nifty-50-9/
  // https://www.moneycontrol.com/stocks/marketstats/bse-mostactive-stocks/bse-100-1/
  await page.goto(
    "https://www.moneycontrol.com/stocks/marketstats/nse-mostactive-stocks/all-companies-99/"
  );
  // await page.screenshot({path : "apurvjijha.png" , fullPage:true })
  data = await page.evaluate(() => {
    return Array.from(document.getElementsByClassName("gld13 disin")).map(
      (x) => x.innerText
    );
  });
  high = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".bsr_table.hist_tbl_hm table tbody tr td[align='right'][width='175']"
      )
    ).map((x) => x.innerHTML);
  });
  low = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".bsr_table.hist_tbl_hm table tbody tr td[align='right'][width='180']"
      )
    ).map((x) => x.innerHTML);
  });
  lastPrice = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        ".bsr_table.hist_tbl_hm table tbody tr td[align='right'][width='185']"
      )
    ).map((x) => x.innerHTML);
  });

  
  
  for (let i = 0; i <= high.length; i = i + 3) {
    highs.push(high[i]);
    change.push(high[i + 1]);
    value.push(high[i + 2]);
  }

  items.push(data,highs,low,lastPrice,change,value)


  for(let i=0; i<data.length;i++){
    item.push({
      name : items[0][i],
      high : items[1][i],
      low : items[2][i],
      lastPrice : items[3][i],
      change : items[4][i],
      value : items[5][i]
    })
  }
  
  fs.writeFile(
    "data.json",
    JSON.stringify(item)
  );
  await browser.close();
};

fun()



app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/data', (req, res) => {
    res.status(200).json(item)
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})