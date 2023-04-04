// 导入 mysql 模块
const mysql = require('mysql');

// 创建数据库连接池
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'politics',
});

// 封装查询函数
function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// 封装插入函数
async function insert(article) {
  const sql = 'INSERT INTO articles(id, title, origin, time, content) VALUES (?, ?, ?, ?, ?)';
  const values = [article.id, article.title, article.origin, article.time, article.content];
  await query(sql, values);
}

// 封装更新函数
async function update(article) {
  const sql = 'UPDATE articles SET title = ?, origin = ?, time = ?, content = ? WHERE id = ?';
  const values = [article.title, article.origin, article.time, article.content, article.id];
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
};
