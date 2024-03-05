<template>
  <div class="goods-input">
    <a-button @click="showPick" type="primary" ghost>选择商品</a-button>
    <span class="ml-3" v-if="pickNum > 0">(已选择{{ pickNum }}个)</span>
    <GoodsPickModal @register="registerGoodsPick" />
  </div>
</template>

<script setup lang="ts">
  import { watch, computed } from 'vue';
  import GoodsPickModal from './GoodsPickModal.vue';
  import { GoodsPickData } from '/@/views/components/GoodsPickModal.vue';
  import { useModal } from '/@/components/Modal';
  // import { goodsList } from '/@/api/app/goods';

  const props = defineProps<{
    value?: number[];
    configId?: number;
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const [registerGoodsPick, { openModal }] = useModal();

  const pickNum = computed(() => props.value?.length || 0);

  function showPick() {
    openModal(true, {
      ids: props.value ? props.value : [],
      configId: props.configId,
      callback: (data: GoodsPickData) => {
        const row = data.rows;
        const ids = row.map((i) => i.id);
        emit('update:value', ids);
        emit('change', ids);
      },
    });
  }

  async function initData() {
    // if (props.value) {
    //   const { list } = await goodsList({
    //     ids: [props.value] as number[],
    //     page: 1,
    //     perPage: 10,
    //   });
    //   const goods = list?.[0];
    //   pickGoodsName.value = goods?.name || '';
    // } else {
    //   pickGoodsName.value = '';
    // }
  }

  watch(
    () => props.value,
    () => {
      initData();
    },
  );
</script>

<style lang="less" scoped>
  .goods-input {
    display: flex;
    align-items: center;
    .label {
      margin-right: 10px;
    }
  }
</style>
