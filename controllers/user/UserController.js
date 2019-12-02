const {
  query,
} = require('../../utils/sql');
const {
  md5,
  secretKey,
} = require('../../utils/constant');
const jwt = require('jsonwebtoken');
const utils = require('../../utils/Utils');
// const userUtils = require('../../utils/user/UserUtils');
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
      const ADDUSERSQL = 'INSERT INTO user(code,name,role,headImgPath,disable,accessionTime,classid)VALUES(?,?,?,?,?,?,?)';
      const addUserSqlParams = [code, name, role, 'static/img/avatar.png', '0', new Date().getTime().toString(), 'null'];
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
    const {name, code} = ctx.request.body;
    const UPDATESQL = 'UPDATE user SET name = ? WHERE code = ?';
    await query(UPDATESQL, [name, code]).then((res) => {
      ctx.body = {
        success: true,
        data: res,
      };
    }).catch((err) => {
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
    const code = ctx.query.code;
    const deleteSql = 'delete user_auth from user_auth where usercode = ?';
    await query(deleteSql, [code]).then((res) => {
      ctx.body = {
        success: true,
        data: res,
      };
    })
        .catch((err) => {
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
    const classid = ctx.request.body.classId;
    const reader = fs.createReadStream(file.path);
    const filePath = path.join(__dirname, '../../upload/') + `${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    const stream = reader.pipe(upStream);
    await utils.getFile(stream, filePath).then(async (data) => {
      const codeList = [];
      const addparams = [];
      const adduserParams = [];
      for (let i = 1; i < data.length; i++) {
        const item = data[i];
        codeList.push(item[0]);
        const arr = `('${item[0]}', '${item[1]}', 'student', 'static/img/avatar.png', 0, '${new Date().getTime()}', '${classid}')`;
        adduserParams.push([item[0], md5(`123456`)]);
        addparams.push(arr);
      }
      let addUser = adduserParams.map((item)=>{
        return `('${item[0]}','${item[1]}')`;
      });
      addUser = [...addUser].toString();
      const addSql = `insert ignore into user_auth(usercode,password) VALUES${addUser};`;
      await query(addSql).then(async (res)=>{
        const addUserSql = `insert ignore into user(code,name,role,headImgPath,disable,accessionTime,classid) VALUES${addparams};`;
        await query(addUserSql).then((res1)=>{
          ctx.body = {
            success: true,
            data: res1,
          };
        });
      });
    }).catch((err) => {
      return ctx.throw(400, {
        message: err,
      });
    });
  }
  /**
   * 查询班级里所有学生
   * @param {ctx} ctx
   */
  async ClassStudentList(ctx) {
    const classId = ctx.query.id;
    if (!classId) {
      return ctx.throw(400, {
        message: '班级id为空!',
      });
    }
    const sql = 'select * from user where classid = ?';
    await query(sql, [classId]).then((res)=>{
      const data = {
        list: res,
      };
      ctx.body = {
        success: true,
        data: data,
      };
    });
  }
}
module.exports = new UserController();
