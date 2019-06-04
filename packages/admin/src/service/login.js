import xhr from 'lt-xhr';

// 登录
export const postLogin = param =>
  xhr('post', '/IdentityServer/Oauth/Token', param);
