import xhr from 'lt-xhr';

// 获取人台库列表
export const getModellingList = param =>
  xhr('get', '/PdmService/modelling', param);

// 删除列表项
export const postDeleteModellingList = param =>
  xhr('post', '/PdmService/modelling/do', param);

// 新建表单
export const getFormModellingCreate = param =>
  xhr('get', '/PdmService/modelling/create', param);

// 编辑表单，该接口将 id 拼入
export const getFormModellingEdit = id =>
  xhr('get', `/PdmService/modelling/${id}/edit`);

// 新建、保存表单
export const postFormModelling = (param, id) =>
  xhr('post', `/PdmService/modelling${id ? `/${id}` : ''}`, param);
