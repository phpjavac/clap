const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "",
  lintOnSave: "error",
  filenameHashing: false, // 关闭文件哈希值
  productionSourceMap: false, //取消打包的source map文件
  chainWebpack: config => {
    config.resolve.alias.set("@s@", resolve("src/components/Student"));
  },
  devServer: {
    proxy: {
      "/": {
        ws: false,
        target: "http://localhost:3000/",
        changeOrigin: true
      }
    }
  }
};
