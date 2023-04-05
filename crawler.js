const http = require('http');
const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');
const { insert } = require('./articleDB');

// for (let i = 1; i <= 8; i++) {
//   const options = {
//     hostname: 'jhsjk.people.cn',
//     path: `/testnew/result?keywords=&isFuzzy=0&searchArea=0&year=0&form=0&type=105&page=${i}&origin=%E5%85%A8%E9%83%A8&source=2`,
//     method: 'GET',
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
//     },
//   };

//   const req = http.request(options, (res) => {
//     let data = '';
//     res.on('data', (chunk) => {
//       data += chunk;
//     });
//     res.on('end', () => {
//       const jsonData = JSON.parse(data);
//       const articleIds = jsonData.list.map((item) => item.article_id);
//       const urls = articleIds.map((id) => `http://jhsjk.people.cn/article/${id}?isindex=1`);
//       const content = urls.join('\n');
//       fs.appendFile('article_urls.txt', content, (err) => {
//         if (err) throw err;
//         console.log(`Page ${i} urls are saved in file.`);
//       });
//     });
//   });

//   req.on('error', (error) => {
//     console.error(error);
//   });

//   req.end();
// }

const rl = readline.createInterface({
  input: fs.createReadStream('./article_urls.txt'),
  crlfDelay: Infinity,
});

async function processLineByLine() {
  for await (const line of rl) {
    await getTestArticle(line.trim());
  }
}

processLineByLine().catch((err) => {
  console.error(err);
});


async function getTestArticle(url) {
  const req = http.request(url, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', async () => {
      const htmlStr = Buffer.concat(chunks).toString('utf-8');
      const $ = cheerio.load(htmlStr);
      const title = $($('.d2txt.clearfix > h1')[0]).text();
      const subTitle = $($('.d2txt.clearfix > .d2txt_1.clearfix')[0]).text().split(' ');
      const [origin, time] = [subTitle[0].split('：')[1].trim(), subTitle[subTitle.length - 1].split('：')[1].trim()];
      // const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).html().trim();
      const content = $($('.d2txt.clearfix > .d2txt_con.clearfix')[0]).text().trim();
      await insert({ title, time, origin, content });
    });
  });

  req.end();
}
