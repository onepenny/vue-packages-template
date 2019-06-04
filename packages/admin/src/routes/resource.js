export default {
  path: '/resource',
  component: () => import('@/layout/basic'),
  redirect: '/resource/fabric',
  children: [
    {
      path: 'fabric',
      name: 'fabric', // 和文件名相同
      component: () => import('@/views/resource/fabric/list')
    },
    {
      path: 'modelling',
      name: 'modelling', // 和文件名相同
      component: () => import('@/views/resource/modelling/list')
    },
    {
      path: 'accessory',
      name: 'accessory', // 和文件名相同
      component: () => import('@/views/resource/accessory/list')
    },
    {
      path: 'decaltech',
      name: 'decaltech', // 和文件名相同
      component: () => import('@/views/resource/decaltech/list')
    },
    {
      path: 'decal',
      name: 'decal', // 和文件名相同
      component: () => import('@/views/resource/decal/list')
    }
  ]
};
