<template>
  <div>
    <a-button
      v-if="pickGoodsInfo?.length"
      :style="{ padding: 0, 'white-space': 'normal', 'text-align': 'left' }"
      @click="showGoodsPick"
      type="link"
      :disabled="disabled"
      >{{ pickName }}</a-button
    >
    <a-button @click="showGoodsPick" v-else>选择商品</a-button>
    <GoodsPickModal @register="registerGoodsPick" @success="pickSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { relationsDetail } from '/@/api/app/model/articleModel';
  import GoodsPickModal from '/@/views/components/GoodsPickModal.vue';
  import { useModal } from '/@/components/Modal';
  import { goodsList, GoodsListItem } from '/@/api/app/goods';

  const [registerGoodsPick, { openModal: openGoodsPick }] = useModal();

  const props = defineProps({
    value: {
      type: Object as PropType<{ values: relationsDetail[]; rows: any }>,
      default: null,
    },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'single' },
  });

  const pickGoodsInfo = ref<GoodsListItem[]>([]);

  const emit = defineEmits(['update:value', 'change']);

  const pickName = computed(() => {
    const itemIds =
      (props.value && props.value.values && props.value.values.map((item) => item.v)) || [];
    const data = pickGoodsInfo.value.filter((item) => itemIds.some((id) => item.id === id));
    const names = data.map((item) => item.name);
    return names.join() || '选择商品';
  });

  const updateValue = (value: Recordable) => {
    emit('update:value', value);
    emit('change', value);
  };

  function pickSuccess(value: Recordable) {
    const _value = {
      values: value.ids && value.ids.map((id) => ({ type: 'goods', v: id })),
      rows: value.rows,
    };
    pickGoodsInfo.value = _value.rows;
    updateValue(_value);
  }

  function showGoodsPick() {
    const itemIds =
      (props.value && props.value.values && props.value.values.map((item) => item.v)) || [];
    openGoodsPick(true, { type: props.type, ids: itemIds, disabled: props.disabled });
  }

  async function initGoodsInfo() {
    const itemIds =
      (props.value && props.value.values && props.value.values.map((item) => item.v)) || [];
    if (itemIds?.length === 0) return (pickGoodsInfo.value = []);

    try {
      const { list } = await goodsList({
        ids: itemIds as number[],
        perPage: Math.max(itemIds.length, 20),
        page: 1,
      });
      pickGoodsInfo.value = list;
    } catch (error) {
      console.error('initUsersInfo error=', error);
      pickGoodsInfo.value = [];
    }
  }

  defineExpose({ initGoodsInfo });
</script>
