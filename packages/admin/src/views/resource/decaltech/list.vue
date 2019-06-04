<template>
  <div v-if="type == 'list'">
    <com-search @search="searchList($event, 'keywords')" />
    <div class="filter-container" />
    <com-table
      :tableInfo="tableInfo"
      @set-page="setPage"
      @batch-del="deleteList($event, $t('decal_tec_batch_del_confirm'))"
      @add-new="changeType('form')"
    />
  </div>

  <decaltech-form v-else :changeType="changeType" :id="formId" />
</template>

<script>
import {
  getDecaltechList,
  postDeleteDecaltechList
} from '@/service/resource/decaltech';
import { listMixin } from '@/mixins/resource/listMixin';
import decaltechForm from '@/views/resource/decaltech/form';

export default {
  components: {
    decaltechForm
  },
  data() {
    return {
      tableInfo: {
        tableColumns: [
          // {
          //   type: "selection",
          //   width: 80
          // },
          {
            title: this.$t('decal_tec_table_thumb'),
            key: 'thumb',
            className: 'col-thumb',
            render: (h, { row }) => (
              <img
                style="cursor: pointer"
                src={row.thumbPath}
                vOn:click={() => this.changeType('form', row.id)}
              />
            )
          },
          {
            title: this.$t('global_table_name'),
            key: 'name',
            render: (h, { row }) => (
              <div>
                <p>{row.name}</p>
                <p
                  style={{
                    display: row.is_system ? 'inline-block' : 'none',
                    color: '#fff',
                    background: '#ec725b',
                    letterSpacing: '2px',
                    borderRadius: '5px',
                    marginTop: '10px',
                    padding: '3px 6px'
                  }}
                >
                  {this.$t('global_default')}
                </p>
              </div>
            )
          },
          {
            title: this.$t('global_uploader'),
            key: 'uploader',
            render: (h, { row }) => (
              <div>
                <p>{row.uploade}</p>
                <p>{row.created_at}</p>
              </div>
            )
          },
          {
            title: this.$t('global_operate'),
            key: 'ope',
            className: 'col-ope',
            render: (h, { row }) => {
              return (
                <div>
                  <p
                    class="list-operate"
                    vOn:click={() => this.changeType('form', row.id)}
                    style={{
                      display: row.editAble ? 'block' : 'none'
                    }}
                  >
                    {this.$t('global_edit')}
                  </p>
                  <p
                    class="list-operate"
                    vOn:click={() => this.disabled(row)}
                    style={{
                      display: this.isAdmin ? 'none' : 'block'
                    }}
                  >
                    {row.disabled
                      ? this.$t('global_enable')
                      : this.$t('global_disable')}
                  </p>

                  <p
                    class="list-operate"
                    vOn:click={() =>
                      this.deleteList([row], this.$t('decal_tec_del_confirm'))
                    }
                    style={{
                      display: row.editAble ? 'block' : 'none',
                      color: 'rgb(242, 109, 96)'
                    }}
                  >
                    {this.$t('global_delete')}
                  </p>
                </div>
              );
            }
          }
        ],
        tableData: [],
        selectAllShow: false,
        batchDelOpBeforeShow: false
      },
      dataRes: [], // 全部数据
      searchParams: {
        page: this.$G.resourceList.DEFAULTPAGE,
        perPage: this.$G.resourceList.PERPAGE,
        editMode: 1, //详情模式
        searchInfo: 1,
        keywords: ''
      },
      postDeleteList: postDeleteDecaltechList,
      type: 'list', // 表单类型，目前有 list、form 两种类型
      formId: '' // 表单 id
    };
  },
  mixins: [listMixin],
  methods: {
    async getList() {
      this.tableInfo.isLoading = true;
      let res = await getDecaltechList({ ...this.searchParams });
      this.tableInfo.isLoading = false;

      this.dataRes = res;

      // 列表数据
      this.tableInfo.tableData = res.list.data;
      this.tableInfo.page = res.list.current;
      this.tableInfo.total = res.list.total;
    },
    share() {},
    preview() {},
    download() {},
    disabled() {},
    handelAuditStatus() {}
  }
};
</script>

<style lang="less"></style>

<i18n>
{
  "zh-CN": {
    "decal_tec_table_thumb": "工艺效果图",
    "decal_tec_del_confirm": "确认要删除当前绣花工艺吗？",
    "decal_tec_batch_del_confirm": "确认要删除这些绣花工艺吗？"
  },
  "en": {
    "decal_tec_table_thumb": "Process",
    "decal_tec_del_confirm": "Confirm to delete the current pattern?",
	  "decal_tec_batch_del_confirm": "Confirm to delete the selected patterns?"
  }
}
</i18n>
