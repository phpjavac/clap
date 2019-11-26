const mysql = require('mysql');
const MYSQL_CONFIG = require('../config/mysql_config'); // 数据库配置

// mysql
const pool = mysql.createPool(MYSQL_CONFIG);
console.log(pool);
// query语句
const query = (sql, val) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else {
        connection.query(sql, val, (err, fields) => {
          if (err) reject(err);
          else resolve(fields);
          connection.release();
        });
      };
    });
  });
};

module.exports = {
  query,
};
