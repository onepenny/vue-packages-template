<template>
  <div>
    <div class="Modal-layout" v-if="type === 'checkbox'">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col
          :key="index"
          v-for="(items, index) in dataList"
          :span="span"
          style="text-align: center"
        >
          <CheckboxGroup v-model="selectedIDs" @on-change="handleGroupSelect">
            <div
              v-if="isColor"
              class="modal-con"
              :style="{ width: width + 'rem' }"
              @click="selectItem(items)"
            >
              <button
                :style="{
                  width: width + 'rem',
                  height: height + 'rem',
                  backgroundColor: items.rgb
                }"
              ></button>
              <p>
                <Checkbox :label="items.id">{{ items.code }}</Checkbox>
              </p>
            </div>
            <div
              v-else
              class="modal-con"
              :style="{ width: width + 'rem' }"
              @click="selectItem(items)"
            >
              <img
                :src="items.thumbPath || items.thumb"
                @click="editItem(items)"
                :style="{ width: width + 'rem', height: height + 'rem' }"
              />
              <Icon
                class="del-icon"
                type="ios-close"
                v-if="items.is_system"
                v-show="showDelete && items.is_owner && !items.is_system"
                @click="toDelete(items)"
                size="16"
              >
              </Icon>
              <Icon
                class="del-icon"
                v-else
                type="ios-close"
                v-show="showDelete && items.is_owner"
                @click="toDelete(items)"
                size="16"
              >
              </Icon>
              <p>
                <Checkbox :label="items.id"
                  ><Tooltip
                    placement="bottom-start"
                    :content="showNumber ? items.number : items.name"
                    >{{ showNumber ? items.number : items.name }}</Tooltip
                  ></Checkbox
                >
              </p>
            </div>
          </CheckboxGroup>
        </Col>
      </Row>
      <div class="select-all" v-show="!hideSelect">
        <Checkbox
          v-model="checkAllState"
          @on-change="toSelectAll"
          v-show="!isExclude"
          >{{ $t('global_check_all') }}</Checkbox
        >
      </div>
    </div>

    <div class="Modal-layout" v-if="type === 'radio'">
      <Row type="flex" justify="start" class="code-row-bg">
        <Col
          :key="index"
          v-for="(items, index) in dataList"
          :span="span"
          style="text-align: center"
        >
          <RadioGroup v-model="selectedID">
            <div
              class="modal-con"
              :style="{ width: width + 'rem' }"
              @click="selectItem(items)"
            >
              <img
                v-if="!items.adType"
                :src="items.thumbPath || items.thumb"
                :style="{ width: width + 'rem', height: height + 'rem' }"
              />
              <Icon
                class="del-icon"
                type="ios-close"
                v-show="showDelete && items.is_owner"
                @click="toDelete(items)"
                size="16"
              >
              </Icon>
              <video
                v-if="items.adType"
                :src="items.thumbPath || items.thumb"
                controls="controls"
                :style="{ width: width + 'rem', height: height + 'rem' }"
              >
                您的浏览器不支持 video 标签。
              </video>
              <p>
                <Radio :label="items.id" class="modal-item-radio"
                  ><Tooltip
                    placement="bottom-start"
                    :content="showNumber ? items.number : items.name"
                    >{{ showNumber ? items.number : items.name }}</Tooltip
                  ></Radio
                >
              </p>
            </div>
          </RadioGroup>
        </Col>
      </Row>
    </div>

    <slot> </slot>
    <br />
    <Page
      v-if="dataTotal > 0 && !hidePage"
      :total="dataTotal"
      :page-size="pageSize"
      size="small"
      style="text-align: center; width: 100%;"
      @on-change="toChangePage"
    >
    </Page>
    <div v-else-if="dataTotal === 0">
      <NoData :desc="$t('global_no_data')"> </NoData>
    </div>
  </div>
</template>

<script>
import NoData from './noData';

export default {
  name: 'ModalItem',
  props: [
    'type',
    'span',
    'dataList',
    'dataId',
    'dataType',
    'width',
    'height',
    'dataTotal',
    'pageSize',
    'showNumber',
    'hidePage',
    'hideSelect',
    'showDelete',
    'isColor',
    'isExclude',
    'excludeId'
  ],
  components: {
    NoData
  },
  data() {
    return {
      excludedIDs: [],
      excludedItems: [],
      selectedIDs: [],
      selectedID: '',
      selectedItems: {},
      selectedItem: {},
      lastDataType: null,
      selectedIDsMap: {}
    };
  },
  mounted: function() {
    this.resetSelected();
  },
  watch: {
    selectedID: function(val) {
      this.$emit('radioSelectChange', val === '');
    }
  },
  computed: {
    checkAllState: {
      get() {
        let midArr = this.dataList.map(data => {
          return data.id;
        });
        return this.isContained(this.selectedIDs, midArr);
      },
      set: function() {}
    }
  },
  methods: {
    selectItem(item) {
      switch (this.type) {
        case 'checkbox':
          if (this.selectedIDs.indexOf(item.id) < 0) {
            if (typeof this.dataId === 'object') {
              if (!this.lastDataType && item.categories) {
                item.categories.forEach(category => {
                  if (!this.selectedIDsMap[category[1]]) {
                    this.selectedIDsMap[category[1]] = [item.id];
                  } else {
                    let pos = this.selectedIDsMap[category[1]].indexOf(item.id);
                    if (pos < 0) {
                      this.selectedIDsMap[category[1]].push(item.id);
                    }
                  }
                });
              }
            } else {
              // ignore
            }
            this.selectedItems[item.id] = item;
          } else {
            if (typeof this.dataId === 'object') {
              if (!this.lastDataType && item.categories) {
                item.categories.forEach(category => {
                  if (!this.selectedIDsMap[category[1]]) {
                    // ignore
                  } else {
                    let pos = this.selectedIDsMap[category[1]].indexOf(item.id);
                    if (pos >= 0) {
                      this.selectedIDsMap[category[1]].splice(pos, 1);
                    }
                  }
                });
              }
            } else {
              // ignore
            }

            if (typeof this.dataId === 'object') {
              // ignore
            } else {
              delete this.selectedItems[item.id];
            }
          }
          break;
        case 'radio':
          this.selectedItem = item;
          break;
      }
    },
    toChangePage(index) {
      if (this.isExclude) {
        this.excludeItems();
        this.$emit('page', index, 'usage');
      } else {
        this.$emit('page', index);
      }
    },
    clearSelected() {
      switch (this.type) {
        case 'checkbox':
          if (this.dataId) {
            if (typeof this.dataId === 'object') {
              this.selectedIDsMap = {};
              for (let type in this.dataId) {
                this.selectedIDsMap[type] = this.dataId[type]
                  ? this.dataId[type].split(',').map(id => {
                      return parseInt(id);
                    })
                  : [];
              }

              if (this.dataType) {
                this.selectedIDs = this.selectedIDsMap[this.dataType];
                this.selectedIDs = this.selectedIDs ? this.selectedIDs : [];
              } else {
                this.selectedIDs = [];
                for (let type in this.selectedIDsMap) {
                  this.selectedIDsMap[type].forEach(id => {
                    if (this.selectedIDs.indexOf(id) < 0) {
                      this.selectedIDs.push(id);
                    }
                  });
                }
              }

              this.lastDataType = this.dataType;
            } else {
              this.selectedIDs = this.dataId.split(',').map(id => {
                return parseInt(id);
              });
            }
          } else if (this.isExclude) {
            this.selectedIDs = [];
            let curArr = this.dataList.filter(item => {
              return this.excludeId.split(',').indexOf(String(item.id)) < 0;
            });
            for (var i in curArr) {
              this.selectItem(curArr[i]);
            }
            this.excludedIDs =
              this.excludeId == ''
                ? []
                : this.excludeId.split(',').map(item => {
                    return parseInt(item);
                  });
            this.selectedIDs = this.dataList
              .filter(item => {
                return this.excludeId.split(',').indexOf(String(item.id)) < 0;
              })
              .map(item => {
                return item.id;
              });
          } else {
            this.selectedIDs = [];
          }

          break;
        case 'radio':
          if (this.dataId !== '0' && this.dataId) {
            this.selectedID = parseInt(this.dataId);
          } else {
            this.selectedID = '';
          }
          break;
      }
    },
    resetSelected() {
      switch (this.type) {
        case 'checkbox':
          if (this.selectedIDs.length === 0) {
            if (this.dataId) {
              if (typeof this.dataId === 'object') {
                this.selectedIDsMap = {};
                for (let type in this.dataId) {
                  this.selectedIDsMap[type] = this.dataId[type]
                    ? this.dataId[type].split(',').map(id => {
                        return parseInt(id);
                      })
                    : [];
                }

                if (this.dataType) {
                  this.selectedIDs = this.selectedIDsMap[this.dataType];
                  this.selectedIDs = this.selectedIDs ? this.selectedIDs : [];
                } else {
                  this.selectedIDs = [];
                  for (let type in this.selectedIDsMap) {
                    this.selectedIDsMap[type].forEach(id => {
                      if (this.selectedIDs.indexOf(id) < 0) {
                        this.selectedIDs.push(id);
                      }
                    });
                  }
                }

                this.lastDataType = this.dataType;
              } else {
                this.selectedIDs = this.dataId.split(',').map(id => {
                  return parseInt(id);
                });
              }
            } else if (this.isExclude) {
              this.selectedIDs = [];
              let curArr = this.dataList.filter(item => {
                return this.excludeId.split(',').indexOf(String(item.id)) < 0;
              });
              for (var i in curArr) {
                this.selectItem(curArr[i]);
              }
              this.excludedIDs =
                this.excludeId == ''
                  ? []
                  : this.excludeId.split(',').map(item => {
                      return parseInt(item);
                    });
              this.selectedIDs = this.dataList
                .filter(item => {
                  return this.excludeId.split(',').indexOf(String(item.id)) < 0;
                })
                .map(item => {
                  return item.id;
                });
            } else {
              this.selectedIDs = [];
            }
          } else {
            if (this.isExclude) {
              let curArr = this.dataList.filter(item => {
                return this.excludedIDs.indexOf(item.id) < 0;
              });

              for (let i in curArr) {
                if (this.selectedIDs.indexOf(curArr[i].id) < 0) {
                  this.selectItem(curArr[i]);
                  this.selectedIDs.push(curArr[i].id);
                }
              }

              this.selectedIDs = this.selectedIDs.slice();
            } else {
              if (typeof this.dataId === 'object') {
                if (this.dataType != this.lastDataType) {
                  if (this.lastDataType) {
                    this.selectedIDsMap[this.lastDataType] = this.selectedIDs;
                  }

                  if (this.dataType) {
                    this.selectedIDs = this.selectedIDsMap[this.dataType];
                    this.selectedIDs = this.selectedIDs ? this.selectedIDs : [];
                  } else {
                    this.selectedIDs = [];
                    for (let type in this.selectedIDsMap) {
                      this.selectedIDsMap[type].forEach(id => {
                        if (this.selectedIDs.indexOf(id) < 0) {
                          this.selectedIDs.push(id);
                        }
                      });
                    }
                  }

                  this.lastDataType = this.dataType;
                } else {
                  this.selectedIDs = this.selectedIDs.slice();
                }
              } else {
                this.selectedIDs = this.selectedIDs.slice();
              }
            }
          }
          break;
        case 'radio':
          if (this.selectedID === '') {
            if (this.dataId !== '0' && this.dataId) {
              this.selectedID = parseInt(this.dataId);
            } else {
              this.selectedID = '';
            }
          } else {
            let tmp = this.selectedID;
            this.selectedID = '';
            setTimeout(() => {
              this.selectedID = tmp;
            }, 0);
          }
          break;
      }
    },
    confirmSelected() {
      switch (this.type) {
        case 'checkbox':
          if (this.isExclude) {
            this.excludeItems();
          }

          if (typeof this.dataId === 'object') {
            if (this.lastDataType) {
              this.selectedIDsMap[this.lastDataType] = this.selectedIDs;
            }
          }

          this.$emit('confirm', {
            ids: this.isExclude
              ? this.excludedIDs.toString()
              : this.selectedIDs.toString(),
            items: this.isExclude ? this.excludedItems : this.selectedItems,
            idMaps: this.selectedIDsMap
          });
          break;
        case 'radio':
          this.$emit('confirm', {
            id: this.selectedID.toString(),
            items: this.selectedItem
          });
          break;
      }
    },
    handleGroupSelect() {
      if (typeof this.dataId === 'object') {
        if (this.lastDataType) {
          this.selectedIDsMap[this.lastDataType] = this.selectedIDs;
        }
      }

      this.$emit('groupselect', {
        ids: this.selectedIDs.toString(),
        items: this.selectedItems,
        idMaps: this.selectedIDsMap
      });
    },
    isContained(a, b) {
      if (!(a instanceof Array) || !(b instanceof Array)) return false;
      if (a.length < b.length) return false;
      // let aStr = a.toString();
      for (let i = 0, len = b.length; i < len; i++) {
        if (a.indexOf(b[i]) === -1) return false;
      }
      return true;
    },
    toSelectAll(state) {
      if (state) {
        this.dataList.forEach(data => {
          let index = this.selectedIDs.indexOf(data.id);
          if (index < 0) {
            this.selectedIDs.push(data.id);

            if (typeof this.dataId === 'object') {
              // 原来代码存在问题
              // if (!this.lastDataType && item.categories) {
              //   item.categories.forEach(category => {
              //     if (!this.selectedIDsMap[category[1]]) {
              //       this.selectedIDsMap[category[1]] = [data.id];
              //     } else {
              //       let pos = this.selectedIDsMap[category[1]].indexOf(data.id);
              //       if (pos < 0) {
              //         this.selectedIDsMap[category[1]].push(data.id);
              //       }
              //     }
              //   });
              // }
            } else {
              // ignore
            }
          }
          this.selectedItems[data.id] = data;
        });
      } else {
        this.dataList.forEach(data => {
          let flag = this.selectedIDs.indexOf(data.id);
          if (flag > -1) {
            this.selectedIDs.splice(flag, 1);

            if (typeof this.dataId === 'object') {
              // 原代码存在问题
              // if (!this.lastDataType && item.categories) {
              //   item.categories.forEach(category => {
              //     if (!this.selectedIDsMap[category[1]]) {
              //       // ignore
              //     } else {
              //       let pos = this.selectedIDsMap[category[1]].indexOf(data.id);
              //       if (pos >= 0) {
              //         this.selectedIDsMap[category[1]].splice(pos, 1);
              //       }
              //     }
              //   });
              // }
            } else {
              // ignore
            }
          }
          if (typeof this.dataId === 'object') {
            // ignore
          } else {
            delete this.selectedItems[data.id];
          }
        });
      }
    },
    toDelete(items) {
      this.$emit('deleted', items);
    },
    editItem(item) {
      this.$emit('edit', item);
    },
    excludeItems() {
      //记录之前反选的项
      for (let i in this.dataList) {
        let pos = this.excludedIDs.indexOf(this.dataList[i].id);
        if (this.selectedIDs.indexOf(this.dataList[i].id) < 0) {
          if (pos < 0) {
            this.excludedIDs.push(this.dataList[i].id);
            this.excludedItems[this.dataList[i].id] = this.dataList[i];
          }
        } else {
          if (pos >= 0) {
            this.excludedIDs.splice(pos, 1);
            delete this.excludedItems[this.dataList[i].id];
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.modal-item-radio {
  position: inherit;
}
</style>

<style lang="less">
.Modal-layout {
  background: #ffffff;
  p {
    font-size: 0.6rem;
    max-font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0.5rem 0 1.5rem 0;
  }
  video {
    cursor: pointer;
  }
  video:hover {
    box-shadow: 0 0 10px #d3d4d6;
  }
  img {
    cursor: pointer;
  }
  img:hover {
    box-shadow: 0 0 10px #d3d4d6;
  }

  .ivu-radio-group {
    width: 100%;
  }
  .select-all {
    font-size: 18px;
    color: #262626;
    padding-top: 5px;
  }
  .modal-con {
    position: relative;
    margin: 0 auto;
    &:hover {
      .del-icon {
        display: block;
      }
    }
    .del-icon {
      display: none;
      cursor: pointer;
      color: #727272;
      position: absolute;
      top: 2px;
      right: 2px;
    }
  }
}
</style>
