<template>
  <div>
    <a-range-picker
      :show-time="showTime"
      v-model:value="pickValue"
      @change="onChange"
      :format="format"
      :placeholder="['开始时间', '结束时间']"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
  import { RangePicker as ARangePicker } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { ref, watch } from 'vue';

  const emit = defineEmits(['update:value', 'change']);

  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
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
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const pickValue = ref<[Dayjs, Dayjs]>();

  watch(
    () => props.value,
    (v) => {
      if (v && v.length === 2) {
        if (v[0] && v[1]) {
          pickValue.value = [dayjs(v[0]), dayjs(v[1])];
        } else {
          pickValue.value = undefined;
        }
      } else {
        pickValue.value = undefined;
      }
    },
    { immediate: true },
  );

  function updateValue() {
    const v = props.useFormat
      ? pickValue.value?.map((item) => item.format(props.format))
      : pickValue.value?.map((item) => item.toISOString());
    emit('update:value', v);
    emit('change', v);
  }

  function onChange() {
    updateValue();
  }
</script>

<style lang="less" scoped></style>
