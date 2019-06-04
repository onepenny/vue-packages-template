<template>
  <div class="pagination-container">
    <Page
      :current.sync="currentPage"
      :page-size-opts="pageSizes"
      :page-size="pageSize"
      :total="total"
      :show-elevator="showElevator"
      :show-sizer="showSizer"
      :show-total="showTotal"
      size="small"
      @on-page-size-change="sizeChange"
      @on-change="currentChange"
    />
  </div>
</template>

<script>
/**
 * @desc 基于 iview 的翻页组件
 * @file pagination.vue
 * @author Ben <zhanghuguang@linctex.com>
 * @since 2019-3-19
 * @copyright 2019
 */

export default {
  name: 'pagination',
  props: {
    total: {
      required: true,
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: [Array, Function],
      default() {
        return [10, 20, 30, 50];
      }
    },
    page: {
      type: Number,
      default: 1
    },
    showElevator: {
      type: Boolean,
      default: true
    },
    showSizer: {
      type: Boolean,
      default: true
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageSize: 10
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(index) {
        this.$emit('update:page', index);
      }
    }
  },
  watch: {},
  created() {
    this.pageSize = this.length;
  },
  methods: {
    // 设置当前页数量
    sizeChange(length) {
      this.pageSize = length;
      if (this.currentPage === 1) {
        this.$emit('pagination', { page: 1, length: length });
      }
    },
    // 翻页
    currentChange(page) {
      this.$emit('pagination', { page: page, length: this.pageSize });
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>
