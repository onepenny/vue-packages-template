<template>
  <div>
    <div class="uploadFile-container" v-show="fileUrl">
      <p class="file-name">
        <Icon type="document"> </Icon> &nbsp;{{ filename }}&nbsp;
        <span @click="deleteFile">
          <Icon type="ios-close" size="16" class="icon-style"> </Icon>
        </span>
      </p>
    </div>
    <div class="uploadFile-container" v-show="!fileUrl">
      <slot> </slot>
      <a class="file">
        <Icon type="ios-cloud-upload-outline"> </Icon> {{ $t('global_upload') }}
        <input type="file" @change="processFile($event)" />
      </a>

      <Progress
        :percent="!progress ? 0 : progress"
        status="active"
        v-show="progress"
      ></Progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: ['progress', 'fileUrl'],
  data() {
    return {
      uploaded: false
    };
  },
  computed: {
    filename: function() {
      if (!this.fileUrl) {
        return '';
      }
      let midArr = this.fileUrl.split('/');
      return midArr[midArr.length - 1];
    }
  },
  methods: {
    processFile: function(event) {
      this.$emit('file', event.target.files[0]);
      event.target.value = '';
    },
    deleteFile: function() {
      this.$Modal.confirm({
        title: this.$t('global_del_title'),
        content: this.$t('global_del_confirm'),
        onOk: () => {
          this.$emit('delete');
        }
      });
    }
  }
};
</script>

<style lang="less">
.uploadFile-container {
  position: relative;
  .file {
    position: relative;
    display: inline-block;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .file:hover {
    border-color: #57a3f3;
    color: #57a3f3;
    text-decoration: none;
  }
  .file-name {
    font-size: 12px;
    color: #6c6c6c;
    border-radius: 4px;
    background: #f5f5f5;
    padding: 0 10px;
    width: 100%;
    .icon-style {
      float: right;
      cursor: pointer;
      padding-top: 6px;
    }
  }
}
</style>
