const env = require('../utils/envalid.js')
const mysqlConfig = {
  user: env.DATA_NAME,
  password: env.DATA_PASSWORD,
  database: env.DATA_BASE,
  host: env.HOST,
  port: env.PORT,
};

module.exports = mysqlConfig;
