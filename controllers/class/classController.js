
const {
  query,
} = require('../../utils/sql');
const {
  secretKey,
} = require('../../utils/constant');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');
/**
 * 班级模块api
 */
class ClassController {
  /**
         * 添加班级
         * @param {sfc} ctx
         */
  async addClass(ctx) {
    const {className, classDescribe, teacherCode} = ctx.request.body;
    console.log(className, classDescribe);
    const addClassSql = 'INSERT INTO class(id,className,teacherCode,classDescribe)VALUES(?,?,?,?)';
    await query(addClassSql, [uuid().replace(/-/g, ''), className, teacherCode, classDescribe]).then((res) => {
      console.log(res);
      ctx.body = {
        success: true,
        message: '添加班级成功',
      };
    });
  }
  /**
       *  GET
       *  查询自己所教的班级
       * @param {ctx} ctx
       */
  async classList(ctx) {
    const token = ctx.header.authorization.replace('Bearer ', '');
    const code = jwt.verify(token, secretKey).code;
    let pageNo = +ctx.query.pageNo || 1;
    const pageSize = +ctx.query.pageSize || 99999;
    let querySql = 'select * from class where teacherCode = ?limit ?,?';
    if (code === 'admin') {
      querySql = 'select * from class where teacherCode != ?limit ?,?';
    }
    pageNo = (pageNo - 1) * pageSize;
    await query(querySql, [code, pageNo, pageSize]).then(async (res) => {
      let queryCountSql = 'SELECT COUNT(*) FROM class where  teacherCode  = ?';
      if (code === 'admin') {
        queryCountSql = 'SELECT COUNT(*) FROM class where  teacherCode  != ?';
      }
      await query(queryCountSql, [code]).then((COUNT) => {
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
       * 删除班级
       * DELETE
       * @param {ctx} ctx
       */
  async delClass(ctx) {
    const id = ctx.query.id;

    if (!id) {
      return ctx.throw(400, {
        message: '请选择要删除的班级',
      });
    }
    const deleteSql = 'delete class from class where id=?';
    await query(deleteSql, [id]).then((res) => {
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
}

module.exports = new ClassController();
