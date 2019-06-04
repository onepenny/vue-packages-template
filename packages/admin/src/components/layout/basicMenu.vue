<template>
  <div class="basicMenu-container">
    <Menu
      theme="light"
      :active-name="activeKey"
      @on-select="selectMenu"
      width="auto"
    >
      <div v-for="menu in menus" :key="menu.key">
        <Submenu v-if="menu.children && menu.children.length" :name="menu.key">
          <template slot="title">
            <Icon type="ios-analytics"></Icon>{{ menu.name }}
          </template>
          <MenuItem v-for="i in menu.children" :key="i.key" :name="i.key">{{
            i.name
          }}</MenuItem>
        </Submenu>
        <MenuItem v-else :name="menu.key">{{ menu.name }}</MenuItem>
      </div>
    </Menu>
  </div>
</template>

<script>
export default {
  name: 'basicMenu',
  props: ['menus'],
  computed: {
    activeKey() {
      return this.$route['path'].split('/')[2];
    }
  },
  methods: {
    selectMenu(key) {
      this.menus.some(i => {
        if (i.key == key) {
          this.$router.push(i.redirect);
          return true;
        }
        if (i.children) {
          return i.children.some(i => {
            if (i.key == key) {
              this.$router.push(i.redirect);
              return true;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.basicMenu-container {
  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #262626;
    font-weight: 500;
    background: #efefef;
    z-index: 2;
    border-right: none;
  }
  .ivu-menu-vertical .ivu-menu-item,
  .ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 14px 24px;
    border-bottom: 1px solid #f3f3f3;
    color: #595959;
  }
  .ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    color: #262626;
    font-weight: 500;
    border-left: 2px solid #262626;
    z-index: 2;
    border-right: none;
  }
  .ivu-menu-item-group-title {
    color: #262626;
    background: #f1f1f1;
  }
}
</style>
