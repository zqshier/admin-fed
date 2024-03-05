<template>
  <div class="range-input-wrap">
    <reg-input class="inp" :type="type" v-model:value="inpVal1" :placeholder="placeholders[0]" />
    <span class="sp">-</span>
    <reg-input class="inp" :type="type" v-model:value="inpVal2" :placeholder="placeholders[1]" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { RegInputType, RegInput } from '../../RegInput';

  const props = defineProps({
    value: {
      type: Array as PropType<string[]>,
    },
    type: {
      type: String as PropType<RegInputType>,
      default: RegInputType.number,
    },
    placeholders: {
      type: Array as PropType<string[]>,
      default: () => {
        return ['请输入', '请输入'];
      },
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const inpVal1 = computed({
    get() {
      if (!props.value || props.value.length != 2) {
        return '';
      }
      return props.value[0];
    },
    set(v) {
      const _val = [v, inpVal2.value];
      emit('update:value', _val);
      emit('change', _val);
    },
  });

  const inpVal2 = computed({
    get() {
      if (!props.value || props.value.length != 2) {
        return '';
      }
      return props.value[1];
    },
    set(v) {
      const _val = [inpVal1.value, v];
      emit('update:value', _val);
      emit('change', _val);
    },
  });
</script>

<style lang="less" scoped>
  .range-input-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    .sp {
      margin: 0 4px;
    }
    .inp {
      flex: 1;
    }
  }
</style>
