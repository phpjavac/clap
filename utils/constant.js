const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX: 'yiziluoyingNodeCrawler我是一个固定长度的盐值',
  md5: (pwd) => {
    pwd+=this.MD5_SUFFIX;
    const md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
  },
  secretKey: 'yiziluoying_jwttoken',
};
