<template>
  <div class="filter-item">
    <label>{{ label }}</label>
    <Select
      v-model="selectValue"
      clearable
      class="select"
      :placeholder="placeholder || $t('global_select_please')"
      @on-change="change"
    >
      <Option v-for="i in data" :key="i[value]" :value="i[value]">
        {{ i[text] }}
      </Option>
    </Select>
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
.select {
  width: 150px;
}
</style>
