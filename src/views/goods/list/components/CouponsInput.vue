<template>
  <div>
    <div class="flex">
      <a-button @click="showPop" v-bind="$attrs">
        {{ selectedCoupon.name || '添加优惠券' }}
      </a-button>
    </div>
    <CouponPicker @register="registerCouponPick" />
  </div>
</template>

<script lang="ts" setup>
  import { useModal } from '/@/components/Modal';
  import { ref, onMounted } from 'vue';
  import { couponsList } from '/@/api/app/mms';
  import CouponPicker from '/@/views/components/CouponPicker.vue';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const selectedCoupon = ref<{ code?: string; name?: string }>({} as {});

  const [registerCouponPick, { openModal }] = useModal();

  async function showPop() {
    openModal(true, {
      id: props.value,
      cb: (coupons: Recordable) => {
        selectedCoupon.value = coupons[0];
        updateValue();
      },
    });
  }

  function updateValue() {
    const code = selectedCoupon.value?.code;
    if (!code) return;
    emit('change', code);
    emit('update:value', code);
  }

  async function getCouponData() {
    const { list = null } = await couponsList({
      codes: props.value,
      page: 1,
      perPage: props.value.split(',').length,
    });
    if (!list) return;
    const { name, code } = list.shift()!;
    selectedCoupon.value = { name, code };
  }

  onMounted(async () => {
    if (!props.value) return;
    getCouponData();
  });
</script>

<style lang="less" scoped></style>
