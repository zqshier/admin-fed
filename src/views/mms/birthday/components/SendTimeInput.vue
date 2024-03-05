<template>
  <div class="form-slot">
    <a-radio-group v-model:value="state.type" @change="typeChange" :disabled="readonly">
      <a-radio class="radio-item" :value="SendTimeTypeEnum.day">按天</a-radio>
      <a-radio class="radio-item" :value="SendTimeTypeEnum.month">按月</a-radio>
    </a-radio-group>
    <div class="mt-2 flex items-center" v-if="state.type === SendTimeTypeEnum.day">
      <span class="mr-2">生日</span>
      <a-select
        style="width: 100px"
        v-model:value="state.time"
        @change="updateValue"
        :disabled="readonly"
      >
        <a-select-option v-for="item in dayOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div class="mt-2 flex items-center" v-if="state.type === SendTimeTypeEnum.month">
      <span class="mr-2">当月</span>
      <a-select
        style="width: 100px"
        v-model:value="state.time"
        @change="updateValue"
        :disabled="readonly"
      >
        <a-select-option v-for="item in monthOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import {
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Select as ASelect,
    SelectOption as ASelectOption,
  } from 'ant-design-vue';
  import { SendTimeTypeEnum } from '../data';

  const props = defineProps<{
    value?: [SendTimeTypeEnum, number];
    readonly?: boolean;
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const state = reactive<{
    type: SendTimeTypeEnum;
    time: number;
  }>({
    type: SendTimeTypeEnum.day,
    time: 0,
  });

  const dayOptions = ref([
    { label: '当天', value: 0 },
    { label: '前一天', value: 1 },
  ]);

  const monthOptions = ref<{ label: string; value: number }[]>([]);

  for (let i = 0; i < 31; i++) {
    monthOptions.value.push({ label: `${i + 1}号`, value: i });
  }

  function typeChange() {
    if (state.type === SendTimeTypeEnum.day) {
      state.time = dayOptions.value[0].value;
    } else {
      state.time = monthOptions.value[0].value;
    }
    updateValue();
  }

  function updateValue() {
    let v = [state.type, state.time];

    emit('update:value', v);
    emit('change', v);
  }

  watch(
    () => props.value,
    (v) => {
      if (v && v.length === 2) {
        state.type = v[0];
        state.time = v[1];
      } else {
        state.type = SendTimeTypeEnum.day;
        state.time = dayOptions.value[0].value;
      }
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped></style>
