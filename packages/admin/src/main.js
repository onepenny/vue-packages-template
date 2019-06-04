import Vue from 'vue';
import Router from 'vue-router';
import App from '@/app';
import routes from '@/routes';
import getRouter from 'lt-router';
import store from '@/store';
import i18n from 'lt-i18n';
import '@/components/common';
import Gloabl from '@/config/global';
import iView from '@/config/iView';
import elementUI from '@/config/elementUI'
import cascaderMulti from 'cascader-multi';
import 'iview/dist/styles/iview.css';
import '@/registerServiceWorker';
// less 文件暂时采取以前的，等 UI 确定后修改
import '@/styles/iview-ui.less'; // iview css
import '@/styles/index.less'; // global css
import '@/styles/animate.css';
import '@/styles/common.less';

Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(cascaderMulti);
Vue.use(Gloabl); // 组件内 this.$G 访问
Vue.use(iView); // 组件内 this.$G 访问
Vue.use(elementUI);

new Vue({
  router: getRouter(routes),
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');
