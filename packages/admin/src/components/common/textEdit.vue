<template>
  <div class="tinymce">
    <Editor :value="value" :init="init"> </Editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/plugins/image';
import 'tinymce/plugins/media';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/paste';
import { fileUploader } from '@/config/upload';
export default {
  name: 'TextEdit',
  props: ['value', 'height'],
  watch: {
    value: function(val) {
      if (tinymce.activeEditor.getContent() !== val) {
        tinymce.activeEditor.setContent(val);
      }
    }
  },
  data() {
    return {
      content: 'a',
      init: {
        images_upload_handler: function(blobInfo, success) {
          let file = blobInfo.blob();

          let config = {
            directory: 'directory/tinymce',
            mediaUpdate: false
          };

          fileUploader(
            file,
            config,
            () => {},
            (host, fullname) => {
              success(host + '/' + fullname);
            }
          );
        },
        language_url: '/tinymce/zh_CN.js',
        language: this.$i18n.locale
          ? this.$i18n.locale === 'zh-CN'
            ? 'zh_CN'
            : 'en'
          : 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        height: this.height ? this.height : 180,
        plugins:
          'link lists image media code table colorpicker textcolor wordcount contextmenu paste',
        toolbar:
          'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | ' +
          'outdent indent blockquote | paste undo redo | link unlink image media code | removeformat',
        branding: false,
        media_live_embeds: true,

        // CONFIG: Paste
        paste_retain_style_properties: 'all',
        paste_word_valid_elements: '*[*]', // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: 'all',
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,

        setup: editor => {
          this.editor = editor;
          editor.on('keyup', () => {
            const content = editor.getContent();
            this.$emit('input', content);
          });
          editor.on('change', () => {
            const content = editor.getContent();
            this.$emit('input', content);
          });
        }
      }
    };
  },
  mounted() {
    tinymce.init({});
  },
  components: {
    Editor: Editor
  }
};
</script>
<style lang="less">
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
