<template>
  <div>
    <div v-for="field in materialRenderFields" :key="field.key">
      <FormItem
        v-if="
          !field.dependKey || formInline[field.dependKey] == field.dependValue
        "
        :label="field.name + '：'"
        :prop="field.key"
        :rules="{
          required: field.required,
          message: $t('global_field_tip', { field: field.name })
        }"
        :style="{ width: field.dataType == 'integer' ? 'auto' : '100%' }"
      >
        <div v-if="field.dataType == 'imgUploader'">
          <com-upload
            cur-width="220px"
            cur-height="150px"
            :img-url="formInline[field.key].src"
            :progress="formInline[field.key].progress"
            v-on:delete="toDeleteImage(field.key)"
            v-on:file="
              toUploadImage(
                $event,
                dataCreateInfo[field.size],
                dataCreateInfo[field.str],
                field.key
              )
            "
          >
            <h2>{{ $t('global_upload_img') }}</h2>
            <p>
              {{
                $t('global_upload_img_tip', {
                  str: dataCreateInfo[field.str]
                })
              }}
            </p>
          </com-upload>
        </div>

        <InputNumber
          v-else-if="field.dataType == 'integer'"
          v-model="formInline[field.key]"
        />

        <ColorPicker
          v-else-if="field.dataType == 'colorPicker'"
          v-model="formInline[field.key]"
        ></ColorPicker>

        <Radio-group
          v-else-if="field.dataType == 'radio'"
          v-model="formInline[field.key]"
        >
          <Radio
            v-for="item in field.initial"
            :label="item.cid"
            :key="item.cid"
            >{{ item.displayName }}</Radio
          >
        </Radio-group>

        <div v-else-if="field.dataType == 'fileUploader'">
          <p class="form-tips">
            {{
              $t(field.tip || 'global_upload_file_tip', {
                str: dataCreateInfo[field.str]
              })
            }}
            <a
              style="float: right;color: #262626;"
              v-show="aeStatus && is_owner && formInline[field.key].src"
              :href="`/api/PdmService/common${field.download}`"
            >
              <Icon type="md-cloud-download" size="20"></Icon>
            </a>
          </p>
          <com-upload-file
            :file-url="formInline[field.key].src"
            :progress="formInline[field.key].progress"
            v-on:delete="toDeleteFile(field.key)"
            v-on:file="
              toUploadFile(
                $event,
                dataCreateInfo.accessory_tpl_max_size,
                dataCreateInfo.accessory_tpl_max_str,
                field.key
              )
            "
          ></com-upload-file>
        </div>

        <div v-else-if="field.dataType == 'fileUploaderPrice'">
          <p class="form-tips">
            {{
              $t(field.tip || 'global_upload_others_tip', {
                str: dataCreateInfo[field.str],
                type: 'zip/jpg/jpeg/png'
              })
            }}
            <!-- TODO：待协商-->
            <a
              style="float: right;color: #262626;"
              v-show="aeStatus && is_owner && formInline[field.key].src"
              :href="`/api/PdmService/common${field.download}`"
            >
              <Icon type="md-cloud-download" size="20"></Icon>
            </a>
          </p>
          <p class="form-price">
            {{ $t('global_price') }}：
            <InputNumber
              v-model="formInline[field.priceKey || 'model3d_price']"
              style="width: 120px"
              :min="minNumber"
            />
          </p>
          <com-upload-file
            :file-url="formInline[field.key].src"
            :progress="formInline[field.key].progress"
            v-on:delete="toDeleteFile(field.key)"
            v-on:file="
              toUploadFile(
                $event,
                dataCreateInfo[field.size],
                dataCreateInfo[field.str],
                field.key
              )
            "
          ></com-upload-file>
        </div>

        {{ field.or ? $t('global_or') : '' }}
      </FormItem>
    </div>
  </div>
</template>

<script>
import ImageCompressor from 'image-compressor.js';
import { checkSize, checkFileFormat, fileUploader } from '@/config/upload';
import { getFileExtension, getFileName } from '@/config/utils';
import JSZip from 'jszip';

// 目前存在表单子选项类型：图片上传、两种文件上传（其中一个多了价格，目前当作特殊类型）、ColorPicker、integer
export default {
  props: [
    'formInline',
    'dataCreateInfo',
    'aeStatus',
    'is_owner',
    'id',
    'minNumber',
    'formType',
    'materialRenderFields'
  ],
  methods: {
    toUploadImage(file, maxSize, maxStr, type) {
      if (
        !checkSize(file, maxSize, () => {
          alert(this.$t('global_file_max', { str: maxStr }));
        })
      )
        return;
      if (
        !checkFileFormat(file, /(jpg|jpeg|png)$/i, () => {
          alert(this.$t('global_file_type'));
        })
      )
        return;

      let config = {
        directory: 'directory/' + new Date().format('yyyyMMdd'),
        mediaUpdate: true
      };
      // 目前面辅料特殊处理缩略图
      if (type === 'xhr' && /accessory|fabric/.test(this.formType)) {
        new ImageCompressor(file, {
          maxWidth: 100,
          maxHeight: 100,
          success: result => {
            fileUploader(result, config, null, (host, fullname, mediaId) => {
              this.formInline['xhrThumb'] = {
                src: host + '/' + fullname,
                id: mediaId,
                progress: 0
              };

              fileUploader(
                file,
                config,
                percent => {
                  this.formInline[type].progress = percent;
                },
                (host, fullname, mediaId) => {
                  this.formInline[type] = {
                    src: host + '/' + fullname,
                    id: mediaId,
                    progress: 0
                  };
                }
              );
            });
          },
          error: e => {
            console.log(e.message);
          }
        });
      } else {
        fileUploader(
          file,
          config,
          percent => {
            this.formInline[type].progress = percent;
          },
          (host, fullname, mediaId) => {
            this.formInline[type] = {
              src: host + '/' + fullname,
              id: mediaId,
              progress: 0
            };
          }
        );
      }
    },
    toDeleteImage(type) {
      this.formInline[type] = {
        src: '',
        id: -1,
        progress: 0
      };
    },
    toUploadFile(file, maxSize, maxStr, type) {
      if (
        !checkSize(file, maxSize, () => {
          alert(this.$t('global_file_max', { str: maxStr }));
        })
      )
        return;

      if (type === 'model3d') {
        if (
          !checkFileFormat(file, /(zip|sfab|jpg|jpeg|png)$/i, () => {
            alert(this.$t('global_file_others', { type: 'zip|sfab|img' }));
          })
        )
          return;
      }

      let rootName =
        getFileName(file.name) + '_' + new Date().format('yyyyMMddhhmmss');

      let config = {
        directory: 'directory/files',
        template: rootName + '.' + getFileExtension(file.name),
        mediaUpdate: true
      };
      fileUploader(
        file,
        config,
        percent => {
          this.formInline[type].progress = percent;
        },
        (host, fullname, mediaId) => {
          this.formInline[type] = {
            src: fullname,
            id: mediaId,
            progress: 0
          };
        }
      );

      if (type === 'model3d' && getFileExtension(file.name) == 'sfab') {
        this.handelFile(file, rootName);
      }
    },
    toDeleteFile(type) {
      this.formInline[type] = {
        src: '',
        id: -1,
        progress: 0
      };
    },
    handelFile: function(file, rootName) {
      let newZip = new JSZip();
      newZip.loadAsync(file).then(zip => {
        for (let name in zip.files) {
          if (getFileExtension(name) === 'json') {
            zip.files[name].async('blob').then(fileContent => {
              let reader = new FileReader();
              reader.onload = e => {
                let midJson = JSON.parse(e.target.result);
                this.formInline.width = midJson['width'];
                this.formInline.height = midJson['height'];
                if (midJson['baseColor']) {
                  this.formInline.base_color = midJson['baseColor'];
                }
                this.formInline.render_config = JSON.stringify(
                  midJson['render_config']
                );
                let mapAlpha = midJson['mapAlpha'];
                let mapDiffuse = midJson['mapDiffuse'];
                let mapDiffuseBack = midJson['mapDiffuseBack'];
                let mapMetalness = midJson['mapMetalness'];
                let mapNormal = midJson['mapNormal'];
                let mapRoughness = midJson['mapRoughness'];
                let mapAO = midJson['mapAO'];
                let mapThumb = midJson['mapThumb'];
                let mapBigThumb = midJson['mapBigThumb'];

                for (let innerName in zip.files) {
                  let config = {
                    directory:
                      'directory/' +
                      new Date().format('yyyyMMdd') +
                      '/' +
                      rootName,
                    template: innerName,
                    mediaUpdate: true
                  };
                  if (innerName === mapAlpha) {
                    this.doFileUpload(
                      zip.files[mapAlpha],
                      mapAlpha,
                      config,
                      'transparent'
                    );
                  } else if (innerName === mapDiffuse) {
                    this.doFileUpload(
                      zip.files[mapDiffuse],
                      mapDiffuse,
                      config,
                      'src'
                    );
                  } else if (innerName === mapDiffuseBack) {
                    this.doFileUpload(
                      zip.files[mapDiffuseBack],
                      mapDiffuseBack,
                      config,
                      'srcBack'
                    );
                  } else if (innerName === mapMetalness) {
                    this.doFileUpload(
                      zip.files[mapMetalness],
                      mapMetalness,
                      config,
                      'metallicity'
                    );
                  } else if (innerName === mapNormal) {
                    this.doFileUpload(
                      zip.files[mapNormal],
                      mapNormal,
                      config,
                      'normal'
                    );
                  } else if (innerName === mapRoughness) {
                    this.doFileUpload(
                      zip.files[mapRoughness],
                      mapRoughness,
                      config,
                      'roughness'
                    );
                  } else if (innerName === mapAO) {
                    this.doFileUpload(zip.files[mapAO], mapAO, config, 'ao');
                  } else if (innerName === mapThumb) {
                    this.doFileUpload(
                      zip.files[mapThumb],
                      mapThumb,
                      config,
                      'thumb'
                    );
                  } else if (innerName === mapBigThumb) {
                    this.doFileUpload(
                      zip.files[mapBigThumb],
                      mapBigThumb,
                      config,
                      'bigThumb'
                    );
                  }
                }
              };
              reader.readAsText(fileContent);
            });

            break;
          }
        }
      });
    }
  }
};
</script>
