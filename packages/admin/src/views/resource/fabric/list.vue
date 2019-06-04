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
        :label="`${$t('fabric_data_price')}：`"
        :data="dataPrice"
        :text="'label'"
        @select="searchList($event, 'priceRange')"
      />
      <!-- 成分中还有 hidden 字段，目前该隐藏不实现，TODO：以后讨论 -->
      <com-select
        :label="`${$t('fabric_data_constituent')}：`"
        :data="dataComponent"
        :value="`cid`"
        :text="'displayName'"
        @select="searchList($event, 'component')"
      />
      <com-select
        :label="`${$t('fabric_data_knit')}：`"
        :data="dataKnit"
        :value="`cid`"
        :text="'displayName'"
        @select="searchList($event, 'knit')"
      />
      <!-- <com-select
        :label="`${$t('fabric_data_usage')}：`"
        :data="dataUsage"
        :value="`cid`"
        :text="'displayName'"
        @select="searchList($event, 'usage')"
      /> -->
      <!-- 供应商还有 hidden 字段，目前该隐藏不实现，TODO：以后讨论 -->
      <com-select
        :label="`${$t('fabric_data_supplier')}：`"
        :data="dataSuppliers"
        :value="`id`"
        :text="'name'"
        @select="searchSuppliesList($event)"
      />
    </div>
    <com-table
      :tableInfo="tableInfo"
      @set-page="setPage"
      @batch-del="deleteList($event, $t('fabric_batch_del_confirm'))"
      @add-new="changeType('form')"
    />
  </div>

  <fabric-form v-else :changeType="changeType" :id="formId" />
</template>

<script>
import { getFabricList, postDeleteFabricList } from '@/service/resource/fabric';
import { listMixin } from '@/mixins/resource/listMixin';
import fabricForm from '@/views/resource/fabric/form';

export default {
  components: {
    fabricForm
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
            title: this.$t('fabric_data_name'),
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
            title: this.$t('fabric_data_number'),
            key: 'number'
          },
          {
            title: this.$t('fabric_data_internal_code'),
            key: 'internal_code'
          },
          {
            title: this.$t('fabric_data_component'),
            key: 'component'
          },
          {
            title: this.$t('fabric_data_constituent'),
            key: 'constituent'
          },
          {
            title: this.$t('fabric_data_weight'),
            key: 'weight',
            render: (h, params) => <span>{params.row.weight}GSM</span>
          },
          {
            title: this.$t('fabric_data_color'),
            key: 'color'
          },
          {
            title: this.$t('fabric_data_knit'),
            key: 'knit'
          },
          {
            title: this.$t('fabric_data_price'),
            key: 'price',
            render: (h, params) => (
              <span>
                {this.dataRes['price_unit'] || '￥'}
                {params.row.price}
              </span>
            )
          },
          {
            title: this.$t('fabric_data_stock'),
            key: 'stock'
          },
          {
            title: this.$t('fabric_data_remarks'),
            key: 'remarks'
          },
          {
            title: this.$t('global_uploader'),
            width: 100,
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
                  <p class="list-operate" vOn:click={() => this.share(row)}>
                    {this.$t('global_share')}
                  </p>
                  <p
                    class="list-operate"
                    style={{
                      color: '#f26d60',
                      display: row['is_owner'] ? '' : 'none'
                    }}
                    vOn:click={() =>
                      this.deleteList([row], this.$t('fabric_del_confirm'))
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
                      color: '#57a3f3',
                      display: row['tplPath'] == '' ? 'none' : ''
                    }}
                    vOn:click={() => this.download(row)}
                  >
                    {this.$t('global_download')}
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
      dataComponent: [], // 成分
      dataKnit: [], // 织造分类
      dataUsage: [], // 用途
      dataSuppliers: [], // 供应商
      dataRes: [], // 全部数据
      searchParams: {
        page: this.$G.resourceList.DEFAULTPAGE,
        perPage: this.$G.resourceList.PERPAGE,
        editMode: 1, //详情模式
        searchInfo: 1,
        priceRange: '',
        component: '',
        knit: '',
        usage: '',
        supplier: '',
        fabricProvider: '',
        uploader: '',
        keywords: ''
      },
      postDeleteList: postDeleteFabricList,
      type: 'list', // 表单类型，目前有 list、form 两种类型
      formId: '' // 表单 id
    };
  },
  // created() {
  //   this.getList();
  // },
  mixins: [listMixin],
  methods: {
    async getList() {
      this.tableInfo.isLoading = true;
      let res = await getFabricList({ ...this.searchParams });
      this.tableInfo.isLoading = false;

      this.dataRes = res;

      // 列表数据
      this.tableInfo.tableData = res.fabrics.data;
      this.tableInfo.page = res.fabrics.current;
      this.tableInfo.total = res.fabrics.total;

      // 搜索数据源
      this.dataUploader = res.searchInfo['uploader'];
      this.dataPrice = res.searchInfo['prices'];
      this.dataComponent = res.searchInfo['fabricComponent'];
      this.dataKnit = res.searchInfo['knit'];
      this.dataUsage = res.searchInfo['fabricUsage'];
      if (res.searchInfo['suppliers']) {
        for (let supplier of res.searchInfo['suppliers']) {
          supplier['id'] = 's_' + supplier['id'];
          this.dataSuppliers.push(supplier);
        }
      }
      if (res.searchInfo['fabricProviders']) {
        for (let supplier of res.searchInfo['fabricProviders']) {
          supplier['id'] = 'f_' + supplier['id'];
          this.dataSuppliers.push(supplier);
        }
      }

      // this.tableInfo.tableData = res.data.fabrics.data.map(fabric => {
      //   fabric._disabled = !this.dataCopyInfo.copyable && (!fabric.is_owner || !this.dataRes.editable);
      //   return fabric;
      // });
    },
    share() {},
    preview() {},
    download() {},
    handelAuditStatus() {},
    // 供应商特殊处理
    searchSuppliesList(supplies) {
      this.currentPage = this.$G.resourceList.DEFAULTPAGE;
      let values = supplies && supplies.split('_');
      if (values && values.length == 2) {
        if (values[0] == 's') {
          this.searchParams.supplier = values[1] || '';
        } else if (values[0] == 'f') {
          this.searchParams.fabricProvider = values[1] || '';
        }
      }
      this.getList();
    }
  }
};
</script>

<style lang="less"></style>

<i18n>
{
  "zh-CN": {
    "fabric_data_name": "名称",
    "fabric_data_supplier": "供应商",
    "fabric_data_knit": "织造分类",
    "fabric_data_structure": "组织结构",
    "fabric_data_number": "供应商编号",
    "fabric_data_internal_code": "内部编号",
    "fabric_data_color": "供应商色号",
    "fabric_data_range": "门幅",
    "fabric_data_weight": "克重",
    "fabric_data_price": "参考价格",
    "fabric_data_constituent": "成分",
    "fabric_data_usage": "用途",
    "fabric_data_component": "主要纤维",
    "fabric_data_retail_price": "零售价",
    "fabric_data_thickness": "厚度",
    "fabric_data_hyaline": "透明度",
    "fabric_data_texture": "纹理",
    "fabric_data_layers": "层数",
    "fabric_data_density": "密度/纱支",
    "fabric_data_stock": "库存",
    "fabric_data_care_instruction": "洗涤建议",
    "fabric_data_pattern": "外观类型",
    "fabric_data_color_no": "潘通色号",
    "fabric_data_softness": "柔软度",
    "fabric_data_stretch_direction": "弹向",
    "fabric_data_elasticity": "弹力",
    "fabric_data_drapability": "垂感",
    "fabric_data_skin_friendly_index": "亲肤指数",
    "fabric_data_functions": "功能",
    "fabric_data_test_item": "测试项目",
    "fabric_data_item_no": "货号",
    "fabric_data_suitable_year": "适用年份",
    "fabric_data_suitable_season": "适用季节",
    "fabric_data_launch_time": "上架时间",
    "fabric_data_technics": "工艺",
    "fabric_data_place_of_origin": "产地",
    "fabric_data_dry_fastness": "干摩擦色牢度",
    "fabric_data_wet_fastness": "湿摩擦色牢度",
    "fabric_data_risk_warning": "面料风险提示",
    "fabric_data_description": "详情",
    "fabric_data_remarks": "备注",
    "fabric_del_confirm": "确认要删除当前面料吗？",
	  "fabric_batch_del_confirm": "确认要删除这些面料吗？"
  },
  "en": {
    "fabric_data_name": "Product Name",
    "fabric_data_supplier": "Supplier",
    "fabric_data_knit": "Weave Type",
    "fabric_data_structure": "Fabric Structure",
    "fabric_data_number": "Supplier Product Code",
    "fabric_data_internal_code": "Internal Code",
    "fabric_data_color": "Supplier Color Code",
    "fabric_data_range": "Range",
    "fabric_data_weight": "Weight",
    "fabric_data_price": "Refer. Price",
    "fabric_data_constituent": "Composition",
    "fabric_data_usage": "Usage",
    "fabric_data_component": "Main Fiber",
    "fabric_data_retail_price": "Retail Price",
    "fabric_data_thickness": "Thickness",
    "fabric_data_hyaline": "Transparency",
    "fabric_data_texture": "Texture",
    "fabric_data_layers": "Layer",
    "fabric_data_density": "Density",
    "fabric_data_stock": "Stock",
    "fabric_data_care_instruction": "Care Instruction",
    "fabric_data_pattern": "Appearance Type",
    "fabric_data_color_no": "Pantone Color Code",
    "fabric_data_softness": "Softness",
    "fabric_data_stretch_direction": "Stretch Direction",
    "fabric_data_elasticity": "Elasticity",
    "fabric_data_drapability": "Drapability",
    "fabric_data_skin_friendly_index": "Skin-friendly Index",
    "fabric_data_functions": "Function",
    "fabric_data_test_item": "Test Item",
    "fabric_data_item_no": "Item No.",
    "fabric_data_suitable_year": "Suitable Year",
    "fabric_data_suitable_season": "Suitable Season",
    "fabric_data_launch_time": "Launch Time",
    "fabric_data_technics": "Technics",
    "fabric_data_place_of_origin": "Place of Origin",
    "fabric_data_dry_fastness": "Dry Fastness",
    "fabric_data_wet_fastness": "Wet Fastness",
    "fabric_data_risk_warning": "Risk Warning",
    "fabric_data_description": "Description",
    "fabric_data_remarks": "Remarks",
    "fabric_del_confirm": "Confirm to delete the current fabric?",
	  "fabric_batch_del_confirm": "Confirm to delete the selected fabrics?"
  }
}
</i18n>
