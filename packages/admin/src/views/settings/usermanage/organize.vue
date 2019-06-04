<template>
  <div class="organize-manage-container">
    <Tree
      ref="tree"
      class="tree-part"
      :data="treeData"
      :render="renderTree"
    ></Tree>
    <div class="table-part">
      <com-table
        :tableInfo="tableInfo"
        @add-new="addNew"
        @reload="reloadTable"
      />
    </div>
    <Spin fix size="large" v-if="showLoading"></Spin>
  </div>
</template>
<script>
/**
 *  本页面中code字段表示从部门根节点到当前节点的完整id路径_即: 'parentId:id'
 */
import {
  organizeTreeData as organizeTreeDataApi,
  organizeTableData as organizeTableDataApi,
  deleteOrganize as deleteOrganizeApi
} from '@/service/settings/organize';
import sessionInfo from 'lt-utils/sessionInfo';
import { simpleClone } from 'lt-utils/object';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';

export default {
  name: 'organizeManage',
  mixins: [pageLoadingMixin],
  data() {
    return {
      selectedTreeCode: '', //选中的树节点部门完整id路径
      treeData: [
        // {
        //   id: 1,
        //   parentId: '',
        //   title: '凌迪',
        //   peopleCount: 60,
        //   expand: true,
        //   children: [
        //     {
        //       id: 2,
        //       parentId: '1',
        //       title: '设计部门',
        //       deletable: false,
        //       peopleCount: 20,
        //       expand: true,
        //       children: []
        //     },
        //     {
        //       id: 3,
        //       title: '研发部',
        //       peopleCount: 40,
        //       expand: true,
        //       children: [
        //         {
        //           id: 31,
        //           parentId: '1:3',
        //           title: '前端组',
        //           peopleCount: 10,
        //           expand: false,
        //           children: []
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],

      tableInfo: {
        page: 1,
        perPage: 10,

        supportPagination: false,
        batchDelOpBeforeShow: false,
        batchDelOpAfterShow: false,
        selectAllShow: false,

        addNewOpText: this.$t('add_new'),
        tableColumns: [
          { title: this.$t('organize_title'), key: 'title', width: 110 },
          {
            title: this.$t('parent_organize_title'),
            key: 'parentTitle',
            width: 90
          },
          { title: this.$t('owner_name'), key: 'ownerName', width: 110 },
          {
            title: this.$t('priorities'),
            width: 269,
            render: (h, param) => {
              return h(
                'div',
                (param.row.ownPermissions || []).join('; ') + '.'
              );
            }
          },
          {
            title: this.$t('global_operate'),
            className: 'operation',
            width: 220,
            align: 'center',
            render: (h, param) => {
              return h('div', [
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        this.del(param.row.id);
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
                        let row = param.row;
                        let fundRow = this.getTreeRowFromId(row.id);

                        this.add({
                          ...row,
                          organizeCode: this.getOrganizeCodeFromTreeRow(
                            fundRow,
                            { op: 'add' }
                          )
                        });
                      }
                    }
                  },
                  this.$t('global_add')
                ),
                h(
                  'Button',
                  {
                    on: {
                      click: () => {
                        let row = param.row;
                        let fundRow = this.getTreeRowFromId(row.id);
                        this.edit({
                          ...row,
                          organizeCode: this.getOrganizeCodeFromTreeRow(
                            fundRow,
                            { op: 'edit' }
                          )
                        });
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
      }
    };
  },
  methods: {
    loopFind(arr, id, ret) {
      for (let i = 0, l = arr.length; i < l; i++) {
        let p = arr[i];
        if (+p.id === +id) {
          ret.push(p);
          break;
        } else {
          if (p.children && p.children.length) {
            this.loopFind(p.children, id, ret);
          }
        }
      }
    },
    getTreeRowFromId(id) {
      const ret = [];
      this.loopFind(this.treeData, id, ret);
      return ret[0];
    },
    getOrganizeCodeFromTreeRow({ id, parentId }, { op }) {
      let ret;
      if (op === 'edit') {
        ret = `${parentId ? parentId : ''}`;
      } else if (op === 'add') {
        ret = `${parentId ? parentId + ':' : ''}${id}`;
      }
      return ret;
    },
    successTipAndReload() {
      this.$Message.success(this.$t('global_operate_success'));
      setTimeout(() => {
        this.reloadTree();
      }, 500);
    },
    // eslint-disable-next-line no-unused-vars
    renderTree(h, { root, node, data }) {
      const isRoot = node.nodeKey === 0;
      return h(
        'span',
        {
          class: ['item']
        },
        [
          h(
            'span',
            {
              class: [
                'content',
                isRoot ? 'root' : '',
                node.node.selected ? 'selected' : ''
              ],
              on: {
                click: () => {
                  if (!node.node.selected) {
                    this.$refs.tree.handleSelect(node.nodeKey); //手动选择树节点
                    this.handleSelect(data);
                  }
                }
              }
            },
            `${data.title}  (${data.peopleCount}${this.$t('person')})  `
          ),
          isRoot
            ? null
            : h('span', { class: 'operations' }, [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.del(data.id);
                      }
                    }
                  },
                  this.$t('del')
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.add({
                          ...data,
                          organizeCode: this.getOrganizeCodeFromTreeRow(data, {
                            op: 'add'
                          })
                        });
                      }
                    }
                  },
                  this.$t('add')
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.edit({
                          ...data,
                          organizeCode: this.getOrganizeCodeFromTreeRow(data, {
                            op: 'edit'
                          })
                        });
                      }
                    }
                  },
                  this.$t('edit')
                )
              ])
        ]
      );
    },
    afterCommonOp() {
      // 重新加载Tree
      this.reloadTree();
      // Table数据置空
      this.tableInfo.tableData = [];
    },
    add({ organizeCode }) {
      this.$router.push(
        `${this.$G.route.oporganize}?organizeCode=${encodeURIComponent(
          organizeCode
        )}`
      );
    },
    edit({ id, organizeCode }) {
      this.$router.push(
        `${
          this.$G.route.oporganize
        }?edit=1&id=${id}&organizeCode=${encodeURIComponent(organizeCode)}`
      );
    },
    async delOrganize(id) {
      this.triggerLoading(true);
      let res = await deleteOrganizeApi({ id });
      this.triggerLoading(false);
      if (res) {
        this.successTipAndReload();
      }
    },
    del(id) {
      this.$Modal.confirm({
        content: this.$t('global_confirm_delete'),
        onOk: () => {
          this.delOrganize(id);
          this.afterCommonOp();
        }
      });
    },
    handleSelect({ id, parentId, nodeKey }) {
      let selectedTreeCode = `${parentId ? parentId + ':' : ''}${id}`;
      this.selectedTreeCode = selectedTreeCode;
      sessionInfo.setSelectedTreeData({ selectedTreeCode, nodeKey });
      this.getTableData(id);
    },
    formatTreeData(treeData) {
      treeData.forEach(p => {
        p.expand = true;
        p.children &&
          p.children.length &&
          p.children.forEach(pp => {
            pp.expand = true;
          });
      });
      return treeData;
    },
    async getTreeData() {
      this.triggerLoading(true);
      let { data } = await organizeTreeDataApi();
      this.triggerLoading(false);
      this.treeData = this.formatTreeData(data);
      this.restoreTreeState();
    },
    async getTableData(id) {
      this.triggerLoading(true);
      let { page, perPage = 10 } = this.tableInfo;
      let { data } = await organizeTableDataApi({
        page,
        perPage,
        parentId: id
      });
      this.tableInfo.tableData = data;
      this.triggerLoading(false);
    },
    addNew() {
      let organizeCode = this.selectedTreeCode;
      this.$router.push(
        `${this.$G.route.oporganize}?organizeCode=${encodeURIComponent(
          organizeCode
        )}`
      );
    },
    reloadTable() {
      this.getTableData();
    },
    restoreTreeState() {
      let { selectedTreeCode, nodeKey } = sessionInfo.getSelectedTreeData();
      // 数据结构示例
      // {
      //   selectedTreeCode: '' 或 '1' 或 '1:2' 或 '1:2:3' ...
      //   nodeKey: 0
      // }

      let selectedTreeCodeArr = (selectedTreeCode || '').split(':');
      let selectedTreeCodeArrBak = simpleClone(selectedTreeCodeArr);
      let len = selectedTreeCodeArr.length;
      let id = selectedTreeCodeArr[len - 1];
      let parentId;
      if (len > 1) {
        selectedTreeCodeArr.pop();
        parentId = selectedTreeCodeArr.join(':');
      } else {
        parentId = '';
      }

      // 设置selectedTreeCode
      this.selectedTreeCode = `${parentId ? parentId + ':' : ''}${id}`;

      // 处理expand
      let loopArr = this.treeData;
      let loopId;
      let l;
      let loopFund = true;
      while ((l = loopArr.length && loopFund)) {
        loopId =
          selectedTreeCodeArrBak.length > 1 && selectedTreeCodeArrBak.shift();
        loopFund = false;
        for (let i = 0; i < l; i++) {
          let loopItem = loopArr[i];
          if (+loopItem.id === +loopId) {
            loopItem.expand = true;
            loopFund = true;
            loopArr = loopItem.children || [];
            break;
          }
        }
      }

      // 处理select
      this.handleSelect({ id, parentId, nodeKey });
    },
    reloadTree() {
      this.getTreeData();
    },
    setPage(obj) {
      this.tableInfo.page = obj.page;
      this.tableInfo.perPage = obj.length;
      this.reloadTable();
    }
  },
  mounted() {
    this.getTreeData();
  }
};
</script>
<style lang="less">
.organize-manage-container {
  margin: 0 auto;
  display: flex;
  .tree-part {
    font-size: 16px;
    display: inline-block;
    margin-right: 20px;
    width: 300px;
    min-width: 300px;
    .item {
      margin-left: 2px;
      padding: 8px 0;
      user-select: none;
      .content {
        &.root {
          font-weight: bold;
        }
        &.selected {
          background-color: #d5e8fc;
        }
      }

      .operations {
        margin-left: 10px;
        display: none;
      }
      &:hover .operations {
        display: inline-block;
      }
    }

    .people-count {
      margin-left: 5px;
    }
    .ivu-tree-arrow {
      .ivu-icon-ios-arrow-forward:before {
        content: '\F100';
        color: green;
      }
      &.ivu-tree-arrow-open {
        i {
          transform: rotate(0deg);
        }
        .ivu-icon-ios-arrow-forward:before {
          content: '\F290';
        }
      }
    }
  }
  .table-part {
    display: inline-block;
    width: 800px;
    margin-top: 20px;
  }
}
</style>
<i18n>
{
  "en": {
    "add_new": "+新增部门",
    "organize_title": "部门",
    "parent_organize_title": "上级部门",
    "owner_name": "负责人",
    "priorities": "权限",
    "del": "删除",
    "edit": "编辑",
    "add": "新增",
    "person": "人"
  },
  "zh-CN": {
    "add_new": "+新增部门",
    "organize_title": "部门",
    "parent_organize_title": "上级部门",
    "owner_name": "负责人",
    "priorities": "权限",
    "del": "删除",
    "edit": "编辑",
    "add": "新增",
    "person": "人"
  }
}
</i18n>
