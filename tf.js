const tf = require('@tensorflow/tfjs-node');
const { load } = require('@tensorflow/tfjs-converter');

const modelPath = 'https://huggingface.co/bert-base-chinese/blob/main/tokenizer.json';

async function extractTriple(text) {
  // 加载BERT模型
  const model = await loadGraphModel(modelPath);

  // 对文本进行分词和处理
  const tokenizedText = ['[CLS]', ...text.split(' '), '[SEP]'];
  const input = tf.tensor2d(tokenizedText, [1, tokenizedText.length], 'int32');
  const [output] = model.predict(input);

  // 解析输出结果
  const triple = [];
  for (let i = 0; i < output.shape[1]; i++) {
    const label = tf.argMax(output.slice([0, i], [1, 1]), 1).dataSync()[0];
    if (label === 1) {
      const subject = tokenizedText[i];
      const predicate = tokenizedText[i + 1];
      const object = tokenizedText[i + 2];
      triple.push({ subject, predicate, object });
    }
  }

  return triple;
}

// 使用示例
extractTriple('张三和李四是好朋友。').then((triple) => {
  console.log(triple);
});
