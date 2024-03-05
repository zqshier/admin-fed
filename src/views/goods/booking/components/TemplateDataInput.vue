<template>
  <div class="template-data-wrap">
    <div class="temp" v-if="template">{{ template.example }}</div>
    <div class="item-list">
      <a-form :label-col="{ style: 'width:120px' }">
        <a-form-item :label="`${item.name}{${item.key}}`" v-for="item in tmpList" :key="item.key">
          <div class="item-inp-wrap">
            <div class="type-select">
              <a-select
                v-model:value="item.valueType"
                :options="valueTypeList"
                @change="valueChange"
              />
            </div>
            <div class="inp" v-if="item.valueType === '自定义'">
              <a-input
                v-model:value="item.value"
                placeholder="请输入自定义内容"
                showCount
                :maxlength="20"
                @change="valueChange"
              />
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { TemplateOptionsModel } from '../data';

  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Select as ASelect,
  } from 'ant-design-vue';

  const props = defineProps<{
    value?: string[][];
    template?: TemplateOptionsModel;
    valueTypes?: string[];
  }>();

  const emit = defineEmits(['update:value', 'change']);

  interface DataItem {
    name: string;
    key: string;
    value: string;
    valueType: string;
  }

  const tmpList = ref<DataItem[]>([]);
  let initLock = false;

  const valueTypeList = ref([
    { label: '商品名称', value: '商品名称' },
    { label: '商品价格', value: '商品价格' },
    { label: '开售时间', value: '开售时间' },
    { label: '抽签结果', value: '抽签结果' },
    { label: '自定义', value: '自定义' },
  ]);

  function initData() {
    if (initLock) {
      return;
    }
    if (props.valueTypes) {
      const valueTypes = props.valueTypes.map((item) => ({ label: item, value: item }));
      valueTypeList.value = [...valueTypes, { label: '自定义', value: '自定义' }];
    }
    if (props.template) {
      tmpList.value = props.template.content
        .split(/\n/)
        .filter((item) => !!item)
        .map((item, index) => {
          let [name, key] = item.split(':');
          console.log(name, key);
          key = key.replace(/{{|}}/g, '').replace(/\.DATA/g, '');

          const v = props.value?.[index] || null;
          const value = v?.[1] || '';

          return {
            name,
            value,
            valueType:
              valueTypeList.value.find((i) => i.value === value)?.value || (value ? '自定义' : ''),
            key,
          };
        });
    }
  }

  function valueChange() {
    const value = tmpList.value.map((item) => [
      item.key,
      item.valueType === '自定义' ? item.value : item.valueType,
    ]);

    initLock = true;
    emit('update:value', value);
    emit('change', value);
    setTimeout(() => (initLock = false), 100);
  }

  initData();

  watch(
    () => props.value,
    () => {
      initData();
    },
  );

  watch(
    () => props.template,
    () => {
      initData();
    },
  );

  watch(
    () => props.valueTypes,
    () => {
      initData();
    },
  );
</script>

<style lang="less" scoped>
  .template-data-wrap {
    .temp {
      color: #666;
      padding-top: 5px;
      margin-bottom: 10px;
    }
    .item-inp-wrap {
      display: flex;
      align-items: center;
      .type-select {
        width: 120px;
        margin-right: 5px;
      }
      .inp {
        flex: 1;
      }

      :deep(.ant-input) {
        border-color: #d9d9d9 !important;
        box-shadow: none !important;
      }

      :deep(.ant-select) {
        .ant-select-selector {
          border-color: #d9d9d9 !important;
          box-shadow: none !important;
        }
      }
    }
  }
</style>
