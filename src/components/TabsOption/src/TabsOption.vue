<template>
  <div class="tabs-wrap" v-if="options">
    <a-tabs type="card" size="small" v-model:activeKey="active">
      <a-tab-pane v-for="item in options" :key="item.key" :tab="item.tab" />
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
  import { TabsOptionItem } from './types';
  import { computed } from 'vue';
  const props = defineProps({
    modelValue: Number,
    options: {
      type: Array as PropType<TabsOptionItem[]>,
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const active = computed({
    get: () => {
      return props.modelValue;
    },
    set: (v) => {
      emit('update:modelValue', v);
      emit('change', v);
    },
  });
</script>

<style lang="less" scoped>
  .tabs-wrap {
    flex: 1;
    padding-left: 10px;
    display: flex;
    align-items: center;
    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }
    :deep(.ant-tabs-nav-operations) {
      display: none;
    }
  }
</style>
