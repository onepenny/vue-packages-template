export default {
  path: '/settings',
  component: () => import('@/layout/login'),
  redirect: '/settings/overview',
  children: [
    {
      path: 'overview',
      name: 'overview', // 和文件名相同
      component: () => import('@/views/home')
    },
    {
      path: 'usermanage/user',
      name: 'user', // 员工管理
      component: () => import('@/views/settings/usermanage/user')
    },
    {
      path: 'usermanage/test',
      name: 'test', // 员工管理
      component: () => import('@/views/settings/usermanage/test')
    },
    {
      path: 'usermanage/opuser',
      name: 'opuser', // 新增/编辑员工
      component: () => import('@/views/settings/usermanage/opuser')
    },
    {
      path: 'usermanage/organize',
      name: 'organize', // 部门管理
      component: () => import('@/views/settings/usermanage/organize')
    },
    {
      path: 'usermanage/oporganize',
      name: 'oporganize', // 新增部门
      component: () => import('@/views/settings/usermanage/oporganize')
    },
    {
      path: 'usermanage/position',
      name: 'position', // 岗位管理
      component: () => import('@/views/settings/usermanage/position')
    },
    {
      path: 'usermanage/supplier',
      name: 'supplier', // 和文件名相同
      component: () => import('@/views/home/about')
    },
    {
      path: 'category',
      name: 'category', // 和文件名相同
      component: () => import('@/views/home/about')
    },
    {
      path: 'index',
      name: 'index', // 和文件名相同
      component: () => import('@/views/home')
    },
    {
      path: 'supplierinfo',
      name: 'supplierinfo', // 和文件名相同
      component: () => import('@/views/settings/supplierinfo')
    },
    {
      path: 'systemlog',
      name: 'systemlog', // 和文件名相同
      component: () => import('@/views/home')
    },
    {
      path: 'code',
      name: 'code', // 和文件名相同
      component: () => import('@/views/home/about')
    },
    {
      path: 'helper',
      name: 'helper', // 和文件名相同
      component: () => import('@/views/home')
    }
  ]
};
