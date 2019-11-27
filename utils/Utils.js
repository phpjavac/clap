/**
 * 一些工具类
 */
class Utils {
  /**
     * @return {promise}
     * @param {文件流} stream
     */
  getFile(stream) {
    return new Promise(function(result) {
      console.log('开始');
      console.log(stream);
      const buffers = [];
      stream.on('data', function(data) {
        console.log('正在读');
        buffers.push(data);
      });
      stream.on('end', function() {
        const buffer = Buffer.concat(buffers);
        const workbook = xlsx.read(buffer, {type: 'buffer'});
        console.log('读取结束');
        result(workbook);
      });
    });
  }
}

module.exports = new Utils();

