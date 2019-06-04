<template>
  <div class="home-container">
    <hello msg="后台系统" />
    <div v-for="item in series" :key="item.id">
      <img :src="item.thumb" alt="temp" />
    </div>
    <button type="primary" class="button">{{ $t('hello') }}</button>
  </div>
</template>

<script>
import Hello from '@/components/home/hello';
import { getSeries } from '@/service/home';

export default {
  name: 'home',
  components: {
    Hello
  },
  data() {
    return {
      series: []
    };
  },
  mounted() {
    this.getSeries();
  },
  methods: {
    async getSeries() {
      let res = await getSeries();
      this.series = res.data;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container .button {
  color: aqua;
}
</style>

<i18n>
{
  "en": {
    "hello": "Hello"
  },
  "zh-CN": {
    "hello": "你好"
  }
}
</i18n>
