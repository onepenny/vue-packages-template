<template>
  <div v-if="type == 'list'">
    <com-search @search="searchList($event, 'keywords')" />
    <div class="filter-container">
      <com-select
        :label="`${$t('global_system_adder')}：`"
        :data="dataUploader"
        :value="'id'"
        :text="'introduction'"
        @select="searchList($event, 'uploader')"
      />
      <com-select
        :label="`${$t('global_price')}：`"
        :data="dataPrice"
        :text="'label'"
        @select="searchList($event, 'priceRange')"
      />
      <com-select
        :label="`${$t('global_provider')}：`"
        :data="dataSuppliers"
        :value="`id`"
        :text="'name'"
        @select="searchList($event, 'supplier')"
      />
      <com-cascader
        :label="`${$t('accessory_position_category')}：`"
        :data="dataTypes"
        @select="searchList($event, 'category', 'type')"
      />
      <com-cascader
        :label="`${$t('accessory_trims_category')}：`"
        :data="dataTrims"
        @select="
          searchList($event, 'trimsCategoryParent', 'trimsCategoryChild')
        "
      />
    </div>
    <com-table
      :tableInfo="tableInfo"
      @set-page="setPage"
      @batch-del="deleteList($event, $t('accessory_batch_del_confirm'))"
      @add-new="changeType('form')"
    />
  </div>

  <accessory-form v-else :changeType="changeType" :id="formId" />
</template>

<script>
import {
  getAccessoryList,
  postDeleteAccessoryList
} from '@/service/resource/accessory';
import { handleCascaderData } from '@/config/utils';
import { listMixin } from '@/mixins/resource/listMixin';
import accessoryForm from '@/views/resource/accessory/form';

export default {
  components: {
    accessoryForm
  },
  data() {
    return {
      tableInfo: {
        tableColumns: [
          {
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: this.$t('global_table_thumb'),
            key: 'thumbPath',
            width: 140,
            render: (h, { row }) => (
              <img
                style="width: 100px;height: 100px;margin: 10px 0;cursor: pointer"
                src={row.thumbPath}
                vOn:click={() => this.changeType('form', row.id)}
              />
            )
          },
          {
            title: this.$t('accessory_data_name'),
            key: 'name',
            render: (h, { row }) => (
              <span
                style="cursor: pointer;font-weight: bold"
                vOn:click={() => this.changeType('form', row.id)}
              >
                {row.name}
              </span>
            )
          },
          {
            title: this.$t('accessory_data_number'),
            key: 'number'
          },
          {
            title: this.$t('accessory_data_internal_code'),
            key: 'internal_code'
          },
          {
            title: this.$t('accessory_data_trims_category'),
            key: 'reTrimsCategoryParent',
            render: (h, { row }) => (
              <span>
                {row.reTrimsCategoryParent}-{row.reTrimsCategoryChild}
              </span>
            )
          },
          {
            title: this.$t('accessory_data_type'),
            key: 'reCategories',
            render: (h, { row }) => (
              <span>{row?.reCategories?.map(i => i.join('-')).join('/')}</span>
            )
          },
          {
            title: this.$t('accessory_data_price'),
            key: 'price',
            render: (h, { row }) => (
              <span>
                {this.dataRes['price_unit'] || '￥'}
                {row.price}
              </span>
            )
          },
          {
            title: this.$t('accessory_data_remarks'),
            key: 'remarks'
          },
          {
            title: this.$t('global_uploader'),
            key: 'uploader',
            render: (h, params) => (
              <span>
                {params.row.uploader}
                <br />
                {params.row.created_at}
              </span>
            )
          },
          {
            title: this.$t('global_operate'),
            width: 140,
            render: (h, { row }) => {
              return (
                <div>
                  <p
                    class="list-operate"
                    style={{
                      color: '#f26d60',
                      display: row['is_owner'] ? '' : 'none'
                    }}
                    vOn:click={() =>
                      this.deleteList([row], this.$t('accessory_del_confirm'))
                    }
                  >
                    {this.$t('global_delete')}
                  </p>
                  <p
                    class="list-operate"
                    vOn:click={() => this.changeType('form', row.id)}
                  >
                    {this.$t('global_edit')}
                  </p>
                  <p class="list-operate" vOn:click={() => this.preview(row)}>
                    {this.$t('global_preview')}
                  </p>
                  <p
                    class="list-operate"
                    style={{
                      display: row['in_audit'] == '1' ? '' : 'none'
                    }}
                    vOn:click={() => {
                      if (this.dataRes.auditAble) {
                        this.handelAuditStatus(row['id'], '0');
                      }
                    }}
                  >
                    {this.dataRes.auditAble
                      ? this.$t('global_audit_pass')
                      : this.$t('global_audit_pending')}
                  </p>
                  <p
                    class="list-operate"
                    style={{
                      display: row['in_audit'] == '1' ? '' : 'none'
                    }}
                    vOn:click={() => {
                      if (this.dataRes.auditAble) {
                        this.handelAuditStatus(row['id'], '2');
                      }
                    }}
                  >
                    {this.dataRes.auditAble ? this.$t('global_audit_fail') : ''}
                  </p>
                </div>
              );
            }
          }
        ],
        tableData: []
      },
      dataUploader: [], // 添加者
      dataPrice: [], // 价格
      dataSuppliers: [], // 供应商
      dataTypes: [], // 位置分类
      dataTrims: [], // 辅料分类
      // dataRes: [], // 全部数据
      searchParams: {
        page: this.$G.resourceList.DEFAULTPAGE,
        perPage: this.$G.resourceList.PERPAGE,
        editMode: 1, //详情模式
        category: '',
        type: '',
        uploader: '',
        priceRange: '',
        supplier: '',
        keywords: '',
        trimsCategoryParent: '',
        trimsCategoryChild: '',
        searchInfo: 1
      },
      postDeleteList: postDeleteAccessoryList,
      type: 'list', // 表单类型，目前有 list、form 两种类型
      formId: '' // 表单 id
    };
  },
  mixins: [listMixin],
  methods: {
    async getList() {
      this.tableInfo.isLoading = true;
      let res = await getAccessoryList({ ...this.searchParams });
      this.tableInfo.isLoading = false;

      this.dataRes = res;

      // 列表数据
      this.tableInfo.tableData = res.accessories.data;
      this.tableInfo.page = res.accessories.current;
      this.tableInfo.total = res.accessories.total;

      // 搜索数据源
      this.dataUploader = res.searchInfo['uploader'];
      this.dataPrice = res.searchInfo['prices'];
      this.dataSuppliers = res.searchInfo['suppliers'];
      this.dataTypes = handleCascaderData(
        res.searchInfo['types'],
        this.$t('global_whole')
      );
      this.dataTrims = handleCascaderData(res.searchInfo['trims_category']);
    },
    share() {},
    preview() {},
    download() {},
    handelAuditStatus() {}
    // mixins searchList
    // mixins deleteList
  }
};
</script>

<style lang="less"></style>

<i18n>
{
  "zh-CN": {
    "accessory_data_name":"名称",
    "accessory_data_supplier":"供应商",
    "accessory_data_number":"供应商编号",
    "accessory_data_color_code":"供应商色号",
    "accessory_data_price":"参考价格",
    "accessory_data_internal_code":"内部编号",
    "accessory_data_type":"位置分类",
    "accessory_data_trims_category":"辅料分类",
    "accessory_data_remarks":"备注",
    "accessory_info":"辅料简介",
    "accessory_no_style":"暂无可显示款式，请联系管理员配置辅料款式",
    "accessory_position_category": "位置分类",
    "accessory_trims_category": "辅料分类",
    "accessory_sort":"整理辅料",
    "accessory_no_data":"没有相关的辅料~",
    "accessory_category":"类别",
    "accessory_position_category":"位置分类",
    "accessory_trims_category":"辅料分类",
    "accessory_back":"返回辅料",
    "accessory_add":"新增辅料",
    "accessory_del_confirm":"确认要删除当前辅料吗？",
    "accessory_batch_del_confirm":"确认要删除这些辅料吗？",
    "accessory_placeholder_supplier":"辅料供应商",
    "accessory_placeholder_name":"请输入辅料名称",
    "accessory_placeholder_number":"请输入辅料编号",
    "accessory_placeholder_price":"请输入辅料价格",
    "accessory_placeholder_constituent":"请输入辅料成分",
    "accessory_add_success":"新增辅料成功！",
    "accessory_edit_success":"编辑辅料成功！"
  },
  "en": {
    "accessory_data_name":"Name",
    "accessory_data_supplier":"Supplier",
    "accessory_data_number":"Supplier Product Code",
    "accessory_data_color_code":"Supplier Color Code",
    "accessory_data_price":"Refer. Price",
    "accessory_data_internal_code":"Internal Code",
    "accessory_data_type":"Position Category",
    "accessory_data_trims_category":"Trims Category",
    "accessory_data_remarks":"Remarks",
    "accessory_info":"Brief Introduction",
    "accessory_no_style":"No style to display. Please contact the administrator to configure the accessory style",
    "accessory_position_category": "Position Category",
    "accessory_trims_category": "Trims Category",
    "accessory_sort":"Management",
    "accessory_no_data":"No data~",
    "accessory_category":"Type",
    "accessory_position_category":"Position Category",
    "accessory_trims_category":"Trims Category",
    "accessory_back":"Back to Accessories",
    "accessory_add":"Add",
    "accessory_del_confirm":"Confirm to delete the current accessory?",
    "accessory_batch_del_confirm":"Confirm to delete the selected accessories?",
    "accessory_placeholder_supplier":"Accessory supplier",
    "accessory_placeholder_name":"Accessory name",
    "accessory_placeholder_number":"Accessory number",
    "accessory_placeholder_price":"Accessory price",
    "accessory_placeholder_constituent":"Accessory constituent",
    "accessory_add_success":"Accessory successfully added!",
    "accessory_edit_success":"Accessory successfully updated!"
  }
}
</i18n>
