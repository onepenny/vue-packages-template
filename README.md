<h1 align="center">lt-vue</h1>

本工程架构主要基于 vue + vuex + vue-router + less + ES6/7 + webpack + flyio + eslint + prettier + yarn + yarn workspaces ，实现对 vue 的多项目管理。

## 快速开始
```bash
# 克隆项目
$ git clone git@116.62.211.118:lt_plm/web_front.git
# 全局安装 yarn
$ npm i yarn -g
# 进入工程
$ cd web_front
# 安装依赖
$ yarn install
# 启动 admin 项目
$ yarn run dev:admin
```

## 依赖管理
全部项目公用依赖管理
```bash
$ yarn add vue -W
$ yarn remove vue -W
```

项目单独依赖管理
```bash
# 进入项目
$ cd packages/admin/
# 安装生产依赖
$ yarn add vue
# 卸载依赖
$ yarn remove vue
```
```bash
# 通过 yarn workspace 直接对 admin 项目安装依赖
$ yarn workspace admin add vue
# 卸载依赖
$ yarn workspace admin remove vue
```

## 项目运行
以 admin 项目为例
```bash
# 开发模式
$ yarn run dev:admin
# 开发环境打包
$ yarn run build:admin:dev
# 预发环境打包
$ yarn run build:admin:pre
# 生产环境打包
$ yarn run build:admin:pro
```

## 项目配置
以 admin 项目为例
```js
module.exports = {
  title: 'admin',
  proxy: {
    '/api': {
      target: 'http://style3d.com',
      ws: true,
      changeOrigin: true
    }
  },
  port: 9000,
  baseUrl: '/admin',
  api: {
    local: '/api',
    dev: '/api',
    pre: '/api',
    pro: '/api'
  }
};
```
* `title` - 网页默认的标题
* `proxy` - 开发环境代理
* `port` - 开发环境使用端口
* `baseUrl` - 单页面应用基础路径
* `api` -  单页面应用请求基础路径，若请求域名一致，则配置基础路径，若请求域名不一致，则配置域名 + 基础路径

## UI 框架
默认 UI 框架为 element-ui。element-ui 相对于 iview 实现了 css 按需加载，打包体积更小。

项目中 element-ui、iview 均已配置按需加载，

以 element-ui 中按需引入组件为例，在 main.js 中写入以下内容：
```js
import { Button, Select } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
```

## 国际化
通过 vue-i18n 单文件组件的方式实现，书写方式如下：
```html
<template>
  <div>{{ $t('hello') }}</div>
</template>

<i18n>
{
  "en": {
    "hello": "Hello"
  },
  "zh-CN": {
    "hello": "你好"
  }
}
</i18n>
```

以 admin 项目为例，具体翻译流程：

1. 导出翻译文件
```bash
$ yarn run i18n:admin:export
```

2. 对导出文件进行翻译，翻译文件位于项目目录 src/config/translation.json 中，具体格式如下：
```json
{
  "packages/admin/src/views/home/index.vue": {
    "en": {
      "hello": "Hello"
    },
    "zh-CN": {
      "hello": "你好"
    }
  }
}
```

3. 翻译好之后，导入翻译文件，翻译文件不上传 git
```bash
$ yarn run i18n:admin:import
```

## 项目布局
```
.
├─ config                                 // 项目配置目录
│    ├─ admin.js                          // admin 项目配置
│    └─ default.js                        // 默认配置
├─ packages                               // 模块目录
│    ├─ admin                             // admin 项目
│    │    └─ src                          // 项目源码
│    │        ├─ app.vue                  // 项目根组组件
│    │        ├─ assets                   // 图片资源
│    │        ├─ components               // 子组件目录
│    │        ├─ config                   // 项目配置
│    │        ├─ layout                   // 布局组件目录
│    │        ├─ main.js                  // 主程序入口
│    │        ├─ routes                   // 路由配置目录
│    │        ├─ store                    // vuex
│    │        ├─ service                  // 请求配置目录
│    │        ├─ styles                   // 公共样式目录
│    │        └─ views                    // 容器组件目录
│    ├─ lt-component                      // 多项目公用组件
│    ├─ lt-router                         // 多项目公用路由配置
│    ├─ lt-utils                          // 多项目公用方法
│    ├─ lt-xhr                            // 多项目公用请求配置
│    └─ template                          // template 项目
├─ scripts                                // 脚本目录
.
```

## 规范
### 组件
- 组件写法

  html、js、less 统一写在一个文件中，文件名尽量保持和路由一致。

  html 最外层 className 为 `${组件名}-container`

  js 采取 es6 写法，不要出现 function

  less 默认采用 scoped，修改 UI 框架样式最好全部在 styles 统一修改

```html
<template>
  <div class="template-container">
  </div>
</template>
```
```js
<script>
export default {
  name: '',
  components: {},
  props: [],
  data() {
    return {}
  },
  computed() {},
  created() {},
  methods: {
    do() {}
  }
};
</script>
```
```css
<style lang="less" scoped>
.template-container {}
</style>
```

- 子组件规范

  三种子组件：父组件单独使用的子组件、单项目的共用子组件、多项目的共用子组件

  1. 父组件单独使用的子组件：放在 components 目录下，存放路径和父组件对应

  2. 单项目的共用子组件：放在 components/common 目录下，引用通过 `com-${组件名}` 直接引用即可。

  3. 多项目的共用子组件：放在 lt-component 下，引用通过 `lt-${组件名}` 引用

### 请求

- 新建请求：在 service 文件中新建请求，按路由划分

- 写法，统一采取 async/await 写法，基本写法示例：

```js
async getInfo() {
  let res = await getInfo({
    // 参数
  });
  // 获取请求结果，并作相应处理
  this.res = res
}
```

- 错误处理，默认提供 Message 弹出错误信息，如果不满足，可以通过已定义的方式处理，或对错误进行自定义处理

1. 默认情况

    Message 弹出错误信息满足需求，则不作另外处理

2. 采用已定义方式处理，目前已经定义两种处理方式，可以在 config/global.js 中定义，后续将拓展

```js
// 发生该 code 返回为空
errorCodeResNull: [400],
// 发生该 code 返回登录页
errorCodeResLogin: [401]
```

  errorCodeResNull：定义后，如果发生 code 为 400，则发生该错误时，返回空，通常用于需要关闭 loading 的情况，下面为示例：

```js
async getInfo() {
  this.loading = true;
  let res = await getInfo({
    // 参数
  });
  this.loading = false;
  // 为空则不继续执行
  if (!res) return;
  // 获取请求结果，并作相应处理
  this.res = res
}
```

  errorCodeResLogin：定义后，如果发生 code 为 401，则发生该错误时，返回登录页，通常用于 token 失效情况

3. 自定义处理

```js
async getInfo() {
  this.loading = true;
  try {
    let res = await getInfo({
    // 参数
    });
    // 获取请求结果，并作相应处理
    this.res = res
  } catch (error) {
    // 对 error 进行自定义处理
  }
  this.loading = false;
}
```

### 本地存储

### 路由

- 新增路由，统一在项目目录 routes 文件添加新路由，目前必填三个字段

```js
{
  path: '',   // 路径
  name: 'login',  // 组件名，和组件文件命名相同
  component: () => import('@/views/login') // 按需加载组件
}
```

- 路由跳转两种方式

1. `router-link` 方式

```html
<router-link :to="$G.route.login">返回登陆页面</router-link>
```

2. 组件内 `this.$router` 方式

```js
this.$router.push(this.$G.route.login)
```

`this.$G.route` 后写要跳转到的组件文件名，即新建路由时的 name 字段


### 工具类使用
```js
// 尽量部分引用
import { simpleClone } from 'lt-utils/object';
```

## 后续功能
  - 通过脚本快速创建新项目
