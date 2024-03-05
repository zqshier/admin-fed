<template>
  <a-popconfirm @visible-change="visibleChange" :visible="visible" @confirm="confirm">
    <slot></slot>
    <template #title>
      <a-input
        ref="inpRef"
        v-model:value="inpValue"
        @press-enter="onInpEnter"
        :placeholder="placeholder"
      />
    </template>
    <template #icon><edit-outlined class="edit-icon" /></template>
  </a-popconfirm>
</template>

<script lang="ts" setup>
  import { EditOutlined } from '@ant-design/icons-vue';
  import { Popconfirm as APopconfirm } from 'ant-design-vue';
  import { ref } from 'vue';

  const props = defineProps({
    onConfirm: {
      type: Function,
    },
    item: {
      type: [Object, String],
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
  });

  const inpRef = ref();
  const visible = ref(false);
  const inpValue = ref('');

  function visibleChange(value: boolean) {
    if (value) {
      inpValue.value = '';
      setTimeout(() => inpRef.value?.focus(), 100);
    }
    visible.value = value;
  }

  function confirm() {
    const v = inpValue.value.trim();
    if (props.onConfirm && v !== '') {
      return props.onConfirm(v, props.item);
    }
  }
  function onInpEnter() {
    confirm();
    visible.value = false;
  }
</script>

<style lang="less" scoped>
  .edit-icon {
    color: rgba(0, 0, 0, 0.85);
    margin-top: 5px;
  }
</style>
