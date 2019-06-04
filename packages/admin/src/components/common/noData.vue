<template>
  <div class="no_data-container">
    <img v-if="dataType === 'msg'" class="nodata" :src="imgNomsg" />
    <img v-else class="nodata" :src="imgNodata" />
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script>
import imgNodata from '@/assets/nodata.png';
import imgNomsg from '@/assets/nomsg.png';

export default {
  name: 'NoData',
  components: {},
  data() {
    return {
      imgNodata: imgNodata,
      imgNomsg: imgNomsg
    };
  },
  props: ['desc', 'dataType']
};
</script>

<style lang="less">
.no_data-container {
  text-align: center;
  color: #262626;
  font-size: 14px;
  padding-top: 40px;
  .desc {
    margin-top: 20px;
    margin-bottom: 0.5rem;
  }
  .nodata {
    width: 10rem;
  }
}
</style>
