const route = require.context('./', false, /\.js$/);

export default route
  .keys()
  .filter(i => !i.includes('index'))
  .reduce((routes, i) => [route(i).default].concat(routes), [
    {
      path: '*',
      redirect: '/login' // TODO:以后添加失败页面
    }
  ]);
