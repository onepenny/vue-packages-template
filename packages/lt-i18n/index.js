import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from './en/index';
import zhLocale from './zh/index';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    en: { ...enLocale },
    'zh-CN': { ...zhLocale }
  },
  silentTranslationWarn: true
});
export default i18n;
