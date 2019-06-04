export const formatOrganizeData = organizeTree => {
  return organizeTree.map(org => {
    let { id, title, children } = org;
    return {
      value: id,
      label: title,
      children: children && children.length ? formatOrganizeData(children) : {}
    };
  });
};
