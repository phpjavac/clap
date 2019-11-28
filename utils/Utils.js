const xlsx = require('node-xlsx');
/**
 * 一些工具类
 */
class Utils {
  /**
     * @return {Promise}
     * @param {文件流} stream
     * @param {文件路径} filePath
     */
  getFile(stream, filePath) {
    return new Promise((result, reject) =>{
      stream.on('finish', function(err) {
        if (err) {
          reject(new Error(err));
        }
        const sheetList = xlsx.parse(filePath, {type: 'file'});
        result(sheetList[0].data);
      });
    });
  }
}

module.exports = new Utils();

