export default {
  path: '/login',
  component: () => import('@/layout/login'),
  name: '',
  children: [
    {
      path: '',
      name: 'login',
      component: () => import('@/views/login')
    }
  ]
};
