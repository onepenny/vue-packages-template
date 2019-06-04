import xhr from 'lt-xhr';

// 获取所有权限数据
export const getAllPriorities = param =>
  xhr('get', '/WorkFlowService/Menus/Permissions', param);
