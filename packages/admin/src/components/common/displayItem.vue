<template>
  <div class="display-layout">
    <draggable v-model="data" v-if="isDraggable">
      <transition-group>
        <div
          class="item-container"
          v-for="(items, index) in dataList"
          :key="index + 1"
          :style="{ width: width ? width : '100px' }"
        >
          <div
            v-if="isColor"
            class="container"
            :style="{
              width: width ? width : '100px',
              height: height ? height : '100px',
              backgroundColor: items.rgb
            }"
          >
            <Icon
              class="del-icon"
              type="ios-close"
              v-if="showDelete"
              @click="toDelete(items)"
              size="16"
            >
            </Icon>
          </div>
          <div
            v-else
            class="container"
            :style="{
              width: width ? width : '100px',
              height: height ? height : '100px'
            }"
          >
            <img :src="items.thumbPath || items.thumb || items.image_path" />
            <Icon
              class="del-icon"
              type="ios-close"
              v-if="showDelete"
              @click="toDelete(items)"
              size="16"
            >
            </Icon>
          </div>
          <p v-if="showBox">
            <CheckboxGroup v-model="selectedId" @on-change="toSelect">
              <Checkbox :label="items.id">{{
                showNumber ? items.number : items.name
              }}</Checkbox>
            </CheckboxGroup>
          </p>
          <p v-else>
            {{ showNumber ? items.number : items.name }}
            <br />
            <span v-if="showPrice">¥ {{ items.price }}</span>
            <InputNumber
              :style="{ width: width }"
              style="margin-top: 5px;"
              size="small"
              :value="items.quantity"
              :min="minNumber"
              v-show="showInput"
              @on-change="toEditNumber($event, items)"
            ></InputNumber>
          </p>
        </div>
      </transition-group>
    </draggable>
    <template v-else>
      <div
        class="item-container"
        v-for="(items, index) in dataList"
        :key="index + 1"
        :style="{ width: width ? width : '100px' }"
      >
        <div
          v-if="isColor"
          class="container"
          :style="{
            width: width ? width : '100px',
            height: height ? height : '100px',
            backgroundColor: items.rgb
          }"
        >
          <Icon
            class="del-icon"
            type="ios-close"
            v-if="showDelete"
            @click="toDelete(items)"
            size="16"
          >
          </Icon>
        </div>
        <div
          v-else
          class="container"
          :style="{
            width: width ? width : '100px',
            height: height ? height : '100px'
          }"
        >
          <img :src="items.thumbPath || items.thumb || items.image_path" />
          <Icon
            class="del-icon"
            type="ios-close"
            v-if="showDelete"
            @click="toDelete(items)"
            size="16"
          >
          </Icon>
        </div>
        <p v-if="showBox">
          <CheckboxGroup v-model="selectedId" @on-change="toSelect">
            <Checkbox :label="items.id">{{
              showNumber ? items.number : items.name
            }}</Checkbox>
          </CheckboxGroup>
        </p>
        <p v-else>
          {{ showNumber ? items.number : items.name }}
          <br />
          <span v-if="showPrice">¥ {{ items.price }}</span>
          <InputNumber
            :style="{ width: width }"
            style="margin-top: 5px;"
            size="small"
            :value="items.quantity"
            :min="minNumber"
            v-show="showInput"
            @on-change="toEditNumber($event, items)"
          ></InputNumber>
        </p>
      </div>
    </template>
    <slot> </slot>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'displayItem',
  props: [
    'dataList',
    'width',
    'height',
    'showBox',
    'showDelete',
    'showNumber',
    'showInput',
    'isColor',
    'showPrice',
    'index',
    'isDraggable'
  ],
  components: {
    draggable
  },
  data() {
    return {
      selectedId: [],
      minNumber: 1,
      data: []
    };
  },
  created: function() {},
  watch: {
    data(val) {
      this.$emit('update:dataList', val);
    },
    dataList(val) {
      this.data = val;
    }
  },
  methods: {
    toSelect: function() {
      this.$emit('selected', this.selectedId);
    },
    filterSelectedIds: function(availableIds) {
      this.selectedId = this.selectedId.filter(id => {
        for (let availableId of availableIds) {
          if (id === availableId) {
            return true;
          }
        }
        return false;
      });
      this.$emit('selected', this.selectedId);
    },
    updateSelectedIds: function(selectedId) {
      this.selectedId = selectedId;
      this.$emit('selected', this.selectedId);
    },
    toDelete: function(items) {
      if (this.index != undefined) {
        this.$emit('deleted', { items: items, index: this.index });
      } else {
        this.$emit('deleted', items);
      }
    },
    toEditNumber: function(val, data) {
      data.quantity = val;
    }
  }
};
</script>

<style lang="less">
.display-layout {
  background: #ffffff;
  .item-container {
    width: 100px;
    height: auto;
    float: left;
    margin-right: 5px;
    .container {
      width: 100px;
      height: 100px;
      border: 1px solid #e9eaec;
      position: relative;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      &:hover {
        .del-icon {
          display: block;
        }
      }
      .del-icon {
        position: relative;
        float: right;
        display: none;
        margin-right: 0.2rem;
        margin-top: 0.2rem;
        cursor: pointer;
        color: #727272;
      }
    }
    .container:hover {
      box-shadow: 0 0 10px #d3d4d6;
    }
    p {
      font-size: 12px;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.85);
      overflow: hidden;
      white-space: nowrap;
      //white-space: normal;
      text-overflow: ellipsis;
      padding: 5px 0 20px 0;
      //text-align: center;
      text-align: left;
      line-height: 14px;
    }
  }
}
</style>
