<template>
  <div>
    <div
      class="upload-container"
      :style="{ width: curWidth, height: curHeight }"
      v-show="imgUrl"
    >
      <div @click="deleteImage" v-show="!disabled">
        <Icon type="md-close-circle" class="close-icon" size="18"></Icon>
      </div>
      <img :src="imgUrl" />
    </div>
    <div
      class="upload-container"
      :style="{ width: curWidth, height: curHeight }"
      v-show="!imgUrl"
    >
      <div class="upload-input-container" v-show="!disabled">
        <Icon
          type="ios-cloud-upload"
          size="52"
          style="color: #647b80;margin-top: 20px"
        >
        </Icon>
        <slot> </slot>
        <input
          :style="{ width: curWidth }"
          type="file"
          id="index-upload"
          @change="processFile($event)"
        />
      </div>

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
  name: 'Upload',
  props: ['curWidth', 'curHeight', 'imgUrl', 'progress', 'disabled'],
  data() {
    return {};
  },
  methods: {
    processFile: function(event) {
      this.$emit('file', event.target.files[0]);
      event.target.value = '';
    },
    deleteImage: function() {
      event.stopPropagation();
      this.$Modal.confirm({
        title: this.$t('global_del_title'),
        content: this.$t('global_del_confirm'),
        onOk: () => {
          this.showModal = false;
          this.$emit('delete');
        }
      });
    }
  }
};
</script>

<style lang="less">
.upload-input-container {
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  width: 100%;
  text-align: center;
}

.upload-container {
  position: relative;
  text-align: center;
  line-height: 1.6;
  border: 1px dashed #dddee1;

  &:hover {
    .close-icon {
      display: block;
    }
  }

  .close-icon {
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
    color: #646464;
    cursor: pointer;
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
  }

  h2 {
    color: #898989;
    font-size: 14px;
  }

  p {
    color: #d0d0d0;
    font-size: 12px;
  }
}
.upload-tips {
  font-size: 12px;
  color: #bfbfbf;
}
</style>
