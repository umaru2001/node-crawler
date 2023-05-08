const nodejieba = require('nodejieba');
const Neo4jDB = require('./neo4j');

nodejieba.load({
  userDict: './dict.txt',
});

function removeDuplicate(arr) {
  let seen = new Set(); // 用Set来存储已经出现过的id
  let result = []; // 存储去重后的数组
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i].elementId)) { // 如果该元素的id没有出现过
      seen.add(arr[i].elementId); // 将该id加入到Set中
      result.push(arr[i]); // 将该元素加入到去重后的数组中
    }
  }
  return result;
}

function wordAnalysis(response, sentence) {
  const neo4j = new Neo4jDB();
  const result = nodejieba.extract(sentence, 2);
  console.log(result)
  const keyword1 = result[0]?.word;
  const keyword2 = result[1]?.word;
  neo4j.getConnectedNodeByNames(keyword1 || '', keyword2 || '', (nodes) => {
    const processedNodes = removeDuplicate(nodes);
    const returnWords = []
    processedNodes.forEach(node => {
      if (node.neighbors.properties.name) {
        returnWords.push(node.neighbors.properties.name);
      }
    })
    response && response.send({
      success: returnWords.length === 0 ? 0 : 1,
      data: returnWords
    });
  });
}

function removeEndPunctuationsAndSpaces(str) {
  return str.replace(/[^\w\u4e00-\u9fa5]+$/, '');
}

function processor(sentence) {

  if (!sentence || sentence === '') {
    return false;
  }

  if (sentence.endsWith('?') || sentence.endsWith('？')) {
    return true;
  }

  const viceSentence = removeEndPunctuationsAndSpaces(sentence);

  const cut = nodejieba.cut(sentence);
  if (cut.length === 1) {
    return true;
  }

  const questionEndings = /(哪|哪里|谁的|几|多少|啥|什么|吗|是|为)$/;
  if (questionEndings.test(viceSentence)) {
    return true;
  }

  const questionViceEndings = /(哪|哪里|谁的|几|多少|啥|什么)$/;

  if (viceSentence.endsWith('呢')) {
    const prefix = viceSentence.slice(0, -1);
    if (questionViceEndings.test(prefix)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  processor,
  wordAnalysis,
}
