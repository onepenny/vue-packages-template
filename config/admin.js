module.exports = {
  title: 'admin',
  proxy: {
    '/api': {
      target: 'http://192.168.31.3:7070',
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
