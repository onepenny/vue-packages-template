<template>
  <div class="search-bar-container">
    <slot> </slot>
  </div>
</template>

<script>
export default {
  name: 'SearchBar'
};
</script>

<style lang="less">
.search-bar-container {
  height: 60px;
  width: 100%;
  background: #ffffff;
  min-width: 900px;
  border-bottom: 2px solid #d4d3d8;
  display: flex;
  align-items: center;
  span {
    float: right;
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  button {
    margin-right: 20px;
    height: 32px;
    background-color: #595959;
    color: #ffffff;
    padding: 0 8px;
    font-size: 12px;
    border-radius: 2px;
  }
  .ivu-select-single .ivu-select-selection {
    height: 32px;
    position: relative;
    padding-left: 30px;
  }
  label {
    font-size: 18px;
    color: #262626;
    margin-right: 10px;
  }
  //.ivu-select-selection {
  //  border: none;
  //}
  //.ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  //  color: #262626;
  //}
  //.ivu-select-visible .ivu-select-selection {
  //  outline: none;
  //  box-shadow: none;
  //}
}
</style>
