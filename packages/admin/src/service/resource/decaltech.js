import xhr from 'lt-xhr';

// 获取绣花工艺库列表
export const getDecaltechList = param =>
  xhr('get', '/PdmService/decalTechnic', param);

// 删除列表项
export const postDeleteDecaltechList = param =>
  xhr('post', '/PdmService/decalTechnic/delete', param);

// 新建表单
export const getFormDecaltechCreate = param =>
  xhr('get', '/PdmService/decalTechnic/create', param);

// 编辑表单，该接口将 id 拼入
export const getFormDecaltechEdit = id =>
  xhr('get', `/PdmService/decalTechnic/${id}/edit`);

// 新建、保存表单
export const postFormDecaltech = (param, id) =>
  xhr('post', `/PdmService/decalTechnic${id ? `/${id}` : ''}`, param);
