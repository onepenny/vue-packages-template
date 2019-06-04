import xhr from 'lt-xhr';

// 获取绣花库列表
export const getDecalList = param => xhr('get', '/PdmService/decal', param);

// 删除列表项
export const postDeleteDecalList = param =>
  xhr('post', '/PdmService/decal/do', param);

// 新建表单
export const getFormDecalCreate = param =>
  xhr('get', '/PdmService/decal/create', param);

// 编辑表单，该接口将 id 拼入
export const getFormDecalEdit = id =>
  xhr('get', `/PdmService/decal/${id}/edit`);

// 新建、保存表单
export const postFormDecal = (param, id) =>
  xhr('post', `/PdmService/decal${id ? `/${id}` : ''}`, param);
