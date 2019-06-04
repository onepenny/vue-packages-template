/**
 * 对数据遍历查找符合 key、value 的对象以及路径
 *
 * @param {Array} data:数据
 * @param {String} key: 查找 key 值
 * @param {String} value: 查找 value 值
 * @param {String} pathKey: 记录 key 值
 * @param {String} pathRecord: 记录路径
 * @returns {Object}
 */
export const loopSearch = (
  data,
  key,
  value,
  pathKey = 'id',
  pathRecord = []
) => {
  let obj = {};
  data.some(i => {
    if (i[key] == value) {
      obj = {
        target: i,
        path: [...pathRecord, i[pathKey]]
      };
      return true;
    }
    if (i.children && i.children.length) {
      let tmp = loopSearch(i.children, key, value, pathKey, [
        ...pathRecord,
        i[pathKey]
      ]);
      if (tmp.target) {
        obj = tmp;
        return true;
      }
    }
  });
  return obj;
};
