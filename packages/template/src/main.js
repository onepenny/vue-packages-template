import Vue from 'vue';
import Router from 'vue-router';
import App from './app';
import routes from './routes';
import getRouter from 'lt-router';
import store from './store';
import './registerServiceWorker';
import VueI18n from 'vue-i18n';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    en: {},
    'zh-CN': {}
  }
});

new Vue({
  router: getRouter(routes),
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');
