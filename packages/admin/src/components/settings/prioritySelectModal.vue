<template>
  <div class="priority-select-container">
    <Modal
      v-model="show"
      fullscreen
      :styles="{ top: '0px', 'margin-bottom': '0px' }"
      :closable="false"
    >
      <p slot="header" style="text-align:left">
        <span>{{ $t('select_priority') }}</span>
      </p>
      <div class="priority-select-content">
        <div
          class="p"
          v-for="(pKey, i) in Object.keys(priorityData)"
          :key="'p' + i"
        >
          <div class="p-left">
            <Checkbox
              :indeterminate="priorityData[pKey]['indeterminate']"
              :value="priorityData[pKey]['checked']"
              @on-change="changeP(priorityData[pKey])"
              >{{ priorityData[pKey]['name'] }}</Checkbox
            >
          </div>
          <div class="p-right">
            <div
              class="pp"
              v-for="(ppKey, ii) in Object.keys(priorityData[pKey]['children'])"
              :key="'pp' + ii"
            >
              <div class="pp-left">
                <Checkbox
                  :indeterminate="
                    priorityData[pKey]['children'][ppKey]['indeterminate']
                  "
                  :value="priorityData[pKey]['children'][ppKey]['checked']"
                  @on-change="changeP(priorityData[pKey]['children'][ppKey])"
                  >{{ priorityData[pKey]['children'][ppKey]['name'] }}</Checkbox
                >
              </div>
              <div class="pp-right">
                <Checkbox
                  :value="
                    priorityData[pKey]['children'][ppKey]['children'][pppKey][
                      'checked'
                    ]
                  "
                  @on-change="
                    changeP(
                      priorityData[pKey]['children'][ppKey]['children'][pppKey]
                    )
                  "
                  class="ppp"
                  :disabled="
                    priorityData[pKey]['children'][ppKey]['children'][pppKey][
                      'disabled'
                    ]
                  "
                  v-for="(pppKey, iii) in Object.keys(
                    priorityData[pKey]['children'][ppKey]['children']
                  )"
                  :key="'ppp' + iii"
                >
                  {{
                    priorityData[pKey]['children'][ppKey]['children'][pppKey][
                      'name'
                    ]
                  }}
                  <!--权限的"所有" "仅自己"选项目前不做, 暂时勿删需求会变-->
                  <!--<span-->
                  <!--v-if="-->
                  <!--'all' in-->
                  <!--priorityData[pKey]['children'][ppKey]['children'][-->
                  <!--pppKey-->
                  <!--]-->
                  <!--"-->
                  <!--&gt;-->
                  <!--(-->
                  <!--<Checkbox-->
                  <!--:value="-->
                  <!--priorityData[pKey]['children'][ppKey]['children'][-->
                  <!--pppKey-->
                  <!--]['all'] === 1-->
                  <!--"-->
                  <!--@on-change="-->
                  <!--changePPPP(-->
                  <!--priorityData[pKey]['children'][ppKey]['children'][-->
                  <!--pppKey-->
                  <!--],-->
                  <!--1-->
                  <!--)-->
                  <!--"-->
                  <!--class="pppp"-->
                  <!--:key="'pppp' + 1"-->
                  <!--&gt;{{ $t('all') }}</Checkbox-->
                  <!--&gt;-->
                  <!--<Checkbox-->
                  <!--:value="-->
                  <!--priorityData[pKey]['children'][ppKey]['children'][-->
                  <!--pppKey-->
                  <!--]['all'] === 2-->
                  <!--"-->
                  <!--@on-change="-->
                  <!--changePPPP(-->
                  <!--priorityData[pKey]['children'][ppKey]['children'][-->
                  <!--pppKey-->
                  <!--],-->
                  <!--2-->
                  <!--)-->
                  <!--"-->
                  <!--class="pppp"-->
                  <!--:key="'pppp' + 2"-->
                  <!--&gt;{{ $t('own') }}</Checkbox-->
                  <!--&gt;-->
                  <!--)-->
                  <!--</span>-->
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div style="text-align: left;">
          <Button class="common-btn-cancel ml-20" @click="cancel">
            {{ $t('cancel') }}
          </Button>
          <Button class="common-btn-confirm" type="primary" @click="ok">
            {{ $t('confirm_submit') }}
          </Button>
        </div>
      </div>
    </Modal>
    <Spin fix size="large" v-if="showLoading" style="z-index: 1999;"></Spin>
  </div>
</template>
<script>
/**
 * 下方代码中: ps 均为priorityData的简写
 */

import { simpleClone } from 'lt-utils/object';
import { getAllPriorities } from '@/service/settings/priority';

export default {
  name: 'PrioritySelectModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedPriorityCodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showLoading: false,
      priorityData: {}
    };
  },
  watch: {
    show(val, oldVal) {
      if (val && !oldVal) {
        this.getData();
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    getSelectedPriorityIdArr() {
      let ps = this.priorityData;
      let ret = [];
      let pKeys = Object.keys(ps);
      pKeys.forEach(pKey => {
        let p = ps[pKey];
        let pChildrenKeys;
        if (
          p.children &&
          ((pChildrenKeys = Object.keys(p.children)) && pChildrenKeys.length)
        ) {
          pChildrenKeys.forEach(ppKey => {
            let pp = p.children[ppKey];
            let ppChildrenKeys;
            if (
              pp.children &&
              ((ppChildrenKeys = Object.keys(pp.children)) &&
                ppChildrenKeys.length)
            ) {
              ppChildrenKeys.forEach(pppKey => {
                let ppp = pp.children[pppKey];
                ppp.checked &&
                  ret.push({
                    code: [pKey, ppKey, pppKey].join(':'),
                    name: ppp.name,
                    id: ppp.id
                  });
              });
            } else if (pp.checked) {
              ret.push({
                code: [pKey, ppKey].join(':'),
                name: pp.name,
                id: pp.id
              });
            }
          });
        } else if (p.checked) {
          ret.push({
            code: [pKey].join(':'),
            name: p.name,
            id: p.id
          });
        }
      });
      return ret;
    },
    ok() {
      // 1. 获取新增权限列表_方法:遍历所有权限数据过滤出checked但非disabled项
      //    结果数据结构[{key: '1:12:121', name: '新增面料'}]
      let addedPriorityIdArr = this.getSelectedPriorityIdArr();

      // 2. 返回数据
      this.$emit('ok', simpleClone(addedPriorityIdArr));
    },
    // 权限的"所有" "仅自己"选项目前不做, 暂时勿删需求会变
    // changeAllProp(p, num) {
    //   if ('all' in p) {
    //     p.all = num;
    //   }
    // },
    getParent(ps, parentKey) {
      let ret = null;
      switch (parentKey.length) {
        case 1:
          ret = ps[parentKey[0]];
          break;
        case 2:
          ret = ps[parentKey[0]]['children'][parentKey[1]];
          break;
      }
      return ret;
    },
    changeP(item) {
      let priorityData;
      if (item.checked) {
        priorityData = this.cascadeChangeP(
          simpleClone(this.priorityData),
          item,
          false
        );
      } else {
        priorityData = this.cascadeChangeP(
          simpleClone(this.priorityData),
          item,
          true
        );
      }
      this.priorityData = priorityData;
    },
    judgeAndCheck(ps, item, bool) {
      if (!item.disabled) {
        item.checked = bool;
        this.judgeAndIndeterminateCheck(ps, item);
      }
    },
    judgeAndIndeterminateCheck(ps, item) {
      let parent = this.getParent(ps, item.parentKey);
      if (parent) {
        let parentChildrenKeys = Object.keys(parent.children);
        let childrenLen = parentChildrenKeys.length;
        let childrenCheckedLen = 0;
        parentChildrenKeys.forEach(cKey => {
          let { checked, indeterminate } = parent.children[cKey];
          checked && !indeterminate && (childrenCheckedLen += 1);
        });
        if (childrenCheckedLen > 0 && childrenCheckedLen < childrenLen) {
          parent.indeterminate = true;
          this.judgeAndIndeterminateCheck(ps, parent);
        } else {
          parent.indeterminate = false;
          this.judgeAndIndeterminateCheck(ps, parent);
        }
      }
    },
    // 循环勾选已选择权限, 所有勾选/去勾选都应实际调用此函数 以便统一管理
    cascadeChangeP(priorityData, item, bool) {
      let { parentKey, key } = item;
      let parent = this.getParent(priorityData, parentKey);
      let fundP = null;
      if (parent) {
        fundP = parent['children'][key];
      } else {
        fundP = priorityData[key];
      }

      // 虽然有不少重复代码, 但不应该合并, 理由:
      // 1. 实际操作清晰
      // 2. 分离勾选与非勾选操作 便于应对需求修改
      if (bool) {
        // 勾选
        let checkTrue = true;
        // fundP.checked = checkTrue;
        this.judgeAndCheck(priorityData, fundP, checkTrue);
        // this.changeAllProp(fundP, 1);
        // 所有子级全部勾选
        let fundPChildrenKeys = [];
        fundP.children &&
          ((fundPChildrenKeys = Object.keys(fundP.children)) &&
            fundPChildrenKeys.length) &&
          fundPChildrenKeys.forEach(ppKey => {
            let pp = fundP.children[ppKey];
            // pp.checked = checkTrue;
            this.judgeAndCheck(priorityData, pp, checkTrue);
            // this.changeAllProp(pp, 1);

            let ppChildrenKeys = [];
            pp.children &&
              ((ppChildrenKeys = Object.keys(pp.children)) &&
                ppChildrenKeys.length) &&
              ppChildrenKeys.forEach(pppKey => {
                let ppp = pp.children[pppKey];
                // ppp.checked = checkTrue;
                this.judgeAndCheck(priorityData, ppp, checkTrue);
                // this.changeAllProp(ppp, 1);
              });
          });

        //循环父级勾选判断
        let parentChildrenKeys = [];
        if (
          parent &&
          (parentChildrenKeys = Object.keys(parent.children || {})) &&
          parentChildrenKeys.length &&
          parentChildrenKeys.every(
            pChildrenKey => parent.children[pChildrenKey].checked
          )
        ) {
          this.cascadeChangeP(priorityData, parent, checkTrue);
        }
      } else {
        // 去勾选
        let checkFalse = false;
        // fundP.checked = checkFalse;
        this.judgeAndCheck(priorityData, fundP, checkFalse);
        // this.changeAllProp(fundP, 0);
        // 所有子级全部反勾选
        let fundPChildrenKeys = [];
        fundP.children &&
          ((fundPChildrenKeys = Object.keys(fundP.children)) &&
            fundPChildrenKeys.length) &&
          fundPChildrenKeys.forEach(ppKey => {
            let pp = fundP.children[ppKey];
            // pp.checked = checkFalse;
            this.judgeAndCheck(priorityData, pp, checkFalse);
            // this.changeAllProp(pp, 0);

            let ppChildrenKeys = [];
            pp.children &&
              ((ppChildrenKeys = Object.keys(pp.children)) &&
                ppChildrenKeys.length) &&
              ppChildrenKeys.forEach(pppKey => {
                let ppp = pp.children[pppKey];
                // ppp.checked = checkFalse;
                this.judgeAndCheck(priorityData, ppp, checkFalse);
                // this.changeAllProp(ppp, 0);
              });
          });
        // 循环父级勾选判定
        let parentChildrenKeys = [];
        if (
          parent &&
          (parentChildrenKeys = Object.keys(parent.children || {})) &&
          parentChildrenKeys.length &&
          parentChildrenKeys.every(
            pChildrenKey => !parent.children[pChildrenKey].checked
          )
        ) {
          this.cascadeChangeP(priorityData, parent, checkFalse);
        }
      }
      return priorityData;
    },
    // 权限的"所有" "仅自己选项暂时别去除, 暂时勿删
    // changePPPP(ppp, all) {
    //   let priorityData = simpleClone(this.priorityData);
    //   let { parentKey, key } = ppp;
    //   let parent = this.getParent(priorityData, parentKey);
    //   let fundPPP = parent.children[key];
    //   fundPPP.all = all;
    //   fundPPP.checked = true;
    //   this.priorityData = priorityData;
    // }
    codeToArr(key) {
      try {
        return (key || '').split(':').filter(item => !!item);
      } catch (e) {
        console.warn('processParantId_error:', e);
      }
    },
    // 格式化权限数据
    formatPriorityData(ps, selectedPriorityCodes = []) {
      ps = this.transformAllPriorityDataToObject(ps);
      this.processSelectedPriorityData(ps, selectedPriorityCodes);
      return ps;
    },
    /**
     * 单层Array转Object
     * @param arr {Array} 数组
     * @param key {String} 转换键值
     * @return {Object}
     */
    simpleArrToObjectBy(arr, key) {
      let ret = {};
      arr.forEach(vo => {
        if (vo[key]) {
          ret[vo[key]] = vo;
        }
      });
      return ret;
    },
    transformAllPriorityDataToObject(ps) {
      let KEY = 'key';
      ps.forEach(p => {
        let newPChildren = {};
        p.children &&
          p.children.length &&
          p.children.forEach(pp => {
            let newPPChildren = {};
            newPChildren[pp.key] = { ...p, ...newPPChildren };

            pp.children &&
              pp.children.length &&
              pp.children.forEach(ppp => {
                ppp.children = {};
              });
            pp.children = this.simpleArrToObjectBy(pp.children, KEY);
          });
        p.children = this.simpleArrToObjectBy(p.children, KEY);
      });
      ps = this.simpleArrToObjectBy(ps, KEY);

      return ps;
    },
    // 处理已选择的权限
    processSelectedPriorityData(ps, selectedPriorityCodes) {
      // 迭代parentKey '1:11:121' -> ['1', '11', '121']
      Object.keys(ps).forEach(pKey => {
        let p = ps[pKey];
        p.parentKey = this.codeToArr(p.parentKey);
        let pChildrenKeys = [];
        p.children &&
          (pChildrenKeys = Object.keys(p.children)) &&
          pChildrenKeys.length &&
          pChildrenKeys.forEach(ppKey => {
            let pp = p.children[ppKey];
            pp.parentKey = this.codeToArr(pp.parentKey);
            let ppChildrenKeys = [];
            pp.children &&
              (ppChildrenKeys = Object.keys(pp.children)) &&
              ppChildrenKeys.length &&
              ppChildrenKeys.forEach(pppKey => {
                let ppp = pp.children[pppKey];
                ppp.parentKey = this.codeToArr(ppp.parentKey);
              });
          });
      });

      // 循环勾选已选择权限
      let selectedPriorityIdArr = selectedPriorityCodes.map(pid => {
        return this.codeToArr(pid);
      });
      selectedPriorityIdArr.forEach(([pKey, ppKey, pppKey]) => {
        let key, parentKey;
        if (pKey) {
          key = pKey;
          parentKey = '';
        }
        if (ppKey) {
          key = ppKey;
          parentKey = [pKey];
        }
        if (pppKey) {
          key = pppKey;
          parentKey = [pKey, ppKey];
        }
        this.cascadeChangeP(ps, { key, parentKey, children: {} }, true);
      });

      return ps;
    },
    async getData() {
      this.showLoading = true;
      let { state, data } = await getAllPriorities();
      if (state) {
        this.showLoading = false;
        this.priorityData = this.formatPriorityData(
          data,
          this.selectedPriorityCodes
        );
      }
    }
  }
};
</script>
<style lang="less">
.priority-select-container {
}
</style>
<i18n>
{
  "en": {
    "cancel": "取消",
    "confirm_submit": "确认提交",
    "all": "所有",
    "own": "仅自己",
    "select_priority": "请选择权限"
  },
  "zh-CN": {
    "cancel": "取消",
    "confirm_submit": "确认提交",
    "all": "所有",
    "own": "仅自己",
    "select_priority": "请选择权限"
  }
}
</i18n>
