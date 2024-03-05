<template>
  <a-date-picker
    :show-time="showTime"
    v-model:value="pickValue"
    @change="onChange"
    @ok="onOk"
    :format="format"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { DatePicker as ADatePicker } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { ref, watch } from 'vue';

  const emit = defineEmits(['update:value', 'change']);

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss',
    },
    showTime: {
      type: [Object, Boolean],
      default: () => ({ format: 'HH:mm:ss' }),
    },
    useFormat: {
      type: Boolean,
      default: false,
    },
  });

  const pickValue = ref<Dayjs>();

  watch(
    () => props.value,
    (v) => {
      pickValue.value = v ? dayjs(v) : undefined;
    },
    { immediate: true },
  );

  function updateValue() {
    const v = props.useFormat
      ? pickValue.value?.format(props.format)
      : pickValue.value?.toISOString();
    emit('update:value', v);
    emit('change', v);
  }

  function onChange() {
    // if (!props.showTime) {
    updateValue();
    // }
  }

  function onOk() {
    updateValue();
  }
</script>

<style lang="less" scoped></style>
