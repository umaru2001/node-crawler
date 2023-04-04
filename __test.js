const Neo4jDB = require('./neo4j');

const driver = new Neo4jDB();

driver.createNode('我', { money: 120, height: '167cm' }, (res) => {
  console.log(...res);
  console.log('执行结束！');
});