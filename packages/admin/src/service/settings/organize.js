import xhr from 'lt-xhr';

// 部门树数据
export const organizeTreeData = param =>
  xhr('get', '/WorkFlowService/Organizes/Tree', param);
// 部门表数据
export const organizeTableData = param =>
  xhr('get', '/WorkFlowService/Organizes/List', param);
// 删除部门
export const deleteOrganize = ({ id }) =>
  xhr('delete', `/WorkFlowService/Organizes/${id}`);
// 部门信息
export const organizeDetail = ({ id }) =>
  xhr('get', `/WorkFlowService/Organizes/${id}/Edit`);
// 更新部门
export const updateOrganize = param =>
  xhr('put', '/WorkFlowService/Organizes', param);
// 获取部门创建配置
export const organizeCreateConfig = param =>
  xhr('get', '/WorkFlowService/Organizes/Create', param);
// 新建部门
export const createOrganize = param =>
  xhr('post', '/WorkFlowService/Organizes', param);
