module.exports = {
  title: '模版',
  proxy: {
    '/api': {
      target: 'http://style3d.com',
      ws: true,
      changeOrigin: true
    }
  },
  port: 9000,
  baseUrl: '/admin',
  api: {
    local: '/api',
    dev: '/api',
    pre: '/api',
    pro: '/api'
  }
};
