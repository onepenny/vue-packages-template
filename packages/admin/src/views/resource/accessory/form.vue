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
        <div v-for="(item, index) in dataRenderFields" :key="index">
          <div
            v-if="
              !item.cid ||
                (item.cid && item.cid == formInline.trims_category[0])
            "
          >
            <p class="form-subtitle">{{ item.name }}</p>
            <span v-for="(fields, idx) in item.items" :key="idx">
              <!-- 目前都是两级以上结构，不考虑 field.key 存在情况，若以后需要改变结构，此处添加 base-form-item -->
              <span v-if="fields && fields.items">
                <base-form-item
                  :fields="fields"
                  :formInline="formInline"
                  :dataCreateInfo="dataCreateInfo"
                  :isSelectSupplier="isSelectSupplier"
                  :toChangeAddType="toChangeAddType"
                />
              </span>
            </span>
          </div>
        </div>
      </div>

      <p class="form-subtitle">{{ $t('global_private_state') }}</p>
      <com-search-bar
        style="border-bottom: 1px solid #d4d3d8; height: 0px; margin-bottom: 20px;"
      />

      <FormItem
        :label="$t('global_private_state') + '：'"
        prop="state"
        :required="true"
      >
        <RadioGroup v-model="formInline.state">
          <Radio
            v-for="item in priviteState"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</Radio
          >
        </RadioGroup>
      </FormItem>

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
        :formType="formType"
        :minNumber="minNumber"
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
  getFormAccessoryCreate,
  getFormAccessoryEdit,
  postFormAccessory
} from '@/service/resource/accessory';
import baseFormItem from '@/components/resource/baseFormItem';
// import attachFormItem from '@/components/resource/attachFormItem';
import materialFormItem from '@/components/resource/materialFormItem';

export default {
  components: {
    baseFormItem,
    // attachFormItem,
    materialFormItem
  },
  data() {
    return {
      formType: 'accessory', // 表单类型，用于区分资源中心表单类型
      getFormCreate: getFormAccessoryCreate,
      getFormEdit: getFormAccessoryEdit,
      postForm: postFormAccessory,
      formInline: {
        state: 1, // 显示权限
        xhrThumb: { src: '', id: -1, progress: 0 } // 缩略图
      },
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
          str: 'accessory_thumb_max_str',
          size: 'accessory_thumb_max_size',
          required: true
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'bigThumb',
          name: this.$t('global_big_thumb_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'xhr',
          name: this.$t('global_xhr_img'),
          str: 'accessory_max_str',
          size: 'accessory_max_size',
          required: false,
          or: true
        },
        {
          dataType: 'colorPicker',
          hide: false,
          key: 'base_color',
          name: this.$t('global_base_color'),
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'xhrBack',
          name: this.$t('global_xhr_back_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'normal',
          name: this.$t('global_normal_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'alpha', // 透明贴图 金属度贴图 粗糙度贴图
          name: this.$t('global_transparent_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'metalness',
          name: this.$t('global_metallicity_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'roughness',
          name: this.$t('global_roughness_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'imgUploader',
          hide: false,
          key: 'ao',
          name: this.$t('global_ao_img'),
          str: 'accessory_normal_max_str',
          size: 'accessory_normal_max_size',
          required: false
        },
        {
          dataType: 'fileUploader',
          hide: false,
          key: 'tpl',
          name: this.$t('global_info_files'),
          str: 'accessory_tpl_max_str',
          size: 'accessory_tpl_max_size',
          download: `/downloadTpl/accessory/tpl/${this.id}`,
          required: false
        },
        {
          dataType: 'fileUploaderPrice', // 特殊类型，多了 formInline.model3d_price 参数
          hide: false,
          key: 'model3d',
          name: this.$t('global_accessory3d'),
          str: 'accessory_tpl_max_str',
          size: 'accessory_tpl_max_size',
          download: `/downloadTpl/accessory/model/${this.id}`,
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
    "accessory_add_success": "新增辅料成功！",
	  "accessory_edit_success": "编辑辅料成功！"
  },
  "en": {
    "const_public": "Public",
    "const_private": "Private",
    "accessory_add_success": "Accessory successfully added!",
	  "accessory_edit_success": "Accessory successfully updated!"
  }
}
</i18n>
