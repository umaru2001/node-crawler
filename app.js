const express = require('express');
const services = require('./services');
const question = require('./questionProcessor');
const app = express();

const { getTestArticle, getArticleResearch } = services;
const { processor, wordAnalysis } = question;

app.get('/test', function (req, response) {
  console.log('客户端请求了/test接口!');
  getTestArticle(response);
});

app.get('/chairman/search/:data', function (req, response) {
  console.log('客户端请求了/search接口!');
  const { data } = req.params;
  getArticleResearch(response ,data);
});

app.get('/answer/:data', function (req, response) {
  console.log('客户端请求了/answer接口!');
  const { data } = req.params;
  const flag = processor(data);
  if (!flag) {
    response.send({
      success: 0,
      data: [],
    })
  }
  wordAnalysis(response, data);
})

app.listen('3000', function () {
  console.log('server listening on 3000!');
});
