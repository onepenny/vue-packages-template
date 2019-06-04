/**
 * 对数据遍历添加label、value，符合 Cascader 格式
 *
 * @param {Array} data:数据
 * @param {Array} value: 将何字段值赋给 value，若是多个字段则拼接后赋值给 value
 * @returns {Array}
 */
export const handleCascaderDataMulti = (data, value = ['id']) => {
  data.forEach(i => {
    if (i.children && i.children.length)
      i.children = handleCascaderDataMulti(i.children, value);
    i.label = i.name;
    i.value = value.reduce(
      (total, item) => `${total}${total ? ',' : ''}${i[item]}`,
      ''
    );
    return i;
  });
  return data;
};

//todo:有待优化
export const handleCascaderData = (data, all = null, id = 'id') => {
  let midArr = [];

  for (let item in data) {
    let hasChild = data[item].children && data[item].children.length > 0;
    let midChild = data[item].children;
    let childArr = [];
    if (all) {
      childArr.push({
        label: all,
        value: 0
      });
    }
    if (hasChild) {
      for (let i in midChild) {
        childArr.push({
          label: midChild[i].name,
          value: midChild[i].cid || midChild[i][id],
          multiple: true
        });
      }
    }
    midArr.push({
      label: data[item].name,
      value: data[item].cid || data[item][id],
      children: childArr
    });
  }
  return midArr;
};

export const ucfirst = str => {
  return str && str[0].toUpperCase() + str.slice(1);
};

export const parseStringToArray = str => {
  if (!str) {
    return [];
  }
  return str.split(',');
};

export const translate = (obj, func) => {
  if (obj instanceof Array) {
    for (let item of obj) {
      if (item.key) {
        item.displayName = func(item.key);
        item.label = func(item.key);
      }
    }
  }
  return obj;
};

// TODO：调整位置
Date.prototype.format = function(fmt) {
  var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(day)/i.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, weekDay[this.getDay()]);
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );

  return fmt;
};

export const getFileExtension = filename => {
  return filename.substring(filename.lastIndexOf('.') + 1);
};

export const getFileName = filename => {
  var base = filename.substring(filename.lastIndexOf('/') + 1);
  if (base.lastIndexOf('.') != -1) {
    base = base.substring(0, base.lastIndexOf('.'));
  }
  return base;
};

//数组变成字符串
export const parseArrayToString = arr => {
  let midStr = '';
  if (Array.isArray(arr)) {
    midStr = arr.join(',');
  }
  return midStr;
};

export const matchParent = (cid, data) => {
  let allData = data;
  let midArr = [];
  for (let child in allData) {
    let temp = allData[child].children;
    for (let item in temp) {
      if (temp[item].cid === cid) {
        midArr.push(temp[item].parent, cid);
      }
    }
  }
  return midArr;
};
