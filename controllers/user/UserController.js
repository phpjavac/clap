const {
  query,
} = require('../../utils/sql');
const {
  md5,
  secretKey,
} = require('../../utils/constant');
const jwt = require('jsonwebtoken');
const xlsx = require('node-xlsx')
const fs = require('fs');
const path = require('path');

/**
 * @param {user用户接口} ctx
 */
class UserController {
  /**
   *
   * @param {登录接口} ctx
   */
  async login(ctx) {
    const {
      code,
      password,
    } = ctx.request.body;
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
   * POST
   * @param {sfc} ctx
   */
  async register(ctx) {
    const {
      code,
      name,
      role,
    } = ctx.request.body;
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
      const ADDUSERSQL = 'INSERT INTO user(code,name,role,headImgPath,disable,accessionTime)VALUES(?,?,?,?,?,?)';
      const addUserSqlParams = [code, name, role, 'static/img/avatar.png', 0, new Date().getTime()];
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
   * GET
   * @param {sfc} ctx
   */
  async list(ctx) {
    const role = ctx.query.role || '*';
    let pageNo = +ctx.query.pageNo || 1;
    const pageSize = +ctx.query.pageSize || 99999;
    let querySql = '';
    if (role) {
      querySql = 'select * from user where role = ? limit ?,?';
    } else {
      querySql = 'select * from user';
    }
    pageNo = (pageNo - 1) * pageSize;
    await query(querySql, [role, pageNo, pageSize]).then(async (res) => {
      const queryCountSql = 'SELECT COUNT(*) FROM user where role = ?';
      await query(queryCountSql, [role]).then((COUNT) => {
        const data = {
          list: res,
          totalRecord: COUNT[0]['COUNT(*)'],
        };
        ctx.body = {
          success: true,
          data: data,
        };
      });
    });
  }
  /**
   * 取得用户详细信息
   * @param {cfx} ctx
   */
  async userInfo(ctx) {
    const token = ctx.header.authorization.replace('Bearer ', '');
    const code = jwt.verify(token, secretKey).code;
    const QUERYSQL = 'select * from user where code = ?';
    await query(QUERYSQL, [code]).then((res) => {
      const data = res[0];
      ctx.body = {
        success: true,
        data: data,
      };
    });
  }
  /**
   * 更新用户信息
   * @param {cfx} ctx
   */
  async put(ctx) {
    console.log(ctx.request.body);
    const {name, code} = ctx.request.body;
    const UPDATESQL = 'UPDATE user SET name = ? WHERE code = ?';
    await query(UPDATESQL, [name, code]).then((res)=>{
      ctx.body = {
        success: true,
        data: res,
      };
    }).catch((err)=>{
      return ctx.throw(400, {
        message: err,
      });
    });
  }
  /**
   * 删除用户
   * @param {cfx} ctx
   */
  async deluser(ctx) {
    console.log(ctx.query.code);
    const code = ctx.query.code;
    const deleteSql = 'delete user,user_auth from user,user_auth where user.code=user_auth.usercode and user.code = ?';
    await query(deleteSql, [code]).then((res)=>{
      ctx.body = {
        success: true,
        data: res,
      };
    })
        .catch((err)=>{
          return ctx.throw(400, {
            message: err,
          });
        });
  }
  /**
   * 上传学生
   * @param {ctx} ctx
   */
  async uploadUser(ctx) {
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const filePath = path.join(__dirname, 'upload/') + `/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    console.log(upStream)
    reader.pipe(upStream);
    const sheetList = xlsx.parse(filePath);
    sheetList.forEach((sheet) => {
      console.log(sheet);
      
    })
    return ctx.body = {
      res: filePath,
    };
    // const workbook = await utils.getFile(upStream);
    // const sheetNames = workbook.SheetNames;
    // console.log(sheetNames);
    // ctx.body = {
    //   success: true,
    // };
  }
}
module.exports = new UserController();
