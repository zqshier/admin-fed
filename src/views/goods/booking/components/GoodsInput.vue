<template>
  <div class="pt-1">
    <!-- <div class="label" v-if="pickGoodsName">{{ pickGoodsName }}</div>
    <a-button @click="showPick">选择商品</a-button> -->
    <a-radio-group
      v-if="options"
      :value="value?.target"
      :options="options"
      :disabled="disabled"
      @change="(e) => updateValue({ targetId: '', target: e.target.value })"
    />
    <div class="mt-3">
      <span v-show="pickGoodsName" class="mr-3">{{ pickGoodsName }}</span>
      <a-button @click="showPick" type="primary" :disabled="disabled">
        {{ value?.target === EBookingTarget.goods ? '选择普通商品' : '选择积分商品' }}
      </a-button>
    </div>
    <GoodsPickModal @register="registerGoodsPick" />
    <PointmallGoodsPickModal @register="registerPointmallGoodsPick" />
  </div>
</template>

<script setup lang="ts">
  import { RadioGroup as ARadioGroup } from 'ant-design-vue';
  import { ref, unref, watch } from 'vue';
  import { goodsInfo } from '/@/api/app/goods';
  import { EBookingTarget } from '/@/api/app/model/bookingModel';
  import { pointMallDetail } from '/@/api/app/promotions';
  import { useModal } from '/@/components/Modal';
  import GoodsPickModal from '/@/views/components/GoodsPickModal.vue';
  import PointmallGoodsPickModal from '/@/views/components/PointmallGoodsPickModal.vue';

  const props = defineProps({
    value: {
      type: Object as PropType<{ target: EBookingTarget; targetId: string }>,
    },
    options: {
      type: Array as PropType<{ label: string; value: string | number }[]>,
    },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['update:value', 'change']);

  const [registerGoodsPick, { openModal }] = useModal();
  const [registerPointmallGoodsPick, { openModal: openPointmallModal }] = useModal();

  const pickGoodsName = ref<string>('');

  function showPick() {
    let cb, ids;
    if (props.value?.target === EBookingTarget.goods) {
      cb = openModal;
      ids = props.value?.targetId ? [+props.value.targetId] : [];
    } else {
      cb = openPointmallModal;
      ids = props.value?.targetId ? [props.value.targetId] : [];
    }
    cb(true, {
      ids,
      type: 'single',
      callback: (data: Recordable) => {
        const row = data.rows?.[0];
        pickGoodsName.value = row?.name || '';
        const targetId =
          props.value?.target === EBookingTarget.pointmall ? row.promotionId : row.id;
        updateValue({ targetId });
      },
    });
  }

  const updateValue = (value: Recordable) => {
    console.debug('updateValue value', value);
    const d = { ...unref(props.value), ...value };
    emit('update:value', d);
    emit('change', d);
  };

  async function initData() {
    if (props.value?.targetId) {
      const { targetId: id, target } = props.value;
      let result: Recordable = {};
      if (target === EBookingTarget.goods) {
        result = await goodsInfo(+id);
      } else if (target === EBookingTarget.pointmall) {
        result = await pointMallDetail(id);
      }
      pickGoodsName.value = result?.name || '';
    } else {
      pickGoodsName.value = '';
    }
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
