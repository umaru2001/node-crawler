// 导入 mysql 模块
const mysql = require('mysql');

// 创建数据库连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '123456xy',
  database: 'politics',
});

process.on('exit', () => {
  // 在程序退出时调用 pool.end()
  pool.end();
});

function generateRandomId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).replace(/0\./, '').substring(0, 4);
  return `${year}${month}${day}${random}`;
}


const timerMap = new Map();

// 封装查询函数
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {

      if (!timerMap.has(connection.threadId)) {
        timerMap.set(connection.threadId, null);
      }
      let timer = timerMap.get(connection.threadId);
      if (timer) {
        clearTimeout(timer);
      }

      // 获取一个数据库连接
      if (error) {
        reject(error);
      } else {
        // 执行查询操作
        connection.query(sql, values, (error, results, fields) => {
          if (error) {
              reject(error);
          } else {
              resolve(results);
          }
          connection.release(); // 释放数据库连接
          // 在查询完成后开始定时器
          timer = setTimeout(() => {
              connection.destroy(); // 销毁数据库连接
          }, 60000); // 设置定时器时间为 1 分钟
        });
      }
    });
  });
}

// 封装插入函数
async function insert(article) {
  const id = article.id ? article.id : generateRandomId();
  const sql = 'INSERT INTO articles(id, title, origin, time, content) VALUES (?, ?, ?, ?, ?)';
  const values = [id, article.title, article.origin, article.time, article.content];
  await query(sql, values);
}

// 封装更新函数
async function update(article) {
  const sql = 'UPDATE articles SET title = ?, origin = ?, time = ?, content = ? WHERE id = ?';
  const values = [article.title, article.origin, article.time, article.content, article.id];
  await query(sql, values);
}

// 封装更新某字段函数
async function updateField(id, field, value) {
  let sql;
  let values;

  switch (field) {
    case 'title':
      sql = 'UPDATE articles SET title = ? WHERE id = ?';
      values = [value, id];
      break;
    case 'origin':
      sql = 'UPDATE articles SET origin = ? WHERE id = ?';
      values = [value, id];
      break;
    case 'time':
      sql = 'UPDATE articles SET time = ? WHERE id = ?';
      values = [value, id];
      break;
    case 'content':
      sql = 'UPDATE articles SET content = ? WHERE id = ?';
      values = [value, id];
      break;
    default:
      throw new Error('Invalid field');
  }

  await query(sql, values);
}

// 封装删除函数
async function del(id) {
  const sql = 'DELETE FROM articles WHERE id = ?';
  const values = [id];
  await query(sql, values);
}

// 封装查询所有函数
async function findAll() {
  const sql = 'SELECT * FROM articles';
  const results = await query(sql);
  return results;
}

// 封装根据 ID 查询函数
async function findById(id) {
  const sql = 'SELECT * FROM articles WHERE id = ?';
  const values = [id];
  const results = await query(sql, values);
  return results[0];
}

// 导出模块
module.exports = {
  insert,
  update,
  del,
  findAll,
  findById,
  updateField,
  generateRandomId,
};
