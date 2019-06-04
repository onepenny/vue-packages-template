// 基础列表
export const listMixin = {
  data() {
    return {
      dataRes: [] // 全部数据
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 若一个参数 value 字符串，若多个参数 value 为数组
    searchList(value, firstParam, secondParam) {
      this.currentPage = this.$G.resourceList.DEFAULTPAGE;
      if (secondParam) {
        this.searchParams[firstParam] = value[0] || '';
        this.searchParams[secondParam] = value[1] || '';
      } else {
        this.searchParams[firstParam] = value || '';
      }
      this.getList();
    },
    deleteList(selectedArr, delConfirm) {
      if (!selectedArr?.length)
        return this.$Message.warning(this.$t('global_operate_worn'));
      const action = 'destroy';

      this.$Modal.confirm({
        title: this.$t('global_batch_del'),
        content: delConfirm,
        onOk: async () => {
          let res = await this.postDeleteList({
            _action: action,
            mid: selectedArr.map(i => i.id)
          });
          this.$Message.success(res.message);
          this.getList();
        }
      });
    },
    setPage(value) {
      this.searchParams.page = value.page;
      this.searchParams.perPage = value.length;
      this.getList();
    },
    // 改变查看、编辑类型
    changeType(type, id) {
      this.type = type;
      this.formId = id;
      if (type == 'list') this.getList();
    }
  }
};
