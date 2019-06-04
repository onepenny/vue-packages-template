import xhr from 'lt-xhr';

// 员工列表
export const getUserList = param =>
  xhr('get', '/WorkFlowService/Users/List', param);
// 删除员工
export const deleteUser = ({ id }) =>
  xhr('delete', `/WorkFlowService/Users/${id}`);
// 获取用户操作(新增/删除)配置
export const getUserOpConfig = param =>
  xhr('get', '/WorkFlowService/Users/Create', param);
// 获取用户信息
export const getUser = ({ id }) =>
  xhr('get', `/WorkFlowService/Users/${id}/Edit`);
// 保存用户配置
export const saveUserConfig = param =>
  xhr('post', '/WorkFlowService/Users/', param);
// 更新用户配置
export const updateUserConfig = param =>
  xhr('put', '/WorkFlowService/Users/', param);
