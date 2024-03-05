<template>
  <div class="cell-edit-wrap">
    <a-spin :spinning="isLoading">
      <template v-if="!isEdit">
        <span class="txt">{{ value || '-' }}</span>
        <span class="icon" @click="openEdit"><EditFilled /></span>
        <a-popconfirm title="确认删除此值？" @confirm="handleDelete">
          <span class="icon" v-if="showDelete"><DeleteFilled /></span>
        </a-popconfirm>
      </template>
      <template v-else>
        <a-input ref="inpRef" style="width: 100px" v-model:value="editInput" />
        <span class="icon" @click="handleSubmit"><CheckOutlined /></span>
        <span class="icon" @click="closeEdit"><CloseOutlined /></span>
      </template>
    </a-spin>
  </div>
</template>

<script lang="ts">
  export interface CellEditSubmitInfo {
    value: string | number;
    close?: Function;
    record?: Recordable;
  }
</script>

<script lang="ts" setup>
  import { Input as AInput, Spin as ASpin, Popconfirm as APopconfirm } from 'ant-design-vue';
  import { EditFilled, DeleteFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    value: {
      type: String as PropType<string>,
    },
    showDelete: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    record: {
      type: Object as PropType<Recordable>,
    },
    beforeSubmit: {
      type: Function as PropType<(data: CellEditSubmitInfo) => Promise<any>>,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const isEdit = ref(false);
  const isLoading = ref(false);

  const editInput = ref('');
  const inpRef = ref();

  function openEdit() {
    isEdit.value = true;
    editInput.value = (props.value || '') + '';
    setTimeout(() => inpRef.value.focus(), 100);
  }

  function closeEdit() {
    isEdit.value = false;
  }

  async function handleSubmit() {
    try {
      isLoading.value = true;
      let value = editInput.value;
      if (props.beforeSubmit) {
        value = await props.beforeSubmit({ value, close: closeEdit, record: props.record });
      }
      emit('update:value', value);
      emit('change', value);
      isLoading.value = false;
      closeEdit();
    } catch {
      isLoading.value = false;
    }
  }

  watch(
    () => props.value,
    () => console.log('change', props.value),
  );

  function handleDelete() {
    editInput.value = '';
    handleSubmit();
  }
</script>

<style lang="less" scoped>
  .cell-edit-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      cursor: pointer;
      margin-left: 10px;
    }
  }
</style>
