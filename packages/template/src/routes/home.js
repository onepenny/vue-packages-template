export default [
  {
    path: '/',
    component: () => import('../views/home'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    component: () => import('../views/home/about'),
    meta: {
      title: '关于'
    }
  }
];
