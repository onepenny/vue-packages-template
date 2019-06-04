<template>
  <div class="filter-item">
    <label>{{ label }}</label>
    <Cascader
      class="cascader"
      @on-change="change"
      :placeholder="$t('global_select_please')"
      :data="data"
    >
    </Cascader>
  </div>
</template>

<script>
export default {
  props: {
    // 数据源
    data: {
      type: Array,
      default: () => []
    },
    // 选择标签
    label: {
      type: String,
      default: ''
    },
    // 选择框 placeholder
    placeholder: {
      type: String,
      default: ''
    },
    // 选择框显示文本键名
    text: {
      type: String,
      default: ''
    },
    // 选择框返回值的键名
    value: {
      default: 'value'
    }
  },
  data() {
    return {
      selectValue: ''
    };
  },
  methods: {
    change(value) {
      this.$emit('select', value);
    }
  }
};
</script>

<style lang="less" scoped>
.cascader {
  display: inline-block;
  width: 150px;
}
</style>
