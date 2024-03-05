<template>
  <div>
    <a-radio-group v-if="options" v-model:value="type" :options="options" :disabled="disabled" />
    <div class="mt-3" v-if="type && type !== 'all'"
      ><a-button @click="showGoodsPick" type="primary" ghost>选择商品</a-button
      ><span class="ml-3">(已选择{{ pickNum }}个)</span></div
    >
    <GoodsPickModal @register="registerGoodsPick" @success="pickSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { RadioGroup as ARadioGroup } from 'ant-design-vue';
  import { computed, unref } from 'vue';
  import GoodsPickModal from './GoodsPickModal.vue';
  import { CouponsCondition } from '/@/api/app/model/mmsModel';
  import { useModal } from '/@/components/Modal';

  const [registerGoodsPick, { openModal: openGoodsPick }] = useModal();

  const props = defineProps({
    value: {
      type: Object as PropType<CouponsCondition>,
    },
    options: {
      type: Array as PropType<{ label: string; value: string | number }[]>,
    },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['update:value', 'change']);

  const defaultPicks = { catalogIds: [], itemIds: [], skuIds: [] };

  const type = computed({
    get() {
      return props.value?.type;
    },
    set(v) {
      updateValue({ ...defaultPicks, type: v });
    },
  });

  const pickNum = computed(() => {
    const data = props.value;
    if (data?.catalogIds && data.catalogIds.length > 0) {
      return data.catalogIds.length;
    }
    if (data?.itemIds && data.itemIds.length > 0) {
      return data.itemIds.length;
    }
    return 0;
  });

  const updateValue = (value: Recordable) => {
    const d = { ...unref(props.value), ...value };
    emit('update:value', d);
    emit('change', d);
  };

  function pickSuccess(value: Recordable) {
    updateValue(value);
  }

  function showGoodsPick() {
    openGoodsPick(true, props.value);
  }
</script>
