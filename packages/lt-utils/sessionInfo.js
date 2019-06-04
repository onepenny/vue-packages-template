// 部门管理也 选中的树节点code
const SELECTED_TREE_CODE = 'selected_tree_code';
const setSelectedTreeData = (obj = {}) => {
  sessionStorage.setItem(SELECTED_TREE_CODE, JSON.stringify(obj));
};
const getSelectedTreeData = () => {
  return JSON.parse(sessionStorage.getItem(SELECTED_TREE_CODE) || '{}');
};

export default {
  setSelectedTreeData,
  getSelectedTreeData
};
