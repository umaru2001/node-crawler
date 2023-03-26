const cheerio = require('cheerio');
const express = require('express');
const app = express();
const http = require('http');
const superagent = require('superagent')
require('superagent-charset')(superagent)

async function getTestArticle(response) {

  const req = http.request('http://jhsjk.people.cn/article/32634480?isindex=1', (res) => {
    let chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      let htmlStr = Buffer.concat(chunks).toString('utf-8');
      let $ = cheerio.load(htmlStr);
      const title = $($('.d2txt.clearfix > h1')[0]).text();
      const subTitle = $($('.d2txt.clearfix > .d2txt_1.clearfix')[0]).text().split(' ');
      const [origin, time] = [subTitle[0].trim(), subTitle[subTitle.length - 1].trim()];
      const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).html().trim();
      response && response.send(content);
    });
  })

  req.end();
}

module.exports = {
  getTestArticle,
}
