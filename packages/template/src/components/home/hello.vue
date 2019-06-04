<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: {
    msg: String
  }
};
</script>

<style scoped lang="less">
.hello {
  color: #42b983;
}
</style>
