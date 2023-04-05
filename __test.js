const Neo4jDB = require('./neo4j');
const db = require('./articleDB');

// const driver = new Neo4jDB();

// driver.createNode('我', { money: 120, height: '167cm' }, (res) => {
//   console.log(...res);
//   console.log('执行结束！');
// });

async function main() {
  // 插入一篇文章
  const id = db.generateRandomId();
  const article = {
    id,
    title: '测试标题',
    origin: '测试来源',
    time: '2023-04-04',
    content: '测试内容',
  };
  await db.insert(article);

  // 更新一篇文章
  article.title = '测试新标题';
  await db.update(article);

  // 根据 ID 查询一篇文章
  const result = await db.findById(id);
  console.log(result);

  // // 删除一篇文章
  // await db.del(id);

  // 查询所有文章
  const results = await db.findAll();
  console.log(results);
}

main();

// // 更新 title 字段
// await updateField(articleId, 'title', 'New Title');

// // 更新 origin 字段
// await updateField(articleId, 'origin', 'New Origin');

// // 更新 time 字段
// await updateField(articleId, 'time', 'New Time');

// // 更新 content 字段
// await updateField(articleId, 'content', 'New Content');

// const p1 = new Promise((resolve, reject) => {
//   resolve('111')
//   console.log('12345');
// })

// p1.then((r) => {
//   console.log(r);
// })
