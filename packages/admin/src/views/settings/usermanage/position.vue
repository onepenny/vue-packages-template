<template>
  <div class="station-container setting-container">
    <div class="title">{{ this.$t('position_manage') }}</div>
    <div class="content">
      <com-table
        :tableInfo="tableInfo"
        @add-new="addNew"
        @set-page="setPage"
        style="max-width: 800px;"
      >
        <Button class="back-btn" @click="back">{{ $t('global_back') }}</Button>
      </com-table>
    </div>
    <!--新增岗位弹框-->
    <Modal
      v-model="opStationData.showModal"
      width="320"
      @on-cancel="closeAddStationModal"
    >
      <p slot="header" style="text-align:center">
        <span>{{
          opStationData.edit ? $t('edit_station') : $t('new_station')
        }}</span>
      </p>
      <div class="add-station-content">
        <Form ref="opStationForm" :model="opStationData" :rules="opStationRule">
          <FormItem :label="$t('name') + ':'" prop="name">
            <Input
              type="text"
              v-model="opStationData.name"
              :placeholder="$t('name_placeholder')"
            />
          </FormItem>
          <FormItem :label="$t('description') + ':'" prop="description">
            <Input
              type="text"
              v-model="opStationData.description"
              :placeholder="$t('description_placeholder')"
            />
          </FormItem>
          <FormItem :label="$t('position') + ':'" prop="position">
            <Input
              type="text"
              v-model="opStationData.position"
              :placeholder="$t('position_placeholder')"
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <div style="text-align: center;">
          <Button class="w120" @click="confirmAddStationModal">{{
            $t('save')
          }}</Button>
        </div>
      </div>
    </Modal>
    <Spin fix size="large" v-if="showLoading"></Spin>
  </div>
</template>
<script>
import {
  positionList as positionListApi,
  addPosition as addPositionApi,
  updatePosition as updatePositionApi,
  removePosition as removePositionApi
} from '@/service/settings/position';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';

export default {
  name: 'Station',
  mixins: [pageLoadingMixin],
  data() {
    return {
      tableInfo: {
        page: 1,
        perPage: 10,

        batchDelOpBeforeShow: false,
        batchDelOpAfterShow: false,
        selectAllShow: false,

        tableColumns: [
          { title: this.$t('name'), key: 'name', width: 220 },
          { title: this.$t('description'), key: 'description', width: 220 },
          { title: this.$t('display_order'), key: 'position', width: 160 },
          {
            title: this.$t('global_operate'),
            className: 'operation',
            width: 200,
            align: 'center',
            render: (h, param) => {
              return h('div', [
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        this.del(param.row);
                      }
                    }
                  },
                  this.$t('global_delete')
                ),
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        this.edit(param.row);
                      }
                    }
                  },
                  this.$t('global_edit')
                )
              ]);
            }
          }
        ],
        tableData: []
      },
      opStationData: {
        showModal: false,
        edit: false, // true 编辑模式, false 默认的新增模式
        id: '',
        name: '',
        description: '',
        position: ''
      },
      opStationRule: {
        name: [{ required: true, message: this.$t('name_placeholder') }]
      }
    };
  },
  methods: {
    reload() {
      this.stationList();
    },
    async stationList() {
      let { page, perPage } = this.tableInfo;
      let param = {
        page,
        perPage
      };
      this.triggerLoading(true);
      let { data } = await positionListApi(param);
      this.triggerLoading(false);
      this.tableInfo.page = data.page;
      this.tableInfo.total = data.total;
      //api字段含义: {name 名称, description 显示名称, position 显示顺序}
      this.tableInfo.tableData = data.data;
    },
    addNew() {
      this.opStationData.showModal = true;
    },
    async doDel({ id }) {
      this.triggerLoading(true);
      let res = await removePositionApi({
        id
      });
      this.triggerLoading(false);
      if (res) {
        this.reload();
      }
    },
    del({ id }) {
      this.$Modal.confirm({
        content: this.$t('global_confirm_delete'),
        onOk: () => {
          this.doDel({ id });
        }
      });
    },
    edit({ id, name, description, position }) {
      this.opStationData.showModal = true;
      this.opStationData.edit = true;
      this.opStationData.id = id;
      this.opStationData.name = name;
      this.opStationData.description = description || name || '';
      this.opStationData.position = +position;
    },
    setPage(obj) {
      this.tableInfo.page = obj.page;
      this.tableInfo.perPage = obj.length;
      this.reload();
    },
    back() {
      history.go(-1);
    },
    closeAddStationModal() {
      this.resetAddStationModal();
    },
    confirmAddStationModal() {
      this.$refs.opStationForm.validate(valid => {
        if (valid) {
          let { edit, id, name, description, position } = this.opStationData;
          if (edit) {
            this.updateStation({ id, name, description, position });
          } else {
            this.addStation({ name, description, position });
          }
          this.resetAddStationModal();
        }
      });
    },
    resetAddStationModal() {
      this.opStationData.showModal = false;
      this.opStationData.id = '';
      this.opStationData.name = '';
      this.opStationData.description = '';
      this.opStationData.position = '';
    },
    async addStation({ name, description, position }) {
      this.triggerLoading(true);

      let res = await addPositionApi({ name, description, position });
      if (res) {
        this.triggerLoading(false);
        this.reload();
      }
    },
    async updateStation({ id, name, description, position }) {
      this.triggerLoading(true);

      let res = await updatePositionApi({ id, name, description, position });
      if (res) {
        this.triggerLoading(false);
        this.reload();
      }
    }
  },
  mounted() {
    this.reload();
  }
};
</script>
<style lang="less">
.station-container {
  .content {
    padding: 20px;
  }
  .back-btn {
    position: absolute;
    right: 80px;
    width: 66px;
  }
}
</style>
<i18n>
{
  "en": {
    "description": "显示名称",
    "description_placeholder": "请输入显示名称",
    "new_station": "新增岗位",
    "edit_station": "编辑岗位",
    "name": "岗位名称",
    "name_placeholder": "请输入岗位名称",
    "save": "保存",
    "position": "显示顺序",
    "position_placeholder": "请输入显示顺序",
    "position_manage": "岗位管理"
  },
  "zh-CN": {
    "description": "显示名称",
    "description_placeholder": "请输入显示名称",
    "new_station": "新增岗位",
    "edit_station": "编辑岗位",
    "name": "岗位名称",
    "name_placeholder": "请输入岗位名称",
    "save": "保存",
    "position": "显示顺序",
    "position_placeholder": "请输入显示顺序",
    "position_manage": "岗位管理"
  }

}

</i18n>
