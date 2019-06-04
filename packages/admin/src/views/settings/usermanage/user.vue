<template>
  <div class="open-container">
    <com-search
      :showLabel="searchInfo.showLabel"
      :placeholder="searchInfo.placeholder"
      v-model="tableInfo.keyword"
      @search="toSearch"
      @change="changekeyword"
    />
    <div class="filter-container">
      <div class="filter-item">
        <label>{{ $t('organize') }}: </label>
        <Cascader
          change-on-select
          v-model="tableSet.organize"
          :placeholder="$t('global_organize_placeholder')"
          :data="organizeData"
          class="w100"
          style="display: inline-block;"
        ></Cascader>
      </div>
      <!--角色暂时不做-->
      <!--<div class="filter-item">-->
      <!--<label>{{ '角色' }}: </label>-->
      <!--<Select-->
      <!--v-model="tableSet.role"-->
      <!--clearable-->
      <!--class="w100"-->
      <!--:placeholder="$t('select_please')"-->
      <!--&gt;-->
      <!--<Option v-for="(role, index) in roleArr" :key="index" :value="role">-->
      <!--{{ role }}-->
      <!--</Option>-->
      <!--</Select>-->
      <!--</div>-->
      <div class="filter-item">
        <label>{{ $t('position') }}: </label>
        <Select
          v-model="tableSet.station"
          clearable
          class="w100"
          :placeholder="$t('select_please')"
        >
          <Option
            v-for="(sta, index) in stationArr"
            :key="index"
            :value="sta.id"
          >
            {{ sta.name }}
          </Option>
        </Select>
      </div>
      <div class="filter-item">
        <label>{{ $t('forbidden') }}: </label>
        <Select
          v-model="tableSet.forbidden"
          clearable
          class="w100"
          :placeholder="$t('select_please')"
        >
          <Option
            v-for="(forb, index) in forbiddenArr"
            :key="index"
            :value="forb.value"
          >
            {{ forb.label }}
          </Option>
        </Select>
      </div>
      <!--<Button class="filter-btn" @click="reload">{{ $t('filter') }}</Button>-->
    </div>
    <com-table
      :tableInfo="tableInfo"
      @add-new="addNew"
      @set-page="setPage"
      style="max-width: 951px;"
    />
    <Spin fix size="large" v-if="showLoading"></Spin>
  </div>
</template>

<script>
import {
  getUserList as getUserListApi,
  deleteUser as deleteUserApi
} from '@/service/settings/user';
import { formatOrganizeData } from 'lt-utils/format';
import { debounce } from 'lt-utils/op';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';

export default {
  name: 'User',
  mixins: [pageLoadingMixin],
  data() {
    return {
      FORBIDDEN_NUM_TO_LABEL_MAP: {
        0: this.$t('no'),
        1: this.$t('yes')
      },
      searchInfo: {
        showLabel: false,
        placeholder: this.$t('search_username_nickname_phone'),
        keyword: ''
      },
      tableInfo: {
        page: 1,
        perPage: 10,

        // batchDelOpBeforeShow: false,
        // batchDelOpAfterShow: false,
        // addNewOpShow: false,
        // batchDelOpBeforeText: '批量删除外',
        // batchDelOpAfterText: '批量删除外下',
        // selectAllText: '全选外',
        batchDelOpBeforeShow: false,
        batchDelOpAfterShow: false,
        selectAllShow: false,
        addNewOpText: this.$t('add_user_btn_text'),

        tableColumns: [
          { title: this.$t('username'), key: 'userName', width: 100 },
          { title: this.$t('name'), key: 'trueName', width: 100 },
          { title: this.$t('position'), key: 'position', width: 100 },
          { title: this.$t('organize'), key: 'organizeName', width: 100 },
          {
            title: this.$t('forbidden'),
            width: 90,
            render: (h, param) => {
              return h(
                'div',
                this.FORBIDDEN_NUM_TO_LABEL_MAP[+param.row.isLock]
              );
            }
          },
          { title: this.$t('email'), key: 'email', width: 190 },
          { title: this.$t('phone'), key: 'mobile', width: 120 },
          {
            title: this.$t('op'),
            className: 'operation',
            width: 160,
            align: 'center',
            render: (h, param) => {
              return h('div', [
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        this.delUser(param.row);
                      }
                    }
                  },
                  this.$t('del')
                ),
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        this.editUser(param.row);
                      }
                    }
                  },
                  this.$t('edit')
                )
              ]);
            }
          }
        ],
        tableData: []
      },
      tableSet: {
        organize: [], // 部门id数组
        // role: '', // 角色 暂时不做
        position: '', // 岗位
        forbidden: '' // 是否禁止
      },
      organizeData: [],
      // roleArr: [], // 角色 暂时不做
      stationArr: [],
      forbiddenArr: [
        {
          value: -1,
          label: this.$t('all')
        },
        {
          value: 1,
          label: this.$t('no')
        },
        {
          value: 0,
          label: this.$t('yes')
        }
      ]
    };
  },
  watch: {
    'tableSet.organize': {
      handler: function() {
        debounce(this.reload.bind(this), 1000)();
      }
    },
    'tableSet.position': {
      handler: function() {
        this.reload();
        debounce(this.reload.bind(this), 500)();
      }
    },
    'tableSet.forbidden': {
      handler: function() {
        debounce(this.reload.bind(this), 500)();
      }
    }
  },
  methods: {
    setTableLoading(bool) {
      this.tableInfo.isLoading = bool;
    },
    toSearch(val) {
      this.searchInfo.keyword = val;
      this.getUserList();
    },
    changekeyword(val) {
      this.searchInfo.keyword = val;
    },
    addNew() {
      this.$router.push(this.$G.route.opuser);
    },
    reload() {
      this.getUserList();
    },
    async getUserList() {
      let { keyword } = this.searchInfo;
      let { page, perPage } = this.tableInfo;
      let { organize, position, forbidden } = this.tableSet;
      let param = {
        keyword,
        page: page || 1,
        perPage,
        organizeId: organize.length ? organize[organize.length - 1] : '',
        positionId: position,
        isLock: forbidden === -1 ? '' : !!forbidden
      };

      this.triggerLoading(true);
      let { data } = await getUserListApi(param);
      this.triggerLoading(false);
      let { organizeTree, positionList, table } = data;
      this.organizeData = formatOrganizeData(organizeTree);
      this.stationArr = positionList;

      this.tableInfo.page = table.current;
      this.tableInfo.total = table.page;
      let tableData = table.data;
      tableData.forEach((item, i) => {
        item.index = i;
      });
      this.tableInfo.tableData = tableData;
    },
    async delUser({ id }) {
      this.triggerLoading(true);
      let res = await deleteUserApi({ id });
      if (res) {
        this.triggerLoading(false);
        this.successTipAndReload();
      }
    },
    editUser({ id }) {
      this.$router.push(`${this.$G.route.opuser}?edit=1&id=${id}`);
    },
    setPage(obj) {
      this.tableInfo.page = obj.page;
      this.tableInfo.perPage = obj.length;
      this.reload();
    },
    successTipAndReload() {
      this.$Message.success(this.$t('global_operate_success'));
      setTimeout(() => {
        this.getUserList();
      }, 500);
    }
  },
  mounted() {
    this.setTableLoading(true);
    this.getUserList();
    this.setTableLoading(false);
  }
};
</script>

<style lang="less" scoped>
.open-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

<i18n>
{
  "en": {
    "select_please": "请选择",
    "search_username_nickname_phone": "搜索用户名、姓名、联系电话",
    "username": "用户名",
    "name": "姓名",
    "position": "岗位",
    "organize": "部门",
    "forbidden": "是否禁止",
    "underPeopleCount": "下级人数",
    "email": "电子邮件",
    "phone": "联系电话",
    "op": "操作",
    "del": "删除",
    "edit": "编辑",
    "filter": "筛选",
    "all": "所有",
    "no": "否",
    "yes": "是",
    "add_user_btn_text": "+ 新增员工"
  },
  "zh-CN": {
    "select_please": "请选择",
    "search_username_nickname_phone": "搜索用户名、姓名、联系电话",
    "username": "用户名",
    "name": "姓名",
    "position": "岗位",
    "organize": "部门",
    "forbidden": "是否禁止",
    "underPeopleCount": "下级人数",
    "email": "电子邮件",
    "phone": "联系电话",
    "op": "操作",
    "del": "删除",
    "edit": "编辑",
    "filter": "筛选",
    "all": "所有",
    "no": "否",
    "yes": "是",
    "add_user_btn_text": "+ 新增员工"
  }
}
</i18n>
