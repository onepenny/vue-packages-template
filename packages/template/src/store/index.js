import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const isDev = process.env.NODE_ENV === 'development';

export default new Vuex.Store({
  strict: isDev,
  state: {},
  mutations: {},
  actions: {}
});
