import Vue from 'vue';

const commonComponent = require.context('./', false, /\.vue$/);

commonComponent.keys().forEach(i => {
  Vue.component(
    `com${/[A-Za-z-]+/.exec(i)[0].replace(/^[a-z]/g, L => L.toUpperCase())}`,
    commonComponent(i).default
  );
});
