import xhr from 'lt-xhr';

// 供应商信息
export const getSupplierInfo = ({ id }) =>
  xhr('get', `/WorkFlowService/Suppliers/${id}/Edit`);
// 保存供应商信息
export const saveSupplierInfo = param =>
  xhr('put', '/WorkFlowService/Suppliers', param);
