<template>
  <div class="overview-container">
    <div class="overview-sta">
      <div class="overview-title">{{ $t('supplier_info') }}</div>
      <Form ref="supplierForm" :model="supplierInfo" :label-width="200">
        <FormItem :label="$t('system_supplier_name') + '：'" prop="name">
          <Input
            style="width: 248px"
            v-model="supplierInfo.name"
            :placeholder="$t('global_placeholder')"
          />
        </FormItem>
        <FormItem :label="$t('system_use_date') + '：'">
          <div class="base-info">
            <span>{{
              supplierInfo.expireDate
                ? supplierInfo.expireDate
                : this.$t('system_use_no_limit')
            }}</span>
          </div>
        </FormItem>
        <FormItem :label="$t('system_area') + '：'" prop="area">
          <Input
            style="width: 248px"
            v-model="supplierInfo.area"
            :placeholder="$t('global_placeholder')"
          />
        </FormItem>
        <FormItem :label="$t('business_user') + '：'" prop="contactorName">
          <Input
            style="width: 248px"
            v-model="supplierInfo.contactorName"
            :placeholder="$t('global_placeholder')"
          />
        </FormItem>
        <FormItem :label="$t('global_phone') + '：'" prop="phone">
          <Input
            style="width: 248px"
            v-model="supplierInfo.phone"
            :placeholder="$t('global_placeholder')"
          />
        </FormItem>
        <FormItem :label="$t('system_index_logo') + '：'" prop="logo">
          <com-upload
            cur-width="150px"
            cur-height="150px"
            :img-url="supplierInfo.logo['src']"
            :progress="supplierInfo.logo['progress']"
            v-on:delete="toDeleteImage"
            v-on:file="
              toUploadImage(
                $event,
                supplierInfo.logoSize['logo_max_size'],
                supplierInfo.logoSize['logo_max_str']
              )
            "
          >
            <h2>{{ $t('global_upload_img') }}</h2>
            <p>
              {{
                $t('global_upload_img_tip', {
                  str: supplierInfo.logoSize['logo_max_str']
                })
              }}
            </p>
          </com-upload>
        </FormItem>
        <FormItem :label="$t('system_index_about_set') + '：'" prop="aboutUs">
          <com-text-edit
            :value="supplierInfo['aboutUs']"
            height="160"
            @input="content => (this.supplierInfo.aboutUs = content)"
          >
          </com-text-edit>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :disabled="disabledSave"
            :loading="loadingSave"
            @click="submit"
            >{{ $t('global_save') }}</Button
          >
        </FormItem>
      </Form>
    </div>
    <Spin fix size="large" v-if="showLoading"></Spin>
  </div>
</template>
<script>
import { checkSize, checkFileFormat, imgUploader } from '@/config/upload';
import {
  getSupplierInfo as getSupplierInfoApi,
  saveSupplierInfo as saveSupplierInfoApi
} from '@/service/settings/supplierinfo';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';
import Store from 'store';

export default {
  name: 'SupplierInfo',
  mixins: [pageLoadingMixin],
  data() {
    return {
      supplierInfo: {
        id: '',
        name: '',
        expireDate: '',
        area: '',
        phone: '',
        contactorId: '',
        contactorName: '',
        logo: {
          src: '',
          id: -1,
          progress: 0
        },
        logoSize: {
          logo_max_size: 157286,
          logo_max_str: '150KB'
        },
        aboutUs: ''
      },
      disabledSave: false,
      loadingSave: false
    };
  },
  methods: {
    toDeleteImage() {
      this.supplierInfo.logo = {
        src: '',
        id: -1,
        progress: 0
      };
    },
    toUploadImage: function(file, maxSize, maxStr) {
      if (
        !checkSize(file, maxSize, () => {
          alert(this.$t('global_file_max', { str: maxStr }));
        })
      ) {
        return;
      }
      if (
        !checkFileFormat(file, /(jpg|jpeg|png)$/i, () => {
          alert(this.$t('global_file_type'));
        })
      ) {
        return;
      }

      let config = {
        directory: 'directory/logo',
        mediaUpdate: true
      };
      imgUploader(
        file,
        config,
        percent => {
          this.supplierInfo.logo.progress = percent;
        },
        {
          func: imgAttr => {
            const { height } = imgAttr;
            return height >= 50;
          },
          message: this.$t('system_index_logo_size')
        },
        (host, fullname, mediaId) => {
          this.supplierInfo.logo = {
            src: host + '/' + fullname,
            id: mediaId,
            progress: 0
          };
        }
      );
    },
    async getSupplierInfo() {
      this.triggerLoading(true);
      let { data } = await getSupplierInfoApi({ id: this.supplierInfo.id });
      this.triggerLoading(false);
      let {
        name,
        logoId,
        logoPath,
        area,
        aboutUs,
        contactorName,
        mobile,
        expireTime
      } = data;
      Object.assign(this.supplierInfo, {
        name,
        expireDate: expireTime,
        area,
        phone: mobile,
        contactorName,
        logo: {
          src: logoPath,
          id: logoId,
          progress: 0
        },
        aboutUs
      });

      // todo sr 涉及到影响信息时做
      // bus.$emit("logoInfo", resource.supplierInfo['logoPath']);
    },
    successTipAndReload() {
      this.$Message.success(this.$t('global_operate_success'));
      this.getSupplierInfo();
    },
    async submit() {
      let {
        id,
        name,
        area,
        phone: mobile,
        contactorName,
        logo: { id: logoId },
        aboutUs
      } = this.supplierInfo;
      let param = {
        id,
        name,
        area,
        mobile,
        contactorName,
        logoId,
        aboutUs
      };
      this.loadingSave = true;
      let res = await saveSupplierInfoApi(param);
      this.loadingSave = false;
      if (res) {
        this.successTipAndReload();
      }
    }
  },
  mounted() {
    let userInfo = Store.get(this.$G.store.userInfo);
    this.supplierInfo.id = userInfo.id;
    this.getSupplierInfo();
  }
};
</script>
<style lang="less">
.overview-container {
  position: relative;
  .overview-con {
    width: 10.6rem;
    margin: 0 auto;
    text-align: center;
    padding-top: 140px;
    .images {
      width: 10.6rem;
      height: 7.5rem;
    }
    .overview-users {
      color: rgba(0, 0, 0, 0.65);
      font-size: 18px;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 0.5rem;
    }
    .numbers {
      color: rgba(0, 0, 0, 0.65);
      font-size: 18px;
    }
  }

  .overview-sta {
    padding: 0 20px;

    .overview-title {
      font-size: 16px;
      color: #262626;
      padding-top: 20px;
      padding-bottom: 10px;
      height: 80px;
      line-height: 60px;
      border-bottom: 1px solid #dcdee2;
      margin-bottom: 20px;
    }
    .base-info {
      font-size: 14px;
      color: #262626;
      color: rgba(0, 0, 0, 1);
      font-weight: 300;
      label {
        width: 120px;
        display: inline-block;
      }
    }
  }
}
.renew-info {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  padding-bottom: 10px;
  .renew-count {
    color: #f26d60;
  }
}
.renew-pay-con {
  height: 215px;
  .renew-left {
    width: 300px;
    float: left;
    height: 215px;
  }
  .renew-right {
    width: calc(~'100% - 300px');
    float: left;
    height: 215px;
    .pay-way {
      .alipay {
        width: 170px;
        height: 222px;
        float: left;
        text-align: center;
      }
      .wxpay {
        width: 170px;
        height: 222px;
        float: right;
        text-align: center;
      }
      .mark {
        width: 170px;
        height: 170px;
      }
      .logo {
        maxwidth: 130px;
        height: 25px;
        margin-top: 9px;
      }
    }
  }
}
</style>
<i18n>
{
  "en": {
    "supplier_info": "供应商信息",
    "system_supplier_name": "供应商名称",
    "system_supplier_area": "供应商区域",
    "system_use_no_limit": "无限制",
    "system_use_date": "免费期限",
    "system_area": "区域",
    "business_user": "业务联系人",
    "system_index_logo": "首页LOGO配置",
    "system_index_about_set": "关于设置",
    "system_index_logo_size": "上传首页图片的尺寸不对，建议图片高度最小50px"
  },
  "zh-CN": {
    "supplier_info": "供应商信息",
    "system_supplier_name": "供应商名称",
    "system_supplier_area": "供应商区域",
    "system_use_no_limit": "无限制",
    "system_use_date": "免费期限",
    "system_area": "区域",
    "business_user": "业务联系人",
    "system_index_logo": "首页LOGO配置",
    "system_index_about_set": "关于设置",
    "system_index_logo_size": "上传首页图片的尺寸不对，建议图片高度最小50px"
  }
}
</i18n>
