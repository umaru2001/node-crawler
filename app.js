const express = require('express');
const services = require('./services');
const app = express();

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'book2',
//   port: 3306
// })

const { getTestArticle } = services;

app.get('/test', function (req, response) {
  console.log('客户端请求了/test接口!');
  getTestArticle(response);
});

app.listen('3000', function () {
  console.log('server listening on 3000!');
});