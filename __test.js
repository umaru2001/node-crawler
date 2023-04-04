const Neo4jDB = require('./neo4j');
const db = require('./articleDB');

// const driver = new Neo4jDB();

// driver.createNode('我', { money: 120, height: '167cm' }, (res) => {
//   console.log(...res);
//   console.log('执行结束！');
// });

async function main() {
    // 插入一篇文章
    const article = {
        id: '1',
        title: '标题',
        origin: '来源',
        time: new Date(),
        content: '内容',
    };
    await db.insert(article);

    // 更新一篇文章
    article.title = '新标题';
    await db.update(article);

    // 根据 ID 查询一篇文章
    const id = '1';
    const result = await db.findById(id);
    console.log(result);

    // 删除一篇文章
    await db.del(id);

    // 查询所有文章
    const results = await db.findAll();
    console.log(results);
}

main();
