<template>
  <Header>
    <Menu
      ref="leftMenu"
      mode="horizontal"
      theme="dark"
      class="layout-menu-top"
      :active-name="activeKey"
      @on-select="selectMenu"
    >
      <div class="layout-assistant">
        <img class="logo-style" :src="imgLogo" />
        <Menu-item v-for="menu in menus" :key="menu.key" :name="menu.key">
          {{ menu.name }}
        </Menu-item>

        <span class="assistant">
          <Dropdown trigger="click" v-show="user.id" @on-click="operate">
            <img
              class="user-img"
              v-show="!loading"
              :src="user.avatarPath ? user.avatarPath : imgUser"
            />
            <button class="user-name">
              {{ user.userName }}
              <Icon type="md-arrow-dropdown" size="20"> </Icon>
            </button>

            <DropdownMenu slot="list" style="width: 130px">
              <!-- <Dropdown
                placement="right-start"
                @on-click="toChangeAccount"
                v-if="dataSwitchList.length > 0"
                transfer
              >
                <DropdownItem style="width: 130px">
                  <img :src="imgChangeUser" class="img-icon" />
                  {{ $t('global_change_account') }}
                  <img :src="imgRight" class="img-change" />
                </DropdownItem>
                <DropdownMenu
                  slot="list"
                  :key="index"
                  v-for="(list, index) in dataSwitchList"
                >
                  <DropdownItem :name="list.id"
                    >{{ list.introduction }}({{
                      list.remark + (list.role ? ', ' + list.role : '')
                    }})</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown> -->
              <DropdownItem :name="$G.route.center">
                <img :src="imgUserCenter" class="img-icon" />
                {{ $t('global_user_center') }}
              </DropdownItem>
              <DropdownItem :name="$G.route.login">
                <img :src="imgExit" class="img-icon" />
                {{ $t('global_logout') }}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </span>
      </div>
    </Menu>
  </Header>
</template>

<script>
import imgLogo from '@/assets/logo.png';
import imgUser from '@/assets/user.png';
import imgUserCenter from '@/assets/user-center.png';
import imgExit from '@/assets/exit.png';
import imgChangeUser from '@/assets/change-user.png';
import imgRight from '@/assets/right.jpg';
import Store from 'store';

export default {
  name: 'basicHeader',
  props: ['menus'],
  computed: {
    activeKey() {
      return this.$route['path'].split('/')[1];
    }
  },
  data() {
    return {
      loading: false,
      imgLogo,
      imgUser,
      imgUserCenter,
      imgExit,
      imgChangeUser,
      imgRight,
      user: {} // 用户信息
    };
  },
  created() {
    this.user = Store.get(this.$G.store.userInfo);
  },
  methods: {
    selectMenu(key) {
      this.menus.some(i => {
        if (i.key == key) {
          this.$emit('change-menu', i);
          this.$router.push(`/${key}`);
          return true;
        }
      });
    },
    operate(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style lang="less">
.chrome-tip {
  color: #262626;
  font-size: 12px;
  line-height: 20px;
}
.layout {
  height: 100%;
  min-width: 1200px;
  .layout-menu-top {
    height: 50px;
    line-height: 50px;
    z-index: 901;
  }
  .layout-assistant {
    .img-icon {
      width: 12px;
      height: 12px;
      margin-right: 10px;
    }
    .img-change {
      width: 8px;
      height: 8px;
      margin-left: 5px;
    }
    .logo-style {
      float: left;
      max-width: 72px;
      height: 27px;
      margin-left: 3.1rem;
      margin-top: 11.5px;
      margin-right: 2.05rem;
      cursor: pointer;
    }
    .assistant {
      height: 50px;
      float: right;
      margin-right: 3rem;
      cursor: pointer;
      .user-img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      .user-name {
        font-size: 14px;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 0.5rem;
        margin-right: 1.5rem;
        .icon-style {
          margin-left: 5px;
        }
      }
      .common-btn {
        font-size: 14px;
        color: #ffffff;
        margin-right: 1.5rem;
        .ivu-badge-count {
          top: -19px !important;
        }
        .cart-btn {
          font-size: 14px;
          color: #ffffff;
        }
      }
      .btn-active {
        font-size: 14px;
        margin-right: 1.5rem;
        color: #262626;
        font-weight: 500;
        border-bottom: 2px solid #262626;
      }
      //.common-btn:last-child {
      //  margin-right: 0;
      //}
    }
  }
  .ivu-badge-count {
    top: -13px;
  }
  .ivu-menu-vertical .ivu-menu-item-group-title {
    height: 54px;
    line-height: 54px;
    font-size: 16px;
    padding-left: 24px;
    font-weight: bold;
  }
  .ivu-menu-dark {
    background-color: #262626;
  }
  .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item-active,
  .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu-active,
  .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item:hover,
  .ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu:hover {
    color: #fff;
    font-weight: bold;
  }
  > .content-main {
    height: calc(~'100% - 50px');
  }
  .content-fullscreen {
    margin: 2px 0;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
  }
}
</style>
