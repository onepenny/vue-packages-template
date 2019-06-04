import xhr from 'lt-xhr';

// 获取人台库列表
export const getProductList = param =>
  xhr('get', '/PdmService/api/product', param);
