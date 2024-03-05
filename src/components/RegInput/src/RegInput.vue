<template>
  <a-input v-bind="$attrs" v-model:value="inpVal" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Input as AInput } from 'ant-design-vue';
  import { RegInputType } from './types';

  const props = defineProps({
    value: {
      type: [String, Number] as PropType<string | number>,
    },
    type: {
      type: String as PropType<RegInputType>,
      default: RegInputType.number,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const changeNumber = (num: string) => {
    if (num !== '' && !/\.$/.test(num) && !isNaN(Number(num))) {
      return Number(num);
    }
    return num;
  };

  const format = (val: string) => {
    if (props.type === RegInputType.number) {
      return changeNumber(val.replace(/[^0-9\.]/g, ''));
    } else if (props.type === RegInputType.intm) {
      return changeNumber(val.replace(/[^0-9\-]/g, ''));
    } else if (props.type === RegInputType.int) {
      return changeNumber(val.replace(/[^0-9]/g, '').replace(/^0$/, ''));
    }
    return val;
  };

  const inpVal = computed({
    get() {
      return props.value;
    },
    set(v) {
      v = format(v + '');
      emit('update:value', v);
      emit('change', v);
    },
  });
</script>
