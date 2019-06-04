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
  getFormDecaltechCreate,
  getFormDecaltechEdit,
  postFormDecaltech
} from '@/service/resource/decaltech';
import baseFormItem from '@/components/resource/baseFormItem';
// import attachFormItem from '@/comsponents/resource/attachFormItem';
import materialFormItem from '@/components/resource/materialFormItem';

export default {
  components: {
    baseFormItem,
    // attachFormItem,
    materialFormItem
  },
  data() {
    return {
      formType: 'decalTechnic', // 表单类型，用于区分资源中心表单类型
      getFormCreate: getFormDecaltechCreate,
      getFormEdit: getFormDecaltechEdit,
      postForm: postFormDecaltech,
      formInline: {
        state: 1 // 显示权限
      },
      baseRenderFields: [
        {
          dataType: 'text',
          hide: false,
          key: 'name',
          name: this.$t('global_table_name'),
          required: true,
          newline: true
        }
      ],
      materialRenderFields: [
        // 素材信息，以后后端动态维护
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'thumb',
          name: this.$t('decal_tec_table_thumb'),
          str: 'modelling_thumb_max_str',
          size: 'modelling_thumb_max_size',
          required: true
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'xhr',
          name: this.$t('decal_tec_file'),
          str: 'decal_technic_xhr_max_str',
          size: 'decal_technic_xhr_max_size',
          download: `/downloadXhr/decalTec/${this.id}`,
          required: true
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
    "decalTechnic_add_success": "新增绣花工艺成功！",
    "decalTechnic_edit_success": "编辑绣花工艺成功！",
    "decal_tec_table_thumb": "工艺效果图",
    "decal_tec_file": "3D工艺文件"
  },
  "en": {
    "decalTechnic_add_success": "Pattern Proces successfully added!",
    "decalTechnic_edit_success": "Pattern Proces successfully updated!",
    "decal_tec_table_thumb": "Process",
	  "decal_tec_file": "3D Process File"
  }
}
</i18n>
