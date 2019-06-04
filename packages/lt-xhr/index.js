import flyio from 'flyio';
import Vue from 'vue';
import Store from 'store';
import { Message } from 'iview'; // 默认采用 iview Message

export default (type, url, param = {}) => {
  let config = {
    method: type,
    headers: {
      Authorization: Store.get(Vue.prototype.$G.store.token) || ''
      // Uid: 2
    }
  };
  return new Promise((resolve, reject) => {
    flyio
      .request(`${process.env.VUE_APP_API}${url}`, param, config)
      .then(res => {
        let response = res.data;
        // TODO：等后端网关统一
        if (response.Data) response.data = response.Data;
        if (
          +response.State === 200 ||
          +response.state === 200 ||
          response.state === true
        ) {
          resolve(response);
        } else {
          // 失败时默认报错，并返回空
          Message.error(response.message);
          // 返回登录页
          if (Vue.prototype.$G.errorCodeResLogin.includes(+response.state)) {
            Store.clearAll();
            // location.href = '/login';
          }
          // resolve 空值
          if (Vue.prototype.$G.errorCodeResNull.includes(+response.state))
            resolve('');
          reject(response);
        }
      })
      .catch(err => {
        // TODO：待协商
        if (err.status === 422) {
          Message.error(err.response?.data?.message);
          reject('');
        } else {
          // 目前控制台输出错误信息，如网络错误等，以后添加逻辑对网络失败等作处理
          console.error(err);
        }
      });
  });
};
