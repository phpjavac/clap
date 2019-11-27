class Utils {
  /**
   * 获取列表中符合当前项的值
   * @param {list} list -查找的列表
   * @param {string} key - 要查找的键值
   * @param {string} value  - 当前对比值
   */
  getObjectKey(key, list, value) {
    return list.find(item => {
      return item[key] === value;
    });
  }
}
export default new Utils();
