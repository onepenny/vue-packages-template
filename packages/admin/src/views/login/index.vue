<template>
  <div class="login-container">
    <video autoplay muted loop>
      <source src="../../assets/login.mp4" />
    </video>
    <div class="container">
      <div class="left-con">
        <img src="../../assets/left-img.png" width="100%" />
      </div>
      <div class="right-con">
        <div>
          <h2 class="title">{{ $t('inctex') }}</h2>
          <p class="sub-title"></p>
          <Form
            ref="formInline"
            :model="formInline"
            :rules="ruleInline"
            style="padding: 0 20px"
          >
            <FormItem prop="user">
              <Input
                type="text"
                v-model="formInline.user"
                placeholder="Username"
                autofocus
              >
                <Icon size="16" type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="formInline.password"
                placeholder="Password"
                @keyup.enter.native="toSubmit"
              >
                <Icon size="16" type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button
                class="login-btn"
                @click="toSubmit"
                :disabled="btnDisable"
                :loading="loading"
                >{{ $t('login') }}</Button
              >
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postLogin } from '@/service/login';
import Store from 'store';

export default {
  name: 'Login',
  data() {
    return {
      formInline: {
        user: '',
        password: ''
      },
      ruleInline: {
        user: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false
    };
  },
  computed: {
    btnDisable() {
      return (
        this.formInline['user'] === '' || this.formInline['password'] === ''
      );
    }
  },
  created() {
    Store.clearAll();
  },
  methods: {
    async toSubmit() {
      event.preventDefault();
      const { user, password } = this.formInline;
      this.loading = true;
      let res = await postLogin({
        clientId: this.$G.userLogin.clientId,
        clientSecret: this.$G.userLogin.clientSecret,
        username: user,
        password
      });
      this.loading = false;
      if (!res) return;
      Store.set(
        this.$G.store.token,
        `${res.data.token_type} ${res.data.access_token}`
      );
      Store.set(this.$G.store.userInfo, res.data.user);
      // TODO：等需求确定后修改
      this.$router.push(this.$G.route.fabric);
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  video {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: 100%;
    height: auto;
    z-index: -9999;
    object-fit: fill;
  }
  height: 100%;
  .container {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -250px;
    margin-left: -300px;
    width: 600px;
    height: 390px;
    .left-con {
      width: 260px;
      height: 100%;
      float: left;
    }
    .right-con {
      width: 340px;
      height: 100%;
      border-radius: 0px 5px 5px 0px;
      background-color: #ffffff;
      float: left;
      .login-type {
        cursor: pointer;
        height: 47px;
        margin-bottom: 10px;
        img {
          width: 48px;
          height: 47px;
          float: right;
        }
        button {
          font-size: 16px;
          font-weight: 600;
          color: rgba(74, 74, 74, 1);
          padding-top: 20px;
          padding-left: 118px;
        }
      }
      .qrcode-con {
        margin-top: 17px;
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: rgba(74, 74, 74, 1);
        position: relative;
        .tips-one {
          padding-top: 20px;
        }
      }
      .bottom-operate {
        padding: 0 20px;
        line-height: 20px;
        .sign-account {
          font-size: 12px;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
          position: relative;
          bottom: 15px;
          cursor: pointer;
        }
      }
      .sub-title {
        text-align: center;
        font-size: 12px;
        color: rgba(74, 74, 74, 1);
        padding-bottom: 20px;
        padding-top: 10px;
        margin-bottom: 25px;
      }
      .title {
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        color: #262626;
      }
      .visitor {
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        text-align: right;
        color: rgba(155, 155, 155, 1);
      }
      .login-btn {
        width: 300px;
        height: 40px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
        background-color: #595959;
        box-shadow: 0 0 4px 0 #9b9b9b;
      }
      .login-btn:disabled {
        background-color: #efeeee;
        color: #bbbec4;
        border: none;
      }
    }

    .ivu-input-group-prepend,
    .ivu-input-group-append {
      border: none;
      background-color: #ffffff;
      border-radius: 0;
      border-bottom: 1px solid #dddee1;
    }
    .ivu-input {
      border-top: none;
      border-left: none;
      border-right: none;
      border-bottom: 1px solid #dddee1;
      border-radius: 0;
    }
  }
  .network-info {
    width: 100%;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    position: fixed;
    bottom: 12px;
  }
}
</style>

<i18n>
{
  "zh-CN": {
    "inctex": "全球3D时尚数字化内容平台",
    "visitor": "随便看看",
    "login": "登录"
  },
  "en": {
    "inctex": "Global 3D Digital Style Fashion Platform",
    "visitor": "Visible",
    "login": "Login"
  }
}
</i18n>
