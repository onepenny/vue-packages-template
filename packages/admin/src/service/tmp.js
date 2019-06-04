import xhr from 'lt-xhr';

// 用于临时替换原来的请求
export const tmpXhr = (type, url, param) => xhr(type, url, param);
