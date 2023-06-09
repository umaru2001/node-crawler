const Neo4jDB = require('./neo4j');
const fs = require('fs');

const action_is_importance = [
    ['节约能源', '是', '可持续发展的重要行动'],
    ['降低碳排放', '是', '应对气候变化的重要行动'],
    ['推广绿色出行', '是', '城市可持续发展的重要行动'],
    ['加强环境监管', '是', '环境保护的重要行动'],
    ['提高环保意识', '是', '推动环境保护的重要行动'],
    ['加强垃圾分类', '是', '城市环境卫生的重要行动'],
    ['推进生态文明建设', '是', '实现可持续发展的重要行动'],
    ['推广可再生能源', '是', '应对能源危机的重要行动'],
    ['促进循环经济', '是', '推动可持续发展的重要行动'],
    ['推进清洁能源革命', '是', '应对气候变化的重要行动'],
    ['加强水资源管理', '是', '保障人民生存的重要行动'],
    ['推广有机农业', '是', '保障粮食安全的重要行动'],
    ['加强海洋环保', '是', '保护海洋生态的重要行动'],
    ['加强环境法律法规建设', '是', '规范环境保护行为的重要行动'],
    ['推广绿色建筑', '是', '建设生态文明的重要行动'],
    ['加强环保科技研发', '是', '推动环保技术创新的重要行动'],
    ['加强环保教育宣传', '是', '提高公众环保意识的重要行动'],
    ['加强生态保护', '是', '保护生态环境的重要行动'],
    ['推进资源节约型社会建设', '是', '推动可持续发展的重要行动'],
    ['减少化学物质排放', '是', '预防环境污染的重要行动'],
    ['推广可持续农业', '是', '促进农村可持续发展的重要行动'],
    ['加强野生动物保护', '是', '维护生物多样性的重要行动'],
    ['推进生态修复工程', '是', '改善生态环境的重要行动'],
    ['加强空气污染治理', '是', '保障人民健康的重要行动'],
    ['推进低碳城市建设', '是', '应对气候变化的重要行动'],
    ['加强土壤污染治理', '是', '保障农产品安全的重要行动'],
    ['推进可持续水资源管理', '是', '维护水资源可持续利用的重要行动'],
    ['加强环境投资和财政支持', '是', '促进环境保护的重要行动'],
    ['推进环保产业发展', '是', '推动经济可持续发展的重要行动'],
    ['加强环保国际合作', '是', '应对全球环境挑战的重要行动'],
    ['推广可持续交通', '是', '促进城市可持续发展的重要行动'],
    ['加强环保督察和问责', '是', '保障环保政策落实的重要行动'],
    ['推进可持续消费', '是', '促进可持续生产和消费的重要行动'],
    ['加强环境信息公开', '是', '提高公众环保意识的重要行动'],
    ['减少化学物质排放', '是', '预防环境污染的重要行动'],
    ['认为倡导资源节约和环境友好型社会', '是', '科学发展观的内容'],
    ['积极推进绿色低碳发展', '是', '实现可持续发展的重要途径'],
    ['加强环保产业的发展', '是', '推进绿色经济转型的关键举措'],
    ['推广清洁能源', '是', '应对气候变化的重要策略'],
    ['加强水资源管理', '是', '保障国家水资源安全的必要措施'],
    ['加强生态文明建设', '是', '促进经济社会持续健康发展的重要保障'],
    ['推进循环经济发展', '是', '优化资源利用结构的有效途径'],
    ['推动生态环境保护与经济发展协同发展', '是', '可持续发展战略的核心要素'],
    ['推进污染防治工作', '是', '实现生态文明建设和经济社会可持续发展的重要保障'],
    ['推进绿色消费', '是', '促进资源节约和环境保护的有效途径'],
    ['提高环保法律法规的执行力度', '是', '推进生态文明建设的必要手段'],
];

const location_is_any = [
    ['青藏高原', '是', '世界屋脊'],
    ['喜马拉雅山脉', '是', '青藏高原的一部分'],
    ['珠穆朗玛峰', '是', '青藏高原的一座山峰'],
    ['昆仑山', '是', '中国的重要山脉之一'],
    ['华山', '是', '中国的五岳之一'],
    ['黄河', '是', '中国的第二长河'],
    ['长江', '是', '中国的第一长河'],
    ['塔克拉玛干沙漠', '是', '中国西部最大的沙漠'],
    ['敦煌莫高窟', '是', '世界文化遗产'],
    ['黄山', '是', '中国的重要山脉之一'],
    ['华南雨林', '是', '世界热带雨林的重要组成部分'],
    ['青海湖', '是', '中国最大的内陆湖泊之一'],
    ['长白山', '是', '中国东北地区的重要山脉之一'],
    ['黄果树瀑布', '是', '中国最大的瀑布之一'],
    ['张家界国家森林公园', '是', '世界自然遗产'],
    ['西双版纳', '是', '中国的热带雨林之一'],
    ['丽江古城', '是', '世界文化遗产'],
    ['九寨沟', '是', '中国最美的景点之一'],
    ['张家界', '是', '中国最美的自然景观之一'],
    ['黄鹤楼', '是', '中国的文化名胜之一'],
    ['壶口瀑布', '是', '中国北方的大瀑布'],
    ['武夷山', '是', '中国的文化名胜之一'],
    ['梁山泊', '是', '中国文学名著《水浒传》中的地名'],
    ['黄山', '是', '中国著名的旅游景点'],
    ['太湖', '是', '中国南方最大的淡水湖'],
    ['西湖', '是', '中国著名的湖泊和风景区'],
    ['珠江三角洲', '是', '中国著名的经济发达区'],
    ['南海诸岛', '是', '中国的领土'],
    ['杭州', '是', '中国的风景城市'],
    ['上海', '是', '中国的经济中心城市'],
    ['北京', '是', '中国的首都'],
    ['长城', '是', '中国的文化遗产'],
    ['兵马俑', '是', '中国的文化遗产'],
];

const neo4j = new Neo4jDB();

const createRelation = (fromName, toName, fromLabel, toLabel, relation) => {
  neo4j.createNode(fromLabel, { name: fromName }, () => {
    console.log('创建', fromName, '节点成功！');
    neo4j.createNode(toLabel, { name: toName }, () => {
      console.log('创建', toName, '节点成功！');
      neo4j.createRelationshipByName(fromName, toName, fromLabel, toLabel, relation, () => {
        console.log('创建', fromName, toName, '关系成功！');
      });
    });
  });
}

const generateKG = () => {
  const sub_label = "action";
  const obj_label = "importance";
  const relation = "is";
  location_is_any.forEach(rdf => {
    const [subjective, _relation, objective] = rdf;
    createRelation(subjective, objective, sub_label, obj_label, relation);
  })
}

generateKG();

const stream = fs.createWriteStream('dict.txt'); // 创建可写流

action_is_importance.forEach((tuple) => {
    stream.write(tuple[0] + '\n'); // 写入文件，每个元素占一行
});

stream.end(); // 结束可写流
