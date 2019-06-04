<template>
  <div class="resource-form-container">
    <com-search-bar>
      <p class="form-title">
        {{ $t('global_base_info') }}
        <span>
          <button @click="changeType('list')">
            <Icon type="ios-arrow-back"></Icon>
            {{ $t('global_back') }}
          </button>
        </span>
      </p>
    </com-search-bar>
    <br />
    <Form
      ref="formInline"
      :model="formInline"
      :rules="rulesInline"
      :label-width="160"
      inline
    >
      <!-- 表单基本信息 -->
      <div v-if="dataRenderFields.length">
        <!-- <div v-for="(fields, index) in dataRenderFields" :key="index"> -->
        <base-form-item
          :fields="dataRenderFields"
          :formInline="formInline"
          :dataCreateInfo="dataCreateInfo"
          :isSelectSupplier="isSelectSupplier"
          :toChangeAddType="toChangeAddType"
        />
        <!-- </div> -->
      </div>

      <!-- TODO：需要产品接口，等产品迁移后实现 -->
      <!-- <com-search-bar>
        <p class="form-title">{{ $t('global_attach_info') }}</p>
      </com-search-bar>
      <br /> -->
      <!-- <p class="attach-name">{{ $t('global_attach_style') }}</p>
      <attachFormItem
        :formInline="formInline"
        :aeStatus="!!id"
        :is_backup="is_backup"
        :is_owner="is_owner"
        :id="id"
      /> -->

      <com-search-bar>
        <p class="form-title">{{ $t('global_information') }}</p>
      </com-search-bar>
      <br />
      <materialFormItem
        v-if="!showModalLoading"
        :formInline="formInline"
        :dataCreateInfo="dataCreateInfo"
        :aeStatus="!!id"
        :is_owner="is_owner"
        :minNumber="minNumber"
        :formType="formType"
        :materialRenderFields="materialRenderFields"
      />

      <FormItem>
        <Button @click="changeType('list')">{{ $t('global_cancel') }}</Button
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          :loading="loadingSubmit"
          type="primary"
          @click="toSubmit('audit')"
          >{{ $t('global_submit_audit') }}</Button
        >&nbsp;&nbsp;&nbsp;&nbsp;
        <!-- :disabled="ableSubmit || (!aeStatus && !editable)" -->
        <Button :loading="loadingSubmit" type="primary" @click="toSubmit">{{
          $t('global_save_draft')
        }}</Button>
      </FormItem>

      <Spin size="large" fix v-if="showModalLoading"></Spin>
    </Form>
  </div>
</template>

<script>
import { formMixin } from '@/mixins/resource/formMixin';
import {
  getFormDecalCreate,
  getFormDecalEdit,
  postFormDecal
} from '@/service/resource/decal';
import baseFormItem from '@/components/resource/baseFormItem';
// import attachFormItem from '@/comsponents/resource/attachFormItem';
import materialFormItem from '@/components/resource/materialFormItem';
import { translate } from '@/config/utils';
export default {
  components: {
    baseFormItem,
    // attachFormItem,
    materialFormItem
  },
  data() {
    return {
      formType: 'decal', // 表单类型，用于区分资源中心表单类型
      getFormCreate: getFormDecalCreate,
      getFormEdit: getFormDecalEdit,
      postForm: postFormDecal,
      formInline: {
        state: 1, // 显示权限
        xhrThumb: { src: '', id: -1, progress: 0 }
      },
      baseRenderFields: [
        {
          dataType: 'text',
          hide: false,
          key: 'name',
          name: this.$t('global_table_name'),
          required: true
        },
        {
          dataType: 'text',
          hide: false,
          key: 'price',
          name: this.$t('global_table_price'),
          required: true
        },
        {
          dataType: 'commonCascader',
          hide: false,
          key: 'typeCascader',
          firstKey: 'category',
          secondKey: 'type',
          name: this.$t('global_table_type'),
          required: true,
          data: 'types' // 该字段为动态前临时字段
        },
        {
          dataType: 'radio',
          hide: false,
          key: 'state',
          name: this.$t('global_private_state'),
          required: true,
          initial: translate(this.$G.const.ISPRIVITE, key => this.$t(key)),
          newline: true
        },
        {
          dataType: 'textarea',
          hide: false,
          key: 'description',
          name: this.$t('global_detail'),
          required: false
        }
      ],
      materialRenderFields: [
        // 素材信息，以后后端动态维护
        {
          dataType: 'integer',
          hide: false,
          key: 'width',
          name: this.$t('global_width'),
          required: true
        },
        {
          dataType: 'integer',
          hide: false,
          key: 'height',
          name: this.$t('global_height'),
          required: true
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'thumb',
          name: this.$t('global_thumb_img'),
          str: 'decal_thumb_max_str',
          size: 'decal_thumb_max_size',
          required: true
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'xhr',
          name: this.$t('global_xhr_img'),
          str: 'decal_max_str',
          size: 'decal_max_size',
          required: true
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'tpl',
          name: this.$t('global_info_files'),
          str: 'decal_tpl_max_str',
          size: 'decal_tpl_max_size',
          download: `/downloadTpl/decal/tpl/${this.id}`,
          required: false
        },
        {
          dataType: 'fileUploaderPrice', // 特殊类型，多了 formInline.model3d_price 参数
          hide: false,
          key: 'model3d',
          name: this.$t('global_model3d'),
          str: 'decal_tpl_max_str',
          size: 'decal_tpl_max_size',
          download: `/downloadTpl/decal/model/${this.id}`,
          required: false
        }
      ]
    };
  },
  mixins: [formMixin]
};
</script>

<i18n>
{
  "zh-CN": {
    "const_public": "公开",
    "const_private": "私有",
    "decal_add_success": "新增绣花成功！",
    "decal_edit_success": "编辑绣花成功！"
  },
  "en": {
    "const_public": "Public",
    "const_private": "Private",
	  "decal_add_success": "Pattern successfully added!",
    "decal_edit_success": "Pattern successfully updated!"
  }
}
</i18n>
