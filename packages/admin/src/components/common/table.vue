<template>
  <div class="lt-table-container">
    <!--表格前-->
    <div class="before-table">
      <Checkbox
        v-if="tableInfo.selectAllShow == null ? true : tableInfo.selectAllShow"
        v-model="isSelectAll"
        @on-change="setSelectAllTableRows"
        >{{ tableInfo.selectAllText || $t('select_all') }}</Checkbox
      >

      <Button
        v-if="
          tableInfo.batchDelOpBeforeShow == null
            ? true
            : tableInfo.batchDelOpBeforeShow
        "
        class="batch-del-btn"
        @click="batchDel"
        >{{ tableInfo.batchDelOpBeforeText || $t('patch_del_text') }}
      </Button>

      <slot></slot>

      <Button
        v-if="tableInfo.addNewOpShow == null ? true : tableInfo.addNewOpShow"
        class="add-new-btn"
        @click="addNew"
        >{{ tableInfo.addNewOpText || $t('add_new_text') }}</Button
      >
    </div>

    <!--表格-->
    <Table
      ref="tableRef"
      class="table-container overflow-initial"
      :columns="tableInfo.tableColumns"
      :data="tableInfo.tableData"
      :loading="tableInfo.isLoading"
      @on-selection-change="setSelectTableRows"
    />

    <!--表格后-->
    <div class="after-table">
      <Checkbox
        v-if="tableInfo.selectAllShow == null ? true : tableInfo.selectAllShow"
        v-model="isSelectAll"
        @on-change="setSelectAllTableRows"
        >{{ tableInfo.selectAllText || $t('select_all') }}</Checkbox
      >
      <Button
        v-if="
          tableInfo.batchDelOpAfterShow == null
            ? true
            : tableInfo.batchDelOpAfterShow
        "
        class="batch-del-btn"
        @click="batchDel"
        >{{ tableInfo.batchDelOpAfterText || $t('patch_del_text') }}</Button
      >
    </div>

    <!--分页组件-->
    <pagination
      v-if="
        tableInfo.supportPagination == null ? true : tableInfo.supportPagination
      "
      :page.sync="tableInfo.page"
      :length.sync="tableInfo.perPage"
      :total="tableInfo.total"
      @pagination="setPage"
    />
  </div>
</template>
<script>
/**
 * 表格的封装: 包含: 表格 + 表格操作-分页等常用表格附件
 */
import Pagination from './pagination';

export default {
  name: 'com-table',
  components: {
    Pagination
  },
  props: {
    /**
     * 搜索条数据
     * 非必填
     * {
     *   showLabel:   {Boolean} 是否显示label 默认false,
     *   placeholder: {String} 提示文案
     *   }
     */
    searchInfo: {
      type: Object,
      default: () => ({})
    },
    /**
     * 表格相关数据
     * 必填
     * {
     *   page:                 {Number} 当前页数    非必填                 默认: 1
     *   perPage:              {Number} 每页展示数 非必填                  默认: 10
     *   total:                {Number} 总页数  非必填                     默认: 0
     *
     *   isLoading:            {Boolean} loading开关  非必填               默认: false
     *   tableColumns:         {Array} 表格列渲染配置 必填                  默认: []
     *   tableData:            {Array} 表格数据 必填                        默认: []
     *   batchDelOpBeforeShow: {Boolean} 表格之前-批量操作按钮展示开关 非必填  默认: true
     *   batchDelOpAfterShow:  {Boolean} 表格之后-批量操作按钮展示开关 非必填  默认: true
     *   addNewOpShow:         {Boolean} 新增操作按钮展示开关 非必填          默认: true
     *   selectAllShow:        {Boolean} 全选操作按钮展示开关 非必填          默认: true
     *
     *   batchDelOpBeforeText: {String} 批量删除按钮文案 非必填              默认: '批量删除'
     *   batchDelOpAfterText:  {String} 表格下方的批量删除按钮文案 非必填     默认: '批量删除外'
     *   addNewOpText:         {String} 新增按钮文案 非必填                 默认: '+ 新增'
     *   selectAllText:        {String} 全选文案 非必填                     默认: "全选"
     *
     *   supportPagination:    {Boolean} 支持分页, 非必填,                   默认: true
     * }
     * slot: 批量删除-新增按钮之间的占位
     *
     */
    tableInfo: {
      type: Object,
      default: () => ({}),
      required: true,
      validator(val = {}) {
        let ret = true;
        if (!('tableColumns' in val && Array.isArray(val.tableColumns))) {
          ret = false;
          throw `com-table属性tableInfo需包含属性tableColumns, 且类型为数组 而非${toString.call(
            val.tableColumns
          )}`;
        } else if (!('tableData' in val && Array.isArray(val.tableData))) {
          ret = false;
          throw `com-table属性tableInfo需包含属性tableData, 且类型为数组 而非${toString.call(
            val.tableData
          )}`;
        }
        return ret;
      }
    }
  },
  data() {
    return {
      isSelectAll: false,
      selectedTableRows: []
    };
  },
  methods: {
    setSelectTableRows(rows) {
      this.selectedTableRows = rows;
      this.isSelectAll =
        this.selectedTableRows.length === this.tableInfo.tableData.length;
    },
    setSelectAllTableRows(status) {
      this.$refs.tableRef.selectAll(status);
    },
    batchDel() {
      this.$emit('batch-del', this.selectedTableRows);
    },
    addNew() {
      this.$emit('add-new');
    },
    setPage(obj) {
      this.$emit('set-page', obj);
    }
  }
};
</script>
<style lang="less" scoped>
.before-table,
.after-table {
  padding: 0 10px 10px;
  min-height: 40px;
  position: relative;
  .batch-del-btn {
    margin-left: 10px;
  }
  .add-new-btn {
    position: absolute;
    right: 0;
    color: white;
    background-color: black;
  }
}
.after-table {
  margin-top: 10px;
}
</style>
<i18n>
{
  "en": {
    "select_all": "全选",
    "patch_del_text": "批量删除",
    "add_new_text": "+ 新增"
  },
  "zh-CN": {
    "select_all": "全选",
    "patch_del_text": "批量删除",
    "add_new_text": "+ 新增"
  }
}
</i18n>
