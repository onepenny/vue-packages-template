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
  getFormModellingCreate,
  getFormModellingEdit,
  postFormModelling
} from '@/service/resource/modelling';
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
      formType: 'modelling', // 表单类型，用于区分资源中心表单类型
      getFormCreate: getFormModellingCreate,
      getFormEdit: getFormModellingEdit,
      postForm: postFormModelling,
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
          required: true,
          newline: true
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
          dataType: 'radio',
          hide: false,
          key: 'gender',
          name: this.$t('global_sex'),
          required: true,
          data: 'gender', // 该字段为动态前临时字段
          newline: true
        },
        {
          dataType: 'list',
          hide: false,
          key: 'age_layer',
          name: this.$t('global_table_age'),
          required: true,
          data: 'age_layer' // 该字段为动态前临时字段
        },
        {
          dataType: 'list',
          hide: false,
          key: 'race',
          name: this.$t('global_table_race'),
          required: true,
          data: 'race', // 该字段为动态前临时字段
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
          dataType: 'imgUploader',
          hide: false,
          key: 'thumb',
          name: this.$t('global_thumb_img'),
          str: 'modelling_thumb_max_str',
          size: 'modelling_thumb_max_size',
          required: true
        },
        {
          dataType: 'radio',
          hide: false,
          key: 'face_type',
          name: this.$t('model_face_type'),
          required: true,
          initial: translate(this.$G.const.FACETYPE, key => this.$t(key)),
          newline: true
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'xhr',
          name: this.$t('global_model_file'),
          str: 'modelling_max_str',
          size: 'modelling_max_size',
          tip: 'global_upload_model_file_tip',
          download: `/downloadXhr/model/${this.id}/0`,
          dependKey: 'face_type',
          dependValue: this.$G.const.FACETYPE[0].cid,
          required: false
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'tpl',
          name: this.$t('global_info_files'),
          str: 'modelling_tpl_max_str',
          size: 'modelling_tpl_max_size',
          tip: 'global_upload_file_tip',
          download: `/downloadTpl/model/tpl/${this.id}`,
          dependKey: 'face_type',
          dependValue: this.$G.const.FACETYPE[0].cid,
          required: false
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'face',
          name: this.$t('model_face_file'),
          str: 'modelling_max_str',
          size: 'modelling_max_size',
          tip: 'global_upload_model_file_tip',
          download: `/downloadXhr/model/${this.id}/1`,
          dependKey: 'face_type',
          dependValue: this.$G.const.FACETYPE[1].cid,
          required: false
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'body',
          name: this.$t('model_body_file'),
          str: 'modelling_max_str',
          size: 'modelling_max_size',
          tip: 'global_upload_model_file_tip',
          download: `/downloadXhr/model/${this.id}/2`,
          dependKey: 'face_type',
          dependValue: this.$G.const.FACETYPE[1].cid,
          required: false
        },
        {
          dataType: 'fileUploaderPrice',
          hide: false,
          key: 'model3d',
          name: this.$t('global_model3d'),
          str: 'modelling_tpl_max_str',
          size: 'modelling_tpl_max_size',
          priceKey: 'model3d_price',
          tip: 'global_upload_others_tip',
          download: `/downloadTpl/model/model/${this.id}`,
          required: false
        },
        {
          dataType: 'fileUploaderPrice',
          hide: false,
          key: 'cad',
          name: this.$t('global_cad3D'),
          str: 'modelling_tpl_max_str',
          size: 'modelling_tpl_max_size',
          priceKey: 'cad_price',
          tip: 'global_upload_others_tip',
          download: `/downloadTpl/model/cad/${this.id}`,
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
    "modelling_add_success": "新增人台成功！",
    "modelling_edit_success": "编辑人台成功！",
    "model_face_type": "人脸类型",
    "model_face_file": "人脸模型文件",
    "model_body_file": "身体模型文件",
    "const_fix": "固定人脸",
    "const_move": "可变人脸"
  },
  "en": {
    "const_public": "Public",
    "const_private": "Private",
    "modelling_add_success": "Model successfully added!",
    "modelling_edit_success": "Model successfully updated!",
    "model_face_type": "Face Type",
    "model_face_file": "Face Model File",
    "model_body_file": "Body Model File",
    "const_fix": "Fixed Face",
    "const_move": "Variable Face"
  }
}
</i18n>
