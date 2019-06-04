<template>
  <div class="op-organize-container setting-container">
    <div class="title">{{ $t('add_organize') }}</div>
    <div class="form-container">
      <Form
        ref="organizeForm"
        :model="organizeForm"
        :rules="organizeRule"
        :label-width="120"
        :closable="false"
      >
        <FormItem :label="$t('organize') + '：'" prop="organize">
          <Row>
            <Col :span="formItemSpan">
              <Input
                v-model="organizeForm.organize"
                :placeholder="$t('organize_placeholder')"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('pre_organize') + '：'" prop="preOrganize">
          <Row>
            <Col :span="formItemSpan">
              <Cascader
                change-on-select
                v-model="organizeForm.preOrganize"
                :placeholder="$t('global_organize_placeholder')"
                :data="preOrganizeData"
              ></Cascader>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('owner') + '：'" prop="owner">
          <Row>
            <Col :span="formItemSpan">
              <Select
                v-model="organizeForm.owner.id"
                :placeholder="$t('owner_placeholder')"
              >
                <Option
                  v-for="item in ownerArr"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.userName }}</Option
                >
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('global_priorities') + '：'" prop="priorities">
          <Row>
            <Col :span="formItemSpan">
              <div class="priority-block">
                <Tag
                  v-for="(p, i) in organizeForm.priorities"
                  closable
                  @on-close="removePriority(i)"
                  :key="i"
                >
                  {{ p.name }}
                </Tag>
              </div>
            </Col>
            <Col span="3" class="ml-2">
              <Button @click="morePriorities">{{
                $t('global_more_priorities')
              }}</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
    <div class="fix-footer">
      <Button class="common-btn-cancel" @click="cancel">{{
        $t('global_cancel')
      }}</Button>
      <Button class="common-btn-confirm ml-large " @click="submit">{{
        $t('global_submit')
      }}</Button>
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
  organizeDetail as organizeDetailApi,
  updateOrganize as updateOrganizeApi,
  organizeCreateConfig as organizeCreateConfigApi,
  createOrganize as createOrganizeApi
} from '@/service/settings/organize';
import { formatOrganizeData } from 'lt-utils/format';
import pageLoadingMixin from '@/mixins/page/pageLoadingMixin';

export default {
  name: 'OpOrganize',
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
      organizeForm: {
        id: '',
        organizeCode: [], // demo: ['1', '3']
        organize: '',
        preOrganize: [],
        owner: {
          id: '',
          userName: ''
        },
        priorities: [
          // {
          //   code: 'resource:farbic:edit',
          //   name: '编辑面料',
          //   id: '1112312512512'
          // }
        ]
      },
      organizeRule: {
        organize: [
          { required: true, message: this.$t('organize_placeholder') }
        ],
        preOrganize: [
          { required: true, message: this.$t('pre_organize_placeholder') }
        ],
        owner: [{ required: true, message: this.$t('owner_placeholder') }]
      },
      preOrganizeData: [],
      ownerArr: [
        // {
        //   id: 'owner_1',
        //   userName: '负责人_1'
        // },
      ],
      prioritySelectModalShow: false,
      selectedPriorityCodes: []
    };
  },
  methods: {
    successTipAndReload() {
      this.$Message.success(this.$t('global_operate_success'));
      setTimeout(() => {
        this.$router.push(this.$G.route.organize);
      }, 500);
    },
    removePriority(i) {
      this.organizeForm.priorities.splice(i, 1);
    },
    triggerPrioritySelectModal(bool) {
      this.prioritySelectModalShow = bool;
    },
    onPrioritySelectOk(addedPriorities) {
      this.triggerPrioritySelectModal(false);
      this.organizeForm.priorities = addedPriorities;
    },
    onPrioritySelectCancel() {
      this.triggerPrioritySelectModal(false);
    },
    morePriorities() {
      let prioritiesCodes = this.organizeForm.priorities.map(vo => vo.code);
      this.selectedPriorityCodes = prioritiesCodes;
      this.triggerPrioritySelectModal(true);
    },
    async createOrganize() {
      let {
        organize,
        owner: { id: ownerId },
        preOrganize
      } = this.organizeForm;
      this.triggerLoading(true);

      let res = await createOrganizeApi({
        parentId: preOrganize.length ? preOrganize[preOrganize.length - 1] : '',
        name: organize,
        leader: ownerId,
        ownPermissions: this.organizeForm.priorities.map(({ id, code }) => ({
          code,
          id
        }))
      });
      if (res) {
        this.triggerLoading(false);
        this.successTipAndReload();
      }
    },
    async updateOrganize() {
      let {
        id,
        organize,
        owner: { id: ownerId },
        preOrganize
      } = this.organizeForm;
      this.triggerLoading(true);
      let res = await updateOrganizeApi({
        id,
        parentId: preOrganize.length ? preOrganize[preOrganize.length - 1] : '',
        name: organize,
        leader: ownerId,
        ownPermissions: this.organizeForm.priorities.map(({ id, code }) => ({
          code,
          id
        }))
      });
      if (res) {
        this.triggerLoading(false);
        this.successTipAndReload();
      }
    },
    submit() {
      this.$refs.organizeForm.validate(valid => {
        if (valid) {
          if (this.mode === this.MODES.edit) {
            this.updateOrganize();
          } else if (this.mode === this.MODES.add) {
            this.createOrganize();
          }
        }
      });
    },
    cancel() {
      history.go(-1);
    },
    async getOrganizeDetail(id) {
      this.triggerLoading(true);
      let { data } = await organizeDetailApi({ id });
      this.triggerLoading(false);
      return data;
    },
    async getOrganizeCreateConfig() {
      this.triggerLoading(true);
      let { data } = await organizeCreateConfigApi();
      this.triggerLoading(false);
      return data;
    },
    processOrganize(organize) {
      let {
        organizeTree = [],
        userList = [],
        detail = {},
        ownPermissionList = []
      } = organize;
      this.preOrganizeData = formatOrganizeData(organizeTree);
      this.ownerArr = userList;

      let mode = this.mode;
      let MODES = this.MODES;
      if (mode === MODES.edit) {
        let { name, leader } = detail;
        let ownerId = +leader;
        this.organizeForm.organize = name;
        if (ownerId) {
          for (let i = 0, l = userList.length; i < l; i++) {
            let user = userList[i];
            if (user.id === ownerId) {
              this.organizeForm.owner.id = ownerId;
              this.organizeForm.owner.userName = user.userName;
              break;
            }
          }
        }
        this.organizeForm.priorities = ownPermissionList;
      }
    }
  },
  async mounted() {
    let { edit, id, organizeCode = '' } = this.$route.query;
    organizeCode = decodeURIComponent(organizeCode);
    let mode;
    let organize = {};

    // 根据上级部门id自动填入上级部门
    if (organizeCode) {
      organizeCode = organizeCode.split(':').map(idStr => +idStr);
      this.organizeForm.organizeCode = organizeCode;
      this.organizeForm.preOrganize = organizeCode;
    }

    if (+edit) {
      mode = this.MODES.edit;
      this.mode = mode;
      if (!id) {
        alert(this.$t('global_param_error_no_id'));
      } else {
        id = +id;
        this.organizeForm.id = id;
        organize = await this.getOrganizeDetail(id);
      }
    } else {
      this.mode = this.MODES.add;
      organize = await this.getOrganizeCreateConfig();
    }
    this.processOrganize(organize);
  }
};
</script>
<style lang="less">
.op-organize-container {
  position: relative;
  padding-bottom: 200px;
  min-height: 600px;
  overflow: auto;
  .priority-block {
    border: 1px solid #dcdee2;
    height: 100px;
    overflow: auto;
    background: white;
  }
}
</style>
<i18n>
{
  "en": {
    "organize": "部门",
    "add_organize": "新建部门",
    "organize_placeholder": "请选择部门",
    "pre_organize": "上级部门",
    "pre_organize_placeholder": "请选择上级部门",
    "owner": "负责人",
    "owner_placeholder": "请选择负责人"
  },
  "zh-CN": {
    "organize": "部门",
    "add_organize": "新建部门",
    "organize_placeholder": "请选择部门",
    "pre_organize": "上级部门",
    "pre_organize_placeholder": "请选择上级部门",
    "owner": "负责人",
    "owner_placeholder": "请选择负责人"
  }

}

</i18n>
