// const nodejieba = require('nodejieba');

// const text = '地球是茫茫宇宙中迄今为止发现的唯一存在智能生物的星体，地球的形成和演化经历了一个漫长的过程。根据“星云假说”的解释，距今大约60亿年以前，地球的轮廓尚未形成，是一团没有凝聚在一起的混杂着大量宇宙尘埃的星云状气尘物质，到距今大约45亿～20亿年前这段时期，地球星体和原始的地理环境逐渐形成。随着地球物质分异过程的持续进行，多种原始火山气体（如CO2、CH4、NH3、H2S等）上升至地表形成了原始的大气圈。随着地球内部温度的升高，原来存在于地球内部的结晶水大量蒸发进入地球表面的原始大气层，冷凝后形成大气降水，在地球表面逐渐形成了河流、湖泊和海洋等水体。';

// console.log(nodejieba.extract);
const CoreNLP = require('corenlp');
const nodejieba = require('nodejieba');
const chineseWhispers = require('chinese-whispers');

const { Properties, Pipeline } = CoreNLP;

const Sentence = CoreNLP.default.simple.Sentence;

const Tree = CoreNLP.default.util.Tree;

const props = new Properties({
  annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
});

const pipeline = new Pipeline(props, 'Chinese'); // uses ConnectorServer by default

const sent = new Sentence('地球是茫茫宇宙中迄今为止发现的唯一存在智能生物的星球。');

pipeline
  .annotate(sent)
  .then((result) => {
    console.log(result);
    // const sentences = result.sentences.map((sentence) => sentence.tokens.map((token) => token.word));
    // console.log(sentences);
  })
  .catch((err) => {
    console.log('err', err);
  });

// const options = {
//     annotators: 'tokenize, ssplit, pos, lemma, parse, depparse, coref',
//     outputFormat: 'json',
// };

// const text = '你要处理的中文文本';
// const triples = [];

// nlp.annotate(text, options)
//     .then((result) => {
//         const sentences = result.sentences;
//         for (const sentence of sentences) {
//             const tokens = sentence.tokens;
//             const dependencies = sentence.basicDependencies;

//             // 构建依存关系字典
//             const dependencyDict = {};
//             for (const dependency of dependencies) {
//                 const governor = dependency.governor;
//                 const dependent = dependency.dependent;
//                 const relation = dependency.dep;
//                 if (governor in dependencyDict) {
//                     dependencyDict[governor].push({ dependent, relation });
//                 } else {
//                     dependencyDict[governor] = [{ dependent, relation }];
//                 }
//             }

//             // 根据依存关系提取 RDF 三元组
//             for (let i = 0; i < tokens.length; i++) {
//                 const token = tokens[i];
//                 const pos = token.pos;
//                 if (pos === 'NN' || pos === 'NR') {
//                     const subject = token.word;
//                     const objectCandidates = [];
//                     const objectIndexCandidates = [];
//                     for (let j = 0; j < tokens.length; j++) {
//                         if (j !== i) {
//                             const candidate = tokens[j];
//                             const candidatePos = candidate.pos;
//                             if (candidatePos === 'NN' || candidatePos === 'NR' || candidatePos === 'VV') {
//                                 const index = dependencies.findIndex((dep) => dep.governor === i + 1 && dep.dependent === j + 1);
//                                 if (index !== -1) {
//                                     objectCandidates.push(candidate.word);
//                                     objectIndexCandidates.push(j);
//                                 }
//                             }
//                         }
//                     }

//                     if (objectCandidates.length > 0) {
//                         // 中文 Whispers 算法聚类
//                         const nodes = objectCandidates.map((c, idx) => ({ id: idx, label: c }));
//                         const edges = objectIndexCandidates.map((idx, id) => ({ source: objectCandidates.indexOf(tokens[idx].word), target: id }));
//                         const clusters = chineseWhispers(nodes, edges);

//                         for (const cluster of clusters) {
//                             const object = cluster.map((c) => objectCandidates[c]).join('');
//                             triples.push({ subject, object, relation: 'contains' });
//                         }
//                     }
//                 }
//             }
//         }

//         console.log(triples);
//         // 进行后续处理
//     })
//     .catch((err) => {
//         console.log(err);
//     });