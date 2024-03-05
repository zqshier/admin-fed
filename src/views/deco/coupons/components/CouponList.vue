<template>
  <div>
    <div class="mb-20px"><a-button type="default" @click="handleAdd">添加卡券</a-button></div>
    <div>
      <coupon-item
        v-for="(_, index) in dataList"
        :key="index"
        v-model:value="dataList[index]"
        :pickCoupon="openCouponPicker"
        @delete="handleDel(index)"
        @moveup="handleMoveup(index)"
        @movedown="handleMovedown(index)"
        @change="updateValue"
      />
    </div>
  </div>
  <CouponPicker @register="registerCouponPick" />
</template>

<script lang="ts" setup>
  import CouponItem from './CouponItem.vue';
  import CouponPicker from './CouponPicker.vue';
  import { useModal } from '/@/components/Modal';
  import { CouponsCenterCoupon } from '/@/api/app/mms';
  import { ref, watch } from 'vue';

  const props = defineProps<{
    value?: [CouponsCenterCoupon[], number[]];
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const [registerCouponPick, { openModal }] = useModal();

  const dataList = ref<CouponsCenterCoupon[]>([]);
  const deleteIds = ref<number[]>([]);

  function openCouponPicker(cb: Function) {
    openModal(true, { cb });
  }

  function handleAdd() {
    dataList.value.push({
      couponId: '',
      start: '',
      end: '',
    });

    updateValue();
  }

  function handleDel(index: number) {
    const data = dataList.value[index];
    if (data.id) {
      deleteIds.value.push(data.id);
    }
    dataList.value.splice(index, 1);

    updateValue();
  }

  function handleMoveup(index: number) {
    if (dataList.value.length <= 1) {
      return;
    }
    if (index === 0) {
      return;
    }
    const indexUp = index - 1;
    const arr = dataList.value;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];

    updateValue();
  }

  function handleMovedown(index: number) {
    if (dataList.value.length <= 1) {
      return;
    }

    if (index === dataList.value.length - 1) {
      return;
    }
    const indexUp = index + 1;
    const arr = dataList.value;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];

    updateValue();
  }

  function initValue() {
    if (props.value && props.value.length === 2) {
      dataList.value = props.value[0];
      deleteIds.value = props.value[1] || [];
    } else {
      dataList.value = [];
      deleteIds.value = [];
    }
  }

  function updateValue() {
    const total = dataList.value.length;
    const list = dataList.value.map((item, index) => {
      if (!item.couponId || !item.start || !item.end) {
        item.validateStatus = 'error';
      } else {
        delete item.validateStatus;
      }
      item.position = total - index;
      return item;
    });

    const val = [list, deleteIds.value];
    emit('update:value', val);
    emit('change', val);
  }

  watch(
    () => props.value,
    () => {
      initValue();
    },
    { immediate: true },
  );
</script>
