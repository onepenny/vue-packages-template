import Router from 'vue-router';

export default routes => {
  routes.map(item => {
    // 路由参数统一通过 props 传入
    item.props = route => Object.assign({}, route.query, route.params);
    if (item.children) {
      item.children.map(i => {
        // 路由参数统一通过 props 传入
        i.props = route => Object.assign({}, route.query, route.params);
      });
    }
    return item;
  });

  const router = new Router({
    base: process.env.VUE_APP_BASEURL,
    routes,
    mode: 'history'
  });

  beforeRouter(router);
  afterRouter(router);
  return router;
};

// 全局前置钩子
const beforeRouter = router => {
  router.beforeEach((to, from, next) => {
    next();
  });
};

// 全局后置钩子
const afterRouter = router => {
  router.afterEach(() => {});
};
