<template>
  <div style="padding-top: 5px">
    <a-radio-group v-model:value="percentRadioValue">
      <a-radio style="height: 30px; display: flex" :value="1">不限制</a-radio>
      <a-radio style="height: 30px; display: flex; align-items: center" :value="2">
        <span>最多抵扣</span>
        <a-input style="margin: 0 4px; width: 80px" v-model:value="inp" @change="updateValue" />
        <span>%</span>
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
  import {
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    InputNumber as AInput,
  } from 'ant-design-vue';
  import { ref, computed, watch } from 'vue';

  const props = defineProps({
    value: {
      type: [Number, String],
    },
  });

  const emit = defineEmits(['update:value', 'change']);
  const inp = ref(props.value);

  watch(
    () => props.value,
    () => (inp.value = props.value),
    { deep: true },
  );

  const percentRadioValue = computed({
    get() {
      if (!props.value || props.value >= 100) {
        return 1;
      }
      return 2;
    },
    set(v) {
      if (v === 1) {
        inp.value = 100;
      }
      updateValue(Number(inp.value));
    },
  });

  const updateValue = (v: number) => {
    emit('change', v);
    emit('update:value', v);
  };
</script>

<style scoped></style>
