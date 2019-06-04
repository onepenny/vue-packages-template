import xhr from 'lt-xhr';

// 获取面料列表
export const getFabricList = param => xhr('get', '/PdmService/fabric', param);

// 删除列表项
export const postDeleteFabricList = param =>
  xhr('post', '/PdmService/fabric/do', param);

// 新建表单
export const getFormFabricCreate = param =>
  xhr('get', '/PdmService/fabric/create', param);

// 编辑表单，该接口将 id 拼入
export const getFormFabricEdit = id =>
  xhr('get', `/PdmService/fabric/${id}/edit`);

// 新建、保存表单
export const postFormFabric = (param, id) =>
  xhr('post', `/PdmService/fabric${id ? `/${id}` : ''}`, param);
