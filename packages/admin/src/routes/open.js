export default {
  path: '/open',
  component: () => import('@/layout/basic'),
  name: '',
  children: [
    {
      path: '',
      name: 'open',
      component: () => import('@/views/open')
    }
  ]
};
