import route from '@/routes';
const API_ENV = process.env.VUE_APP_ENV || 'local';

const GLOBAL = {
  // 路由跳转路径全局注册
  route: route.reduce((routeObj, first) => {
    if (first.children)
      first.children.forEach(second => {
        if (second.name) {
          routeObj[second.name] = `${first.path}/${second.path}`;
        } else {
          second.forEach(
            third =>
              (routeObj[third.name] = `${first.path}/${second.path}/${
                third.path
              }`)
          );
        }
      });
    return routeObj;
  }, {}),

  // 区分平台
  userLogin: {
    clientId: 1,
    clientSecret: '8UIPC0Dw6cizkUZmTIB17xXSBrVa5vWBEWx2Mils'
  },

  store: {
    token: `USER_TOKEN_${API_ENV}`,
    userInfo: `USER_INFO_${API_ENV}`
  },

  // 资源中心表单默认分页
  resourceList: {
    DEFAULTPAGE: 1,
    PERPAGE: 6
  },

  const: {
    ISPRIVITE: [
      {
        cid: 1,
        value: 1,
        label: '公开',
        key: 'const_public'
      },
      {
        cid: 0,
        value: 0,
        label: '私有',
        key: 'const_private'
      }
    ],
    FACETYPE: [
      {
        cid: 0,
        value: 0,
        label: '固定人脸',
        key: 'const_fix'
      },
      {
        cid: 1,
        value: 1,
        label: '可变人脸',
        key: 'const_move'
      }
    ]
  },

  // 发生该 code 返回为空
  errorCodeResNull: [400],
  // 发生该 code 返回登录页
  errorCodeResLogin: [401]
};

export default Vue => (Vue.prototype.$G = GLOBAL);
