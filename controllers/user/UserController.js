const {query} = require('../../utils/sql');
const {md5, secretKey} = require('../../utils/constant');
const jwt = require('jsonwebtoken');
/**
   * @param {user用户接口} ctx
   */
class UserController {
  /**
   *
   * @param {登录接口} ctx
   */
  async login(ctx) {
    const {code, password} = ctx.request.body;
    if (!code || !password) {
      return ctx.throw(400, {
        message: '用户或密码不能为空!',
      });
    };
    const res = await query('select * from user_auth where usercode = ?', [code]);
    if (res.length === 0) {
      return ctx.throw(400, {
        message: '用户或密码不正确!',
      });
    }
    const user = res[0];
    if (user.password !== md5(password)) {
      return ctx.throw(400, {
        message: '用户或密码不正确!',
      });
    }
    const querySql = 'select * from user where code = ?';
    const queryparams = [code];
    const queryuser = await query(querySql, queryparams);
    const USER = queryuser[0];
    USER.disable = !!USER.disable;
    if (USER.disable) {
      return ctx.throw(403, {
        message: '用户已被禁用!',
      });
    }
    const tokenObj = {
      code,
    };
    const token = jwt.sign(tokenObj, secretKey, {
      expiresIn: 60 * 60 * 24, // 授权时效24小时
    });
    USER.token = token;
    ctx.body = {
      success: true,
      message: '登陆成功!',
      data: USER,
    };
    // await ……
  }
  /**
   * 注册接口
   * @param {sfc} ctx
   */
  async register(ctx) {
    const {code, name, role} = ctx.request.body;
    if (!code || !name) {
      return ctx.throw(400, {
        message: '账号或姓名不能为空!',
      });
    };
    const QUERYSQL = 'select * from user_auth where usercode =?';
    const res = await query(QUERYSQL, [code]);
    if (res.length !== 0) {
      return ctx.throw(400, 'name required', {
        message: '用户已存在!',
      });
    }
    const ADDSQL = 'INSERT INTO user_auth(usercode,password) VALUES(?,?)';
    const addSqlParams = [code, md5(`123456`)];
    await query(ADDSQL, addSqlParams).then(async (res) => {
      const ADDUSERSQL = 'INSERT INTO user(code,name,role,headImgPath,disable)VALUES(?,?,?,?,?)';
      const addUserSqlParams = [code, name, role, 'static/img/avatar.png', 0];
      await query(ADDUSERSQL, addUserSqlParams);
      ctx.body = {
        success: true,
        message: '注册成功',
      };
    }).catch((err) => {
      return ctx.throw(400, {
        message: err,
      });
    });
  }
  /**
   * 查询所有用户列表
   * @param {sfc} ctx
   */
  async list(ctx) {
    const QUERYSQL = 'select * from user';
    await query(QUERYSQL).then((res)=>{
      console.log(res);
      ctx.body = {
        success: true,
        data: res,
      };
    });
  }
  /**
 * 取得用户详细信息
 * @param {cfx} ctx
 */
  async userInfo(ctx) {
    console.log(ctx.params);
    const QUERYSQL = 'select * from user where code = ?';
    await query(QUERYSQL).then((res)=>{
      console.log(res);
      ctx.body = {
        success: true,
        data: res,
      };
    });
  }
}
module.exports = new UserController();
