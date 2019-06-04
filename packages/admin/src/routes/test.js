export default {
  path: '/test',
  component: () => import('@/layout/login'),
  children: [
    {
      path: 'echarts',
      name: 'testEchrts',
      component: () => import('@/views/test/echarts')
    },
    {
      path: 'ec2',
      name: 'EC2',
      component: () => import('@/views/test/ec2')
    },
    {
      path: 'ec3',
      name: 'EC3',
      component: () => import('@/views/test/ec3')
    }
  ]
};
