<template>
  <div class="form-slot">
    <a-radio-group v-model:value="state.type" @change="typeChange" :disabled="readonly">
      <a-radio class="radio-item" :value="TimeTypeEnum.forever">永久有效</a-radio>
      <a-radio class="radio-item" :value="TimeTypeEnum.fix">
        <div class="flex items-center">
          <div class="mr-2 w-60px">固定时间</div>
          <div
            ><RangePickerEx v-model:value="state.time" @change="updateValue" :disabled="readonly"
          /></div>
        </div>
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import { RadioGroup as ARadioGroup, Radio as ARadio } from 'ant-design-vue';
  import { TimeTypeEnum } from '../data';
  import { RangePickerEx } from '/@/components/RangePickerEx';

  const props = defineProps<{
    value?: [TimeTypeEnum, string, string];
    readonly?: boolean;
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const state = reactive<{
    type: TimeTypeEnum;
    time: string[];
  }>({
    type: TimeTypeEnum.forever,
    time: [],
  });

  function typeChange() {
    updateValue();
  }

  function updateValue() {
    let v = [state.type, '', ''];

    console.log('updateValue', state.type, state.time);
    if (state.time && state.time.length === 2) {
      v[1] = state.time[0];
      v[2] = state.time[1];
    }

    emit('update:value', v);
    emit('change', v);
  }

  watch(
    () => props.value,
    (v) => {
      console.debug('watch', v);
      if (v) {
        state.type = v[0];
        state.time = [v[1], v[2]];
      }
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  .radio-item {
    display: flex;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
