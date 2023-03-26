/**
 * Created by 12 on 2017/7/5.
 */
const cheerio = require('cheerio');
// const mysql = require('mysql')
const express = require('express');
const app = express();
const http = require('http');
const superagent = require('superagent')
require('superagent-charset')(superagent)
// const async = require('async');
let urls = require('./urls')

urls = urls.slice(0,10) //爬取多少书籍的信息

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'book2',
//   port: 3306
// })

let req = http.request('http://jhsjk.people.cn/article/32634480?isindex=1', (res) => {
  let chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    let htmlStr = Buffer.concat(chunks).toString('utf-8');
    let $ = cheerio.load(htmlStr);
    const title = $($('.d2txt.clearfix > h1')[0]).text();
    const subTitle = $($('.d2txt.clearfix > .d2txt_1.clearfix')[0]).text().split(' ');
    const [origin, time] = [subTitle[0].trim(), subTitle[subTitle.length - 1].trim()];
    const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).html().trim();
    console.log(content);
  });
})

req.end();


// app.get('/', function (req, response) {

// })

// app.listen('3000', function () {
//   console.log('server listening on 3000')
// })