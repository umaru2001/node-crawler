const cheerio = require('cheerio');
const http = require('http');

function responseArticle(response, title, origin, time, content) {
  response && response.send({
    title,
    origin,
    time,
    content,
  });
}

function responseArticles(response, articleData) {
  response && response.send(articleData);
}

async function getTestArticle(response) {

  const req = http.request('http://jhsjk.people.cn/article/32634480?isindex=1', (res) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const htmlStr = Buffer.concat(chunks).toString('utf-8');
      const $ = cheerio.load(htmlStr);
      const title = $($('.d2txt.clearfix > h1')[0]).text();
      const subTitle = $($('.d2txt.clearfix > .d2txt_1.clearfix')[0]).text().split(' ');
      const [origin, time] = [subTitle[0].split('：')[1].trim(), subTitle[subTitle.length - 1].split('：')[1].trim()];
      const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).html().trim();
      responseArticle(response, title, origin, time, content);
    });
  })

  req.end();
}

async function getTestArticles(response, urlList) {
  const innerUrlList = urlList.slice(0, 3);
  const articleData = [];
  innerUrlList.forEach(url => {
    const req = http.request(`http://jhsjk.people.cn/${url}?isindex=1`, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const htmlStr = Buffer.concat(chunks).toString('utf-8');
        const $ = cheerio.load(htmlStr);
        const title = $($('.d2txt.clearfix > h1')[0]).text();
        const subTitle = $($('.d2txt.clearfix > .d2txt_1.clearfix')[0]).text().split(' ');
        const [origin, time] = [subTitle[0].split('：')[1].trim(), subTitle[subTitle.length - 1].split('：')[1].trim()];
        const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).html().trim();
        articleData.push({ title, time, origin, content });
        if (articleData.length === 3) {
          responseArticles(response, articleData);
        }
      });
    })
    req.end();
  });
}

async function getArticleResearch(response, keyword) {

  const urlList = [];

  const req = http.request(`http://jhsjk.people.cn/result?searchArea=0&keywords=${keyword}&isFuzzy=1`, (res) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const htmlStr = Buffer.concat(chunks).toString('utf-8');
      const $ = cheerio.load(htmlStr);
      $($('#news_list')[0]).find('li').each(function () {
        urlList.push($($(this).find('a')[0]).attr('href'));
      });
      getTestArticles(response, urlList);
    });
  });

  req.end();
}

module.exports = {
  getTestArticle,
  getArticleResearch,
}
