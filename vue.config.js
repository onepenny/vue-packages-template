const path = require('path');
const resolve = dir => path.join(__dirname, dir);
const { TARGET = 'default', ENV = '' } = process.env;
const userConfig = require(`./config/${TARGET}.js`);

process.env.VUE_APP_TITLE = userConfig.title;
process.env.VUE_APP_ENV = ENV;
process.env.VUE_APP_API = userConfig.api[ENV];
process.env.VUE_APP_BASEURL = userConfig.baseUrl;

module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: `packages/${TARGET}/src/main.js`
    }
  },
  outputDir: `packages/${TARGET}/dist`,

  // 是否为生产环境构建生成 source map
  productionSourceMap: false,

  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@': resolve(`packages/${TARGET}/src`)
      }
    }
  },

  devServer: {
    proxy: userConfig.proxy,
    port: userConfig.port
  },

  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end();
  }
};
