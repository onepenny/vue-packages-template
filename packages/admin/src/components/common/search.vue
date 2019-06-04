<template>
  <span class="search-container">
    <label v-show="showLabel">{{ '搜索' }}:</label>
    <Input
      v-model="value"
      :placeholder="placeholder"
      class="search-style"
      :icon="value ? 'md-close-circle' : 'ios-search'"
      @on-click="
        () => {
          this.value = '';
          this.toChange('');
        }
      "
      @on-enter="toChange(value)"
      @on-change="onChange(value)"
    />
    <slot> </slot>
  </span>
</template>

<script>
export default {
  name: 'search',
  props: ['placeholder', 'showLabel', 'defaultValue'],
  data() {
    return {
      value: ''
    };
  },
  created: function() {
    if (this.defaultValue) {
      this.value = this.defaultValue;
    }
  },
  methods: {
    toChange: function(val) {
      this.$emit('search', val);
    },
    onChange: function(val) {
      this.$emit('change', val);
    }
  }
};
</script>
<style lang="less" scoped>
.search-container {
  padding: 0 0 0 10px;
  display: flex;
  align-items: center;
  margin-left: auto;
  .search-style {
    width: 300px;
    cursor: pointer;
    height: 100%;
    line-height: 100%;
  }
  label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-right: 10px;
  }
  .appending {
    color: #f26d60;
    font-size: 14px;
    float: right;
    cursor: pointer;
  }
  .ivu-input {
    border: 1px solid #909090;
  }
}
</style>
