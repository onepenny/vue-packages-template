import xhr from 'lt-xhr';

// 获取面料列表
export const getAccessoryList = param =>
  xhr('get', '/PdmService/accessory', param);

// 删除列表项
export const postDeleteAccessoryList = param =>
  xhr('post', '/PdmService/accessory/do', param);

// 新建表单
export const getFormAccessoryCreate = param =>
  xhr('get', '/PdmService/accessory/create', param);

// 编辑表单，该接口将 id 拼入
export const getFormAccessoryEdit = id =>
  xhr('get', `/PdmService/accessory/${id}/edit`);

// 新建、保存表单
export const postFormAccessory = (param, id) =>
  xhr('post', `/PdmService/accessory${id ? `/${id}` : ''}`, param);
