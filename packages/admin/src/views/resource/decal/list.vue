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
      <com-cascader
        :label="`${$t('global_table_type')}：`"
        :data="dataTypes"
        @select="searchList($event, 'category', 'type')"
      />
    </div>
    <com-table
      :tableInfo="tableInfo"
      @set-page="setPage"
      @batch-del="deleteList($event, $t('decal_batch_del_confirm'))"
      @add-new="changeType('form')"
    />
  </div>

  <decal-form v-else :changeType="changeType" :id="formId" />
</template>

<script>
import { getDecalList, postDeleteDecalList } from '@/service/resource/decal';
import { handleCascaderData } from '@/config/utils';
import { listMixin } from '@/mixins/resource/listMixin';
import decalForm from '@/views/resource/decal/form';

export default {
  components: {
    decalForm
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
            title: this.$t('global_table_name'),
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
            title: this.$t('global_table_type'),
            key: 'type',
            render: (h, { row }) => (
              <span>
                {row.category} - {row.type}
              </span>
            )
          },
          {
            title: this.$t('global_table_price'),
            key: 'price',
            render: (h, { row }) => (
              <span>
                {this.dataRes['price_unit'] || '￥'}
                {row.price}
              </span>
            )
          },
          {
            title: this.$t('global_uploader'),
            key: 'uploader',
            render: (h, { row }) => (
              <span>
                {row.uploader}
                <br />
                {row.created_at}
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
                      this.deleteList([row], this.$t('decal_del_confirm'))
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
      dataTypes: [], // 类型
      dataRes: [], // 全部数据
      searchParams: {
        page: this.$G.resourceList.DEFAULTPAGE,
        perPage: this.$G.resourceList.PERPAGE,
        editMode: 1, //详情模式
        searchInfo: 1,
        priceRange: '',
        category: '',
        type: '',
        uploader: '',
        keywords: ''
      },
      postDeleteList: postDeleteDecalList,
      type: 'list', // 表单类型，目前有 list、form 两种类型
      formId: '' // 表单 id
    };
  },
  mixins: [listMixin],
  methods: {
    async getList() {
      this.tableInfo.isLoading = true;
      let res = await getDecalList({ ...this.searchParams });
      this.tableInfo.isLoading = false;

      this.dataRes = res;

      // 列表数据
      this.tableInfo.tableData = res.decals.data;
      this.tableInfo.page = res.decals.current;
      this.tableInfo.total = res.decals.total;

      // 搜索数据源
      this.dataUploader = res.searchInfo['uploader'];
      this.dataPrice = res.searchInfo['prices'];
      this.dataTypes = handleCascaderData(
        res.searchInfo['types'],
        this.$t('global_whole')
      );
    },
    share() {},
    preview() {},
    download() {},
    handelAuditStatus() {}
  }
};
</script>

<style lang="less"></style>

<i18n>
{
  "zh-CN": {
    "decal_batch_del_confirm": "确认要删除这些绣花吗？",
    "decal_del_confirm": "确认要删除当前绣花吗？"
  },
  "en": {
    "decal_batch_del_confirm": "Confirm to delete the selected patterns?",
    "decal_del_confirm": "Confirm to delete the current pattern?"
  }
}
</i18n>
