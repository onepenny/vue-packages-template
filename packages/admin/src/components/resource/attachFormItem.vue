<template>
  <div>
    <FormItem
      :label="$t('home_form_number') + '：'"
      prop="linkedStyles"
      style="width: 100%"
    >
      <com-display-item
        :data-list="formInline.linkedStyles"
        :show-delete="aeStatus || !is_backup"
        v-on:deleted="toDeleteAttachStyle"
      ></com-display-item>
      <Button
        class="large-add"
        @click="toGetStyles(linkedStyleConfig.page)"
        v-show="aeStatus || !is_backup"
      >
        <Icon size="50" type="ios-add" />
      </Button>
    </FormItem>

    <Modal
      width="70%"
      v-model="showFabricStyle"
      :title="$t('global_choose_style')"
    >
      <Form
        :label-width="60"
        onsubmit="return false;"
        class="modal-form"
        inline
      >
        <FormItem :label="$t('global_search') + '：'">
          <Input
            v-model="linkedStyleConfig.keywords"
            :placeholder="$t('global_to_search')"
            size="small"
            style="width:150px"
            @on-enter="toGetStyles(defaultPage)"
          />
        </FormItem>
        <FormItem :label="$t('global_category') + '：'">
          <Cascader
            @on-change="toGetStyleTypes"
            :data="dataStyleTypes"
            :placeholder="$t('global_select')"
          ></Cascader>
        </FormItem>
      </Form>

      <com-modal-item
        ref="styleModal"
        :type="'checkbox'"
        :span="4"
        :data-list="dataGetStyles"
        :data-id="formInline.linked_style_ids"
        :width="5"
        :height="7.5"
        :data-total="linkedStyleConfig.total"
        :page-size="linkedStyleConfig.perPage"
        v-on:page="toGetStyles"
        v-on:confirm="toHandleFabricStyleModal"
      >
        <Spin size="large" fix v-if="showStylesLoading"></Spin>
      </com-modal-item>
      <div slot="footer" class="center-button">
        <Button
          type="primary"
          @click="
            showFabricStyle = false;
            $refs.styleModal.confirmSelected();
          "
          >{{ $t('global_confirm') }}</Button
        >
        <Button
          @click="
            showFabricStyle = false;
            $refs.styleModal.resetSelected();
          "
          >{{ $t('global_cancel') }}</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import { getProductList } from '@/service/resource/other';

export default {
  props: ['formInline', 'aeStatus', 'is_backup'],
  data() {
    return {
      linkedStyleConfig: {
        gender: '0',
        category: '0',
        keywords: '',
        perPage: 12,
        total: 15,
        page: 1
      },
      showFabricStyle: false, //TODO
      dataStyleTypes: [], //TODO
      dataGetStyles: [],
      showStylesLoading: false
    };
  },
  methods: {
    async toGetStyles(curPage) {
      let isFirstOpen = !this.showFabricStyle;
      this.linkedStyleConfig.page = curPage;
      this.showFabricStyle = true;
      this.showStylesLoading = true;
      let ret = await getProductList({
        ...this.linkedStyleConfig
      });
      this.dataGetStyles = ret.products['data'];
      this.linkedStyleConfig.total = ret.products['total'];
      this.showStylesLoading = false;
      setTimeout(() => {
        if (isFirstOpen) {
          this.$refs.styleModal.clearSelected();
        } else {
          this.$refs.styleModal.resetSelected();
        }
      }, 0);
    },
    // 获取关联款式列表
    toGetStyleTypes(style) {
      this.linkedStyleConfig.gender = style[0] || 0;
      this.linkedStyleConfig.category = style[1] || 0;
      this.toGetStyles(this.defaultPage);
    },
    // 删除关联款式
    toDeleteAttachStyle(style) {
      let index = this.formInline.linkedStyles.indexOf(style);
      if (index >= 0) {
        this.formInline.linkedStyles.splice(index, 1);
      }

      let idArr = this.formInline.linked_style_ids
        .split(',')
        .map(id => parseInt(id))
        .filter(id => id != style.id);

      this.formInline.linked_style_ids = idArr.join(',');
    },
    toHandleFabricStyleModal(newStyles) {
      this.formInline.linked_style_ids = newStyles.ids;

      if (this.formInline.linked_style_ids !== '') {
        this.formInline.linkedStyles.forEach(style => {
          newStyles.items[style.id] = style;
        });

        let idArr = this.formInline.linked_style_ids
          .split(',')
          .map(id => parseInt(id))
          .filter(id => newStyles.items[id]);

        this.formInline.linked_style_ids = idArr.join(',');
        this.formInline.linkedStyles = idArr.map(id => newStyles.items[id]);
      } else {
        this.formInline.linkedStyles = [];
      }
    }
  }
};
</script>
