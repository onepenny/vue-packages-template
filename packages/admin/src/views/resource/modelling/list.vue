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
        :label="`${$t('model_category')}：`"
        :data="dataGender"
        :value="'cid'"
        :text="'displayName'"
        @select="searchList($event, 'gender')"
      />
    </div>
    <com-table
      :tableInfo="tableInfo"
      @set-page="setPage"
      @batch-del="deleteList($event, $t('model_batch_del_confirm'))"
      @add-new="changeType('form')"
    />
  </div>
  <modelling-form v-else :changeType="changeType" :id="formId" />
</template>

<script>
import {
  getModellingList,
  postDeleteModellingList
} from '@/service/resource/modelling';
import { listMixin } from '@/mixins/resource/listMixin';
import modellingForm from '@/views/resource/modelling/form';

export default {
  components: {
    modellingForm
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
            title: this.$t('global_table_race'),
            key: 'race'
          },
          {
            title: this.$t('global_sex'),
            key: 'gender'
          },
          {
            title: this.$t('global_table_age'),
            key: 'age_layer'
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
                      this.deleteList([row], this.$t('model_del_confirm'))
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
      dataGender: [], // 类别
      dataRes: [], //   全部数据
      searchParams: {
        page: this.$G.resourceList.DEFAULTPAGE,
        perPage: this.$G.resourceList.PERPAGE,
        editMode: 1, //详情模式
        searchInfo: 1,
        gender: '',
        uploader: '',
        keywords: ''
      },
      postDeleteList: postDeleteModellingList,
      type: 'list', // 表单类型，目前有 list、form 两种类型
      formId: '' // 表单 id
    };
  },
  mixins: [listMixin],
  methods: {
    async getList() {
      this.tableInfo.isLoading = true;
      let res = await getModellingList({ ...this.searchParams });
      this.tableInfo.isLoading = false;

      this.dataRes = res;

      // 列表数据
      this.tableInfo.tableData = res.modellings.data;
      this.tableInfo.page = res.modellings.current;
      this.tableInfo.total = res.modellings.total;

      // 搜索数据源
      this.dataUploader = res.searchInfo['uploader'];
      this.dataGender = res.searchInfo['gender'];
    },
    editForm() {},
    share() {},
    preview() {},
    download() {}
  }
};
</script>

<style lang="less"></style>

<i18n>
{
  "zh-CN": {
    "model_sort":"整理人台",
    "model_no_data":"没有相关的人台~",
    "model_category":"类别",
    "model_back":"返回人台",
    "model_add":"新增人台",
    "model_del_confirm":"确认要删除当前人台吗？",
    "model_batch_del_confirm":"确认要删除这些人台吗？",
    "model_placeholder_name":"请输入人台名称",
    "model_face_type":"人脸类型",
    "model_face_file":"人脸模型文件",
    "model_body_file":"身体模型文件",
    "model_add_success":"新增人台成功！",
    "model_edit_success":"编辑人台成功！"
  },
  "en": {
    "model_sort":"Management",
    "model_no_data":"No data~",
    "model_category":"Type",
    "model_back":"Back to Models",
    "model_add":"Add",
    "model_del_confirm":"Confirm to delete the current model?",
    "model_batch_del_confirm":"Confirm to delete the selected models?",
    "model_placeholder_name":"Model name","model_face_type":"Face Type",
    "model_face_file":"Face Model File",
    "model_body_file":"Body Model File",
    "model_add_success":"Model successfully added!",
    "model_edit_success":"Model successfully updated!"
  }
}
</i18n>
