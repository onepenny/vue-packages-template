import xhr from 'lt-xhr';

// 岗位列表
export const positionList = param =>
  xhr('get', '/WorkFlowService/Positions/List', param);
// 新增岗位
export const addPosition = param =>
  xhr('post', '/WorkFlowService/Positions', param);
// 更新岗位
export const updatePosition = param =>
  xhr('put', '/WorkFlowService/Positions', param);
// 移除岗位
export const removePosition = ({ id }) =>
  xhr('delete', `/WorkFlowService/Positions/${id}`);
