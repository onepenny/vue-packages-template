import xhr from 'lt-xhr';

// 获取动态路由
export const getRouteList = param =>
  xhr('get', '/WorkFlowService/Users/Route/List', param);
