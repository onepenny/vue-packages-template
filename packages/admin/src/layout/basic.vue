<template>
  <div class="layout">
    <Layout style="height: 100vh; min-width: 1200px;" v-if="firstMenu">
      <basic-header :menus="firstMenu" @change-menu="changeMenu" />
      <Layout>
        <Sider
          hide-trigger
          :style="{ background: '#fff', height: '100%', overflow: 'scroll' }"
        >
          <basic-menu :menus="secondMenu" />
        </Sider>
        <Layout :style="{ padding: '24px', height: '100%' }">
          <!-- <Breadcrumb :style="{ margin: '0 0 24px' }">
            <BreadcrumbItem>一级</BreadcrumbItem>
            <BreadcrumbItem>二级</BreadcrumbItem>
            <BreadcrumbItem>三级</BreadcrumbItem>
          </Breadcrumb> -->
          <Content
            :style="{
              padding: '24px',
              background: '#fff',
              overflow: 'auto',
              minHeight: '100%'
            }"
          >
            <router-view />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import BasicHeader from '@/components/layout/basicHeader';
import basicMenu from '@/components/layout/basicMenu';
import { getRouteList } from '@/service/layout';

export default {
  components: {
    BasicHeader,
    basicMenu
  },
  data() {
    return {
      firstMenu: '', // 顶部 menu
      secondMenu: [] // 侧边 menu
    };
  },
  created() {
    this.getRouteList();
  },
  methods: {
    async getRouteList() {
      let res = await getRouteList();
      // 目前默认首页为工作台，以后根据权限决定权限
      this.firstMenu = res.data;
      this.secondMenu =
        res.data.filter(i => i.key == this.$route['path'].split('/')[1])[0]
          .children || [];
    },
    changeMenu(data) {
      this.secondMenu = data.children || [];
    }
  }
};
</script>

<style scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
</style>
