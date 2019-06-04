<template>
  <div class="op-user-container setting-container">
    <div class="title">{{ titleText }}</div>
    <div class="form-container">
      <Form
        ref="userForm"
        :model="userForm"
        :rules="userRule"
        :label-width="120"
        :closable="false"
      >
        <FormItem :label="$t('userName') + '：'" prop="userName">
          <Row>
            <Col :span="formItemSpan">
              <Input
                v-model="userForm.userName"
                :placeholder="$t('userName_placeholder')"
              />
              <p class="form-tips">{{ $t('userName_rule') }}</p>
              <p class="form-tips" style="margin-top: -14px;">
                {{ $t('userName_tip_one') }}
              </p>
              <p class="form-tips" style="margin-top: -14px;">
                {{ $t('userName_tip_two') }}
              </p>
            </Col>
          </Row>
        </FormItem>

        <FormItem :label="$t('trueName') + '：'" prop="trueName">
          <Row>
            <Col :span="formItemSpan">
              <Input
                v-model="userForm.trueName"
                :placeholder="$t('name_placeholder')"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('login_pwd') + '：'" prop="password">
          <Row>
            <Col :span="formItemSpan">
              <Input
                autocomplete="off"
                :type="userForm.passwordMark ? 'password' : 'text'"
                v-model="userForm.password"
                :placeholder="$t('pwd_placeholder')"
              >
                <span slot="append" @click="triggerPasswordMark">
                  <Icon
                    :type="userForm.passwordMark ? 'ios-eye-off' : 'ios-eye'"
                  ></Icon>
                </span>
              </Input>

              <p class="form-tips">{{ $t('pwd_rule') }}</p>
              <p class="form-tips" style="margin-top: -14px;">
                {{ $t('pwd_tip') }}
              </p>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('position') + '：'" prop="position">
          <Row>
            <Col :span="formItemSpan">
              <Select
                v-model="userForm.position"
                :placeholder="$t('position_placeholder')"
              >
                <Option
                  v-for="item in positionArr"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </Col>
            <Col span="1">
              <Icon
                type="ios-settings-outline"
                size="24"
                @click="jumpPositionManage"
              />
            </Col>
            <Col span="1">
              <Icon
                type="ios-refresh"
                size="24"
                :class="{ 'spin-icon-load': positionLoading }"
                @click="refreshPositionArr"
              >
              </Icon>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('organize') + '：'" prop="organize">
          <Row>
            <Col :span="formItemSpan">
              <Cascader
                change-on-select
                v-model="userForm.organize"
                :placeholder="$t('global_organize_placeholder')"
                :data="organizeData"
              ></Cascader>
            </Col>
            <Col span="1" class="ml-2">
              <Icon
                type="ios-settings-outline"
                size="24"
                @click="jumpOrganizeManage"
              />
            </Col>
            <Col span="1">
              <Icon
                type="ios-refresh"
                size="24"
                :class="{ 'spin-icon-load': organizeLoading }"
                @click="refreshOrganizeData"
              >
              </Icon>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('global_priorities') + '：'" prop="priorities">
          <Row>
            <Col span="3" class="ml2">
              <Button @click="morePriorities">{{
                $t('global_more_priorities')
              }}</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('email') + '：'" prop="email">
          <Row>
            <Col :span="formItemSpan">
              <Input
                v-model="userForm.email"
                :placeholder="$t('email_placeholder')"
              />
              <p class="form-tips">{{ $t('email_tip') }}</p>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('mobile') + '：'" prop="mobile">
          <Row>
            <Col :span="formItemSpan">
              <Input
                v-model="userForm.mobile"
                :placeholder="$t('mobile_placeholder')"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('forbidden') + '：'" prop="forbidden">
          <Row>
            <Col :span="formItemSpan">
              <RadioGroup v-model="userForm.forbidden">
                <Radio
                  :label="f.value"
                  v-for="(f, i) in forbiddenArr"
                  :key="i"
                  >{{ f.label }}</Radio
                >
              </RadioGroup>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>

    <div class="fix-footer">
      <Button class="common-btn-cancel" @click="cancel">{{
        $t('cancel')
      }}</Button>
      <Button
        class="common-btn-confirm ml-large"
        type="primary"
        @click="submit"
        >{{ $t('global_submit') }}</Button
      >
    </div>

    <priority-select-modal
      :show="prioritySelectModalShow"
      :selectedPriorityCodes="selectedPriorityCodes"
      @ok="onPrioritySelectOk"
      @cancel="onPrioritySelectCancel"
    />
    <Spin fix size="large" v-if="showLoading"></Spin>
  </div>
</template>
<script>
import prioritySelectModal from '@/components/settings/prioritySelectModal';
import {
  getUserOpConfig as getUserOpConfigApi,
  getUser as getUserApi,
  saveUserConfig as saveUserConfigApi,
  updateUserConfig as updateUserConfigApi
} from '@/service/settings/user';
import { formatOrganizeData } from 'lt-utils/format';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';

export default {
  name: 'OpUser',
  mixins: [pageLoadingMixin],
  components: {
    prioritySelectModal
  },
  data() {
    return {
      MODES: {
        add: 'add',
        edit: 'edit'
      },
      mode: '',
      formItemSpan: 20,
      userForm: {
        id: null,
        userName: '',
        trueName: '',
        password: '',
        passwordMark: true,
        position: '',
        organize: [],
        priorities: [],
        email: '',
        mobile: '',
        forbidden: 0
      },
      positionLoading: false,
      positionArr: [],
      organizeLoading: false,
      organizeData: [],
      forbiddenArr: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否 '
        }
      ],
      userRule: {
        userName: [
          {
            required: true,
            validator: this.validateUserName
          }
        ],
        trueName: [
          {
            required: true,
            message: this.$t('name_placeholder')
          }
        ],
        password: [{ required: true, validator: this.validatePass }],
        position: [
          {
            required: true,
            message: this.$t('position_placeholder')
          }
        ],
        organize: [
          {
            required: true,
            message: this.$t('organize_placeholder')
          }
        ]
      },
      prioritySelectModalShow: false,
      selectedPriorityCodes: []
    };
  },
  computed: {
    titleText() {
      let ret = '';
      if (this.mode === this.MODES.edit) {
        ret = '编辑员工';
      } else {
        ret = '新增员工';
      }
      return ret;
    }
  },
  methods: {
    cancel() {
      history.go(-1);
    },
    async saveOrUpdateUserConfig() {
      this.triggerLoading(true);
      let {
        id,
        userName,
        trueName,
        password,
        position,
        organize,
        priorities,
        email,
        mobile,
        forbidden
      } = this.userForm;
      let param = {
        userName,
        trueName,
        password,
        positionId: position,
        email,
        mobile,
        isLock: !!forbidden,
        organizeId: organize.length ? organize[organize.length - 1] : '',
        ownPermissions: priorities.map(({ id, code }) => ({
          code,
          id
        }))
      };
      let res;
      if (this.mode === this.MODES.edit) {
        param.id = id;
        res = await updateUserConfigApi(param);
      } else {
        res = await saveUserConfigApi(param);
      }
      this.triggerLoading(false);
      if (res) {
        this.successTipAndReload();
      }
    },
    successTipAndReload() {
      this.$Message.success(this.$t('global_operate_success'));
      setTimeout(() => {
        this.$router.push(this.$G.route.user);
      }, 500);
    },
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.saveOrUpdateUserConfig();
        }
      });
    },
    validateUserName(rule, value, callback) {
      if (!/[a-zA-Z0-9_]{3,25}$/.test(value)) {
        callback(new Error(this.$t('input_correct_username')));
      } else {
        callback();
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('person_placeholder_pwd')));
      } else if (value.length > 25 || value.length < 6) {
        callback(new Error(this.$t('person_pwd_length')));
      } else {
        callback();
      }
    },
    refreshPositionArr() {
      this.positionLoading = true;
      this.getUserOpConfig({ refreshingConfig: true });
      setTimeout(() => {
        this.positionLoading = false;
      }, 1000);
    },
    refreshOrganizeData() {
      this.organizeLoading = true;
      this.getUserOpConfig({ refreshingConfig: true });
      setTimeout(() => {
        this.organizeLoading = false;
      }, 1000);
    },
    jumpPositionManage() {
      this.$router.push(this.$G.route.position);
    },
    jumpOrganizeManage() {
      this.$router.push(this.$G.route.organize);
    },
    triggerPrioritySelectModal(bool) {
      this.prioritySelectModalShow = bool;
    },
    onPrioritySelectOk(addedPriorities) {
      this.triggerPrioritySelectModal(false);
      this.userForm.priorities = addedPriorities;
    },
    onPrioritySelectCancel() {
      this.triggerPrioritySelectModal(false);
    },
    morePriorities() {
      let prioritiesIds = this.userForm.priorities.map(vo => vo.code);
      this.selectedPriorityCodes = prioritiesIds;
      this.triggerPrioritySelectModal(true);
    },
    async getUser(id) {
      let param = {
        id
      };
      this.triggerLoading(true);
      let { data } = await getUserApi(param);
      this.triggerLoading(false);
      this.processData(data);
    },
    processData(data, { refreshingConfig = false } = {}) {
      let { organizeTree, positionList, detail, ownPermissionList } = data;
      this.positionArr = positionList;
      this.organizeData = formatOrganizeData(organizeTree);

      // 如果来源于刷新配置操作, 只进行上方部门-岗位配置设置操作 + 此处部门-岗位数据重置 并立即返回
      if (refreshingConfig) {
        this.userForm.position = '';
        this.userForm.organize = [];
        return;
      }

      if (this.mode === this.MODES.edit) {
        let {
          userName,
          trueName,
          positionId,
          organizeIds,
          email,
          mobile,
          isLock
        } = detail;
        this.userForm.userName = userName;
        this.userForm.trueName = trueName;
        this.userForm.position = positionId;
        this.userForm.organize = organizeIds;
        this.userForm.priorities = ownPermissionList;
        this.userForm.email = email;
        this.userForm.mobile = mobile;
        this.userForm.forbidden = +isLock;
      }
    },
    async getUserOpConfig({ refreshingConfig = false } = {}) {
      this.triggerLoading(true);

      let { data } = await getUserOpConfigApi();
      this.processData(data, { refreshingConfig });
      this.triggerLoading(false);
    },
    triggerPasswordMark() {
      this.userForm.passwordMark = !this.userForm.passwordMark;
    }
  },
  mounted() {
    let { edit, id } = this.$route.query;
    let mode;
    if (+edit) {
      mode = this.MODES.edit;
      this.mode = mode;
      id = +id;
      this.userForm.id = id;
      if (!id) {
        alert(this.$t('param_error_no_user_id'));
      } else {
        this.getUser(id);
      }
    } else {
      mode = this.MODES.add;
      this.mode = mode;
      this.getUserOpConfig();
    }
  }
};
</script>
<style lang="less">
.op-user-container {
  position: relative;
  padding-bottom: 80px;
  .spin-icon-load {
    animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
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
}
</style>
<i18n>
{
  "en": {
    "userName": "用户名",
    "userName_placeholder": "请填写用户名",
    "userName_rule": "由3-25位字母或数字组成",
    "userName_tip_one": "此用户名将作为用户登录时所用的名称.一经提交，将无法修改. ",
    "userName_tip_two": "请不要与系统中现有的用户名重复.",
    "trueName": "姓名",
    "name_placeholder": "请输入真实姓名",
    "pwd_rule": "为此用户分配一个密码. 长度限制为6-25位.",
    "pwd_tip": "建议使用特殊字符与字母、数字的混编样式，以增加系统安全性. ",
    "login_pwd": "登录密码",
    "pwd_placeholder": "请输入登录密码",
    "pwd_length": "输入的密码长度不正确",
    "person_placeholder_pwd": "请输入密码",
    "person_pwd_length": "输入的密码长度不正确",
    "position": "岗位",
    "position_placeholder": "请选择岗位",
    "organize": "所属部门",
    "organize_placeholder": "请选择部门",
    "email": "电子邮箱",
    "email_placeholder": "请输入用户电子邮箱",
    "email_tip": "电子邮箱地址作为此用户的主要联系方式，一经提交，将无法修改",
    "mobile": "联系电话",
    "mobile_placeholder": "请输入联系电话",
    "forbidden": "是否禁用",
    "cancel": "取消",
    "param_error_no_user_id": "参数错误:无用户id",
    "input_correct_username": "请正确输入用户名"
  },
  "zh-CN": {
    "userName": "用户名",
    "userName_placeholder": "请填写用户名",
    "userName_rule": "由3-25位字母或数字组成",
    "userName_tip_one": "此用户名将作为用户登录时所用的名称.一经提交，将无法修改. ",
    "userName_tip_two": "请不要与系统中现有的用户名重复.",
    "trueName": "姓名",
    "name_placeholder": "请输入真实姓名",
    "pwd_rule": "为此用户分配一个密码. 长度限制为6-25位.",
    "pwd_tip": "建议使用特殊字符与字母、数字的混编样式，以增加系统安全性. ",
    "login_pwd": "登录密码",
    "pwd_placeholder": "请输入登录密码",
    "pwd_length": "输入的密码长度不正确",
    "person_placeholder_pwd": "请输入密码",
    "person_pwd_length": "输入的密码长度不正确",
    "position": "岗位",
    "position_placeholder": "请选择岗位",
    "organize": "所属部门",
    "organize_placeholder": "请选择部门",
    "email": "电子邮箱",
    "email_placeholder": "请输入用户电子邮箱",
    "email_tip": "电子邮箱地址作为此用户的主要联系方式，一经提交，将无法修改",
    "mobile": "联系电话",
    "mobile_placeholder": "请输入联系电话",
    "forbidden": "是否禁用",
    "cancel": "取消",
    "param_error_no_user_id": "参数错误:无用户id",
    "input_correct_username": "请正确输入用户名"
  }
}
</i18n>
