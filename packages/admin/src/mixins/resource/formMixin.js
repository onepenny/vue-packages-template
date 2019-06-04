import {
  handleCascaderData,
  ucfirst,
  parseStringToArray,
  parseArrayToString,
  translate
} from '@/config/utils';

// 基础表单公共逻辑 Mixin
export const formMixin = {
  props: ['id', 'changeType'],
  data() {
    return {
      ucfirst,
      minNumber: 0,
      rulesInline: {},
      dataCreateInfo: [], // 表单请求结果
      dataRenderFields: [], // 表单渲染字段
      isSelectSupplier: true,
      loadingSubmit: false,
      is_backup: null,
      priviteState: translate(this.$G.const.ISPRIVITE, key => this.$t(key)), // 权限字段以后后端维护
      is_owner: null,
      showModalLoading: true
    };
  },
  created() {
    if (this.id) {
      this.editForm(this.id);
    } else {
      this.createForm();
    }
  },
  methods: {
    // 新建
    async createForm() {
      // material 初始值，目前后端没有配置，根据前端配置生成
      this.loopArray(this.materialRenderFields, this.filedInitial);

      let res = await this.getFormCreate();

      this.initialFormInline(res);
    },
    // 编辑
    async editForm() {
      this.loopArray(this.materialRenderFields, this.filedInitial);

      let res = await this.getFormEdit(this.id);

      this.initialFormInline(res);
      // 表单配置
      const resource = res[this.formType];
      this.$nextTick(() => {
        this.is_owner = res['is_owner'];
        this.is_backup = res['is_backup'];
        this.editable = res['editable'];
        this.loopArray(this.materialRenderFields, this.fieldEdit, resource);
        // 根据表单配置生成渲染表单
        this.loopArray(this.dataRenderFields, this.fieldEdit, resource);
        this.formInline.state = resource['state'];
        this.formInline.linked_style_ids = res[this.formType]['product_ids'];
        this.formInline.linkedStyles = res[this.formType]['products'];
        this.formInline.render_config = res[this.formType]['render_config'];
      });
      // .catch(() => {
      // this.showModalLoading = false;
      // this.toCancle();
      // });
    },
    // 表单项编辑时回填
    fieldEdit(field, resource) {
      if (field.dataType == 'supplier') {
        if (resource['is_import'] || resource['source_id']) {
          this.isSelectSupplier = false;
          this.formInline.supplierName = resource['supplierString'];
          this.formInline.address = '';
          this.formInline.contractor = '';
          this.formInline.tel = '';
          field['disabled'] = true;
          return;
        }
      } else if (field.dataType == 'list') {
        if (resource[`${field.key}String`]) {
          this.formInline['isSelect' + ucfirst(field.key)] = false;
          this.formInline[`${field.key}String`] =
            resource[`${field.key}String`];
        }
      }
      // 目前对 cascader 类型即为辅料分类，以后其他 cascader，则添加新分类
      if (field.dataType == 'cascader') {
        this.formInline[`${field.key}`] = [
          resource.trims_category_parent,
          resource.trims_category_child
        ];
        return;
      }
      // 目前对 cascaderMulti 类型即为位置分类，以后其他 cascaderMulti，则添加新分类
      if (field.dataType == 'cascaderMulti') {
        this.formInline[`${field.key}`] = resource.categories;
        return;
      }
      if (field.dataType == 'commonCascader') {
        this.formInline[`${field.key}`] = [
          resource[`${field.firstKey}`],
          resource[`${field.secondKey}`]
        ];
        return;
      }
      if (field.dataType == 'imgUploader') {
        this.formInline[field.key] = {
          id: resource[field.key],
          src: resource[`${field.key}Path`],
          progress: 0
        };
        return;
      }

      if (field.dataType == 'fileUploader') {
        this.formInline[field.key] = {
          id: resource[field.key],
          src: resource[`${field.key}Path`]?.path,
          progress: 0
        };
        return;
      }

      if (field.dataType == 'fileUploaderPrice') {
        this.formInline[field.key] = {
          id: resource['model3d'],
          src: resource.modelPath['path'],
          progress: 0
        };
        this.formInline[field.priceKey || 'model3d_price'] = parseFloat(
          resource[field.priceKey || 'model3d_price']
        );
        return;
      }

      if (/integer|colorPicker/.test(field.dataType)) {
        this.formInline[field.key] = resource[field.key];
        return;
      }
      if (resource[`${field.key}`]) {
        if (field.dataType == 'percent_main_component') {
          if (
            !resource[`${field.key}`] ||
            resource[`${field.key}`].length == 0
          ) {
            return;
          }

          // this.formInline[`${field.key}`] = JSON.parse(
          //   resource[`${field.key}`]
          // );
          // return;
        }

        if (field.dataType == 'checkbox') {
          let stringArray = parseStringToArray(resource[`${field.key}`]);
          let actualArray = [];
          stringArray.forEach(val => {
            let cid = null;
            for (let item of field['initial']) {
              if (item.cid == val || item.displayName == val) {
                cid = item.cid;
                break;
              }
            }
            if (cid) {
              actualArray.push(cid);
            } else {
              field['initial'].splice(0, 0, { cid: val, displayName: val });
              actualArray.push(val);
            }
          });

          this.formInline[`${field.key}`] = actualArray;
        } else {
          this.formInline[`${field.key}`] = resource[`${field.key}`];
        }

        if (field.dataType === 'pantone') {
          if (this.$refs['PTColorNo']) {
            this.$refs['PTColorNo'][0].setInitColor(resource[`${field.key}`]);
          }
        }
      }
    },
    initialFormInline(res) {
      // TODO：需要产品接口，等产品迁移后实现
      // this.formInline.linked_style_ids = '';

      // 后端完全动态后删除
      if (this.baseRenderFields) {
        this.baseRenderFields.forEach(i => {
          if (i.data) i.initial = res.data[i.data];
        });
        res.data.fields = this.baseRenderFields;
      }

      let temp = res.data['fields'];

      this.loopArray(temp, this.filedInitial);

      this.dataRenderFields = temp;
      this.dataCreateInfo = res.data;
      // TODO
      this.dataStyleTypes = handleCascaderData(
        res.data.styleType,
        this.$t('global_whole')
      );
      this.showModalLoading = false;
    },
    // 遍历处理处理数组
    loopArray(data, func, funcParam) {
      data.map(i => {
        if (i.key) func(i, funcParam);
        if (i.items) this.loopArray(i.items, func, funcParam);
        return i;
      });
    },
    // 表单项设置默认值
    filedInitial(data) {
      switch (data['dataType']) {
        case 'list':
          this.$set(this.formInline, data.key, null);
          this.$set(this.formInline, data.key + 'String', null);
          this.$set(this.formInline, 'isSelect' + ucfirst(data.key), true);
          break;
        case 'integer':
        case 'supplier':
          this.$set(this.formInline, data.key, null);
          break;
        case 'cascader':
          this.$set(this.formInline, data.key, []);
          data.initial = handleCascaderData(data.initial);
          break;
        case 'cascaderMulti':
          this.$set(this.formInline, data.key, []);
          data.initial = handleCascaderData(data.initial);
          break;
        case 'commonCascader':
          this.$set(this.formInline, `${data.key}`, []);
          data.initial = handleCascaderData(data.initial);
          break;
        case 'checkbox':
          this.$set(this.formInline, data.key, []);
          break;
        case 'percent_main_component':
          this.$set(this.formInline, data.key, [
            { percent: 0, component: null }
          ]);
          break;
        case 'colorPicker':
          this.$set(this.formInline, data.key, ''); // ColorPicker 必须有初始值
          break;
        case 'fileUploaderPrice':
          this.$set(this.formInline, data.key, {
            id: -1,
            src: '',
            progress: 0
          });
          this.$set(this.formInline, data.priceKey || 'model3d_price', 0);
          break;
        case 'fileUploader':
          this.$set(this.formInline, data.key, {
            id: -1,
            src: '',
            progress: 0
          });
          break;
        case 'imgUploader':
          this.$set(this.formInline, data.key, {
            id: -1,
            src: '',
            progress: 0
          });
          break;
        default:
          this.$set(this.formInline, data.key, '');
          break;
      }
    },
    async toSubmit(type) {
      const { aeStatus, formInline, dataRenderFields, formType } = this;

      let data_post = {
        state: formInline.state,
        xhrThumb:
          formInline.xhrThumb['id'] === -1 ? 0 : formInline.xhrThumb['id'],
        product_ids: formInline.linked_style_ids,
        render_config: formInline.render_config
      };
      this.loopArray(this.materialRenderFields, this.filedSubmit, data_post);

      this.loopArray(dataRenderFields, this.filedSubmit, data_post);

      // 审核
      if (type == 'audit') data_post.flow_exec = true;

      this.loadingSubmit = true;
      switch (aeStatus) {
        case true:
          try {
            await this.postForm(data_post);
            this.handleSuccess(this.$t(`${formType}_add_success`));
          } catch (error) {
            this.loadingSubmit = false;
          }
          break;
        default:
          try {
            await this.postForm(data_post, this.id);
            this.handleSuccess(this.$t(`${formType}_edit_success`));
          } catch (error) {
            this.loadingSubmit = false;
          }
      }
    },
    // 提交表单转换格式
    filedSubmit(field, midObj) {
      if (field.dataType === 'checkbox') {
        midObj[field.key] = parseArrayToString(this.formInline[field.key]);
      } else if (field.dataType === 'list') {
        if (this.formInline['isSelect' + ucfirst(field.key)]) {
          midObj[field.key] = this.formInline[field.key];
          midObj[field.key + 'String'] = null;
        } else {
          midObj[field.key] = null;
          midObj[field.key + 'String'] = this.formInline[field.key + 'String'];
        }
      } else if (field.dataType === 'datetime') {
        midObj[field.key] = this.formInline[field.key]
          ? this.formInline[field.key].toLocaleDateString('zh-CN')
          : '';
      } else if (field.dataType === 'supplier') {
        if (this.isSelectSupplier) {
          midObj[field.key] = this.formInline[field.key];
        } else {
          midObj.supplierString = this.formInline.supplierName;
          midObj.supplierAddrString = this.formInline.address;
          midObj.supplierContractorString = this.formInline.contractor;
          midObj.supplierTelString = this.formInline.tel;
        }
      } else if (field.dataType === 'cascader') {
        midObj.trims_category_parent = this.formInline.trims_category[0];
        midObj.trims_category_child = this.formInline.trims_category[1];
      } else if (field.dataType === 'cascaderMulti') {
        let parent = this.formInline[`${field.key}`][0];
        let categories = [];
        // TODO：一级是否显示待确定
        if (this.formInline[`${field.key}`].length == 1)
          categories = [[parent]];
        for (let i = 1; i < this.formInline[`${field.key}`].length; i++) {
          categories.push([parent, this.formInline[`${field.key}`][i]]);
        }
        // 此处位置分类依旧采用 categories 字段，对应新的 type 字段
        midObj.categories = JSON.stringify(categories);
      } else if (field.dataType == 'commonCascader') {
        midObj[field.firstKey] = this.formInline[`${field.key}`][0];
        midObj[field.secondKey] = this.formInline[`${field.key}`][1] || 0; // 不存在二级，默认 0
      } else if (/imgUploader|fileUploader/.test(field.dataType)) {
        midObj[field.key] =
          this.formInline[field.key]['id'] === -1
            ? null
            : this.formInline[field.key]['id'];
      } else if (field.dataType === 'fileUploaderPrice') {
        midObj.model3d =
          this.formInline.model3d['id'] === -1
            ? null
            : this.formInline.model3d['id'];
        midObj[field.priceKey || 'model3d_price'] = this.formInline[
          field.priceKey || 'model3d_price'
        ];
      } else {
        midObj[field.key] = this.formInline[field.key];
      }
    },
    // 提交成功
    handleSuccess(msg) {
      this.loadingSubmit = false;
      this.$Message.success(msg);
      this.changeType('list');
    },
    // 供应商新增按钮
    toChangeAddType() {
      this.isSelectSupplier = !this.isSelectSupplier;
      if (!this.isSelectSupplier) {
        let lastSelect = this.formInline.supplier;
        this.formInline.supplierName = '';
        this.formInline.address = '';
        this.formInline.contractor = '';
        this.formInline.tel = '';
        for (let supplier of this.dataCreateInfo.suppliers) {
          if (supplier.id == lastSelect) {
            this.formInline.supplierName = supplier.name;
            this.formInline.address = supplier.address;
            this.formInline.contractor = supplier.contractor;
            this.formInline.tel = supplier.tel;
            break;
          }
        }
      }
    }
  }
};
