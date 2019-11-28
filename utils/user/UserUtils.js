
const {
  query,
} = require('../sql');
/**
 * 用户管理模块插件
 */
class UserUtils {
  /**
     * 检查用户是否存在
     * @return {promise}
     * @param {用户code}code
     */
  existence(code) {
    return new Promise(async (resolve, reject)=>{
      const querySql = 'select * from user where code = ?';
      await query(querySql, [code]).then((res)=>{
        console.log(res);
      });
    });
  }
}

module.exports = new UserUtils();
