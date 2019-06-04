<template>
  <div>
    <span v-for="(field, idx) in fields.items || fields" :key="idx">
      <com-search-bar
        v-if="idx == 0 && fields.items"
        style="border-bottom: 1px solid #d4d3d8; height: 0px; margin-bottom: 20px;"
      />
      <span v-if="field && field.key">
        <br
          v-if="field.dataType === 'checkbox' || field.dataType === 'textarea'"
        />
        <FormItem
          :label="field.name + '：'"
          :prop="field.key"
          :rules="{
            required: field['required'],
            message: $t('global_field_tip', { field: field.name })
          }"
          :key="idx"
        >
          <Input
            v-if="field.dataType === 'number' || field.dataType === 'text'"
            style="width: 150px"
            v-model="formInline[`${field.key}`]"
          >
            <span slot="append" v-if="field.unit">
              {{ field.unit }}
            </span>
          </Input>

          <!-- 供应商 -->
          <span v-else-if="field.dataType === 'supplier'">
            <span v-if="field.disabled">
              <Input
                v-model="formInline.supplierName"
                :disabled="true"
                style="width: 150px"
                :placeholder="$t('accessory_placeholder_supplier')"
              />
            </span>
            <span v-else>
              <span v-if="!isSelectSupplier">
                <Input
                  v-model="formInline.supplierName"
                  style="width: 100px"
                  :placeholder="$t('accessory_placeholder_supplier')"
                />
                <p>
                  <Input
                    v-model="formInline.contractor"
                    style="width: 100px"
                    :placeholder="$t('global_supplier_placeholder_contractor')"
                  />
                </p>
                <p>
                  <Input
                    v-model="formInline.tel"
                    style="width: 100px"
                    :placeholder="$t('global_supplier_placeholder_tel')"
                  />
                </p>
                <Input
                  v-model="formInline.address"
                  style="width: 100px"
                  :placeholder="$t('global_supplier_placeholder_address')"
                />
              </span>
              <Select
                v-else
                style="width: 99px"
                v-model="formInline[`${field.key}`]"
                filterable
                :placeholder="$t('global_select')"
              >
                <!-- TODO：此处以后迭代选项数据源统一为 field['initial'] -->
                <Option
                  v-for="item in dataCreateInfo.suppliers"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
              <Button type="primary" size="small" @click="toChangeAddType">
                {{ isSelectSupplier ? $t('global_add') : $t('global_choose') }}
              </Button>
            </span>
          </span>

          <!-- 位置分类，该组件存在问题，待替换 -->
          <cascaderMulti
            v-else-if="field.dataType == 'cascaderMulti'"
            v-model="formInline[`${field.key}`]"
            :placeholder="$t('global_select')"
            :data="field.initial"
          ></cascaderMulti>

          <!-- 辅料分类 -->
          <Cascader
            v-else-if="field.dataType == 'cascader'"
            v-model="formInline[`${field.key}`]"
            :placeholder="$t('global_select')"
            :data="field.initial"
          ></Cascader>

          <!-- 分类 -->
          <Cascader
            v-else-if="field.dataType == 'commonCascader'"
            v-model="formInline[`${field.key}`]"
            :placeholder="$t('global_select')"
            :data="field.initial"
          ></Cascader>

          <InputNumber
            v-else-if="field.dataType === 'integer'"
            :min="0"
            style="width: 150px"
            v-model="formInline[`${field.key}`]"
          />

          <span v-else-if="field.dataType === 'list'">
            <span v-if="!formInline['isSelect' + ucfirst(field.key)]">
              <Input
                v-model="formInline[`${field.key}String`]"
                style="width: 99px"
              />
            </span>
            <Select
              v-else
              style="width: 99px"
              v-model="formInline[`${field.key}`]"
            >
              <Option
                v-for="item in field.initial"
                :value="item.cid"
                :key="item.cid"
                >{{ item.displayName }}</Option
              >
            </Select>
            <Button
              type="primary"
              size="small"
              @click="
                toChangeSelectType(field, 'isSelect' + ucfirst(field.key))
              "
            >
              {{
                formInline['isSelect' + ucfirst(field.key)]
                  ? $t('global_add')
                  : $t('global_choose')
              }}
            </Button>
          </span>

          <RadioGroup
            v-model="formInline[`${field.key}`]"
            v-else-if="field.dataType === 'radio'"
          >
            <Radio
              v-for="item in field.initial"
              :label="item.cid"
              :key="item.cid"
              >{{ item.displayName }}</Radio
            >
          </RadioGroup>

          <CheckboxGroup
            v-else-if="field.dataType === 'checkbox'"
            class="checkbox-con"
            v-model="formInline[`${field.key}`]"
          >
            <Checkbox
              v-for="item in field['initial']"
              :label="item.cid"
              :key="item.cid"
              >{{ item.displayName }}</Checkbox
            >
          </CheckboxGroup>

          <PTColorPick
            style="width: 150px"
            v-else-if="field.dataType === 'pantone'"
            ref="PTColorNo"
            v-on:selectconfirm="
              val => {
                formInline[`${field.key}`] = val;
              }
            "
          ></PTColorPick>

          <DatePicker
            v-else-if="field.dataType === 'datetime'"
            v-model="formInline[`${field.key}`]"
            type="date"
            format="yyyy-MM-dd"
            style="width: 150px"
            placement="bottom"
          ></DatePicker>

          <span v-else-if="field.dataType === 'percent_main_component'">
            <p
              v-for="(component, index) in formInline[`${field.key}`]"
              :key="index"
            >
              <InputNumber
                style="width: 50px"
                :min="0"
                v-model="component.percent"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              ></InputNumber>
              <Input
                v-if="component.componentString"
                :disabled="true"
                v-model="component.componentString"
                style="width: 100px"
              />
              <Select v-else style="width: 100px" v-model="component.component">
                <Option
                  v-for="item in field['initial']"
                  :value="item.cid"
                  :key="item.cid"
                  >{{ item.displayName }}</Option
                >
              </Select>
            </p>
            <p>
              <Button
                style="color: #F26D60"
                v-show="formInline[`${field.key}`].length > 1"
                size="small"
                @click="toDeleteComponent(field)"
                >{{ $t('global_delete') }}</Button
              >
              <Button
                type="primary"
                size="small"
                @click="toAddComponent(field)"
              >
                <Icon type="plus-round"></Icon>
                {{ $t('global_add') }}
              </Button>
            </p>
          </span>

          <Input
            v-else-if="field.dataType === 'textarea'"
            style="width: 500px"
            type="textarea"
            v-model="formInline[`${field.key}`]"
          />
        </FormItem>

        <br
          v-if="
            field.dataType === 'checkbox' ||
              field.dataType === 'textarea' ||
              field.newline
          "
        />
      </span>
    </span>
  </div>
</template>

<script>
import { ucfirst } from '@/config/utils';

export default {
  name: 'baseFormItem',
  props: [
    'fields',
    'formInline',
    'dataCreateInfo',
    'isSelectSupplier',
    'toChangeAddType'
  ],
  data() {
    return {
      ucfirst
    };
  },
  methods: {
    toChangeSelectType(field, flag) {
      this.formInline[flag] = !this.formInline[flag];
      if (!this.formInline[flag]) {
        if (!this.formInline[field.key + 'String']) {
          let lastSelect = this.formInline[field.key];
          for (let item of field['initial']) {
            if (item.cid == lastSelect) {
              this.formInline[field.key + 'String'] = item.displayName;
              break;
            }
          }
        }
      }
    },
    toDeleteComponent: function(field) {
      if (this.formInline[`${field.key}`].length > 1) {
        this.formInline[`${field.key}`].splice(
          this.formInline[`${field.key}`].length - 1,
          1
        );
      }
    },
    toAddComponent: function(field) {
      let item = { percent: 0, component: null };
      this.formInline[`${field.key}`].push(item);
    }
  }
};
</script>
