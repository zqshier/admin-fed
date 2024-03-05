<template>
  <div>
    <a-radio-group v-model:value="state.type" @change="typeChange" :disabled="readonly">
      <a-radio class="radio-item" :value="TypeEnum.coupon">
        <div class="flex items-center">
          <div class="mr-2 w-60px">送优惠券</div>
          <div class="mr-2 text-blue-600" v-if="state.coupon">{{ state.coupon }}</div>
          <div v-if="!readonly"
            ><a-button :disabled="state.type !== TypeEnum.coupon" @click="addCoupon"
              >添加优惠券</a-button
            ></div
          >
        </div>
      </a-radio>
      <a-radio class="radio-item" :value="TypeEnum.point">
        <div class="flex items-center">
          <div class="mr-2 w-60px">送积分</div>
          <div class="mr-1">
            <a-input-number
              class="no-require"
              :disabled="state.type !== TypeEnum.point || readonly"
              @change="updateValue"
              v-model:value="state.inpValue"
            />
          </div>
          <div>积分</div>
        </div>
      </a-radio>
    </a-radio-group>
    <CouponPicker @register="registerCouponPick" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import {
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    InputNumber as AInputNumber,
  } from 'ant-design-vue';
  import CouponPicker from '/@/views/components/CouponPicker.vue';
  import { useModal } from '/@/components/Modal';
  import { TypeEnum } from '../data';

  const [registerCouponPick, { openModal: openCouponModal }] = useModal();

  const props = defineProps<{
    value?: [TypeEnum, string];
    readonly?: boolean;
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const state = reactive<{ type: TypeEnum; inpValue: string; coupon: string; couponCode: string }>({
    type: TypeEnum.coupon,
    inpValue: '',
    coupon: '',
    couponCode: '',
  });

  function typeChange() {
    state.inpValue = '';
    state.coupon = '';
    state.couponCode = '';
    updateValue();
  }

  function updateValue() {
    let v = [state.type, state.inpValue + ''];
    if (state.type === TypeEnum.coupon) {
      v = [state.type, state.couponCode];
    }

    emit('update:value', v);
    emit('change', v);
  }

  function addCoupon() {
    openCouponModal(true, {
      codes: [state.couponCode],
      cb: (coupon: Recordable) => {
        state.coupon = coupon.name;
        state.couponCode = coupon.code;
        updateValue();
      },
    });
  }

  function getConponInfo() {
    if (state.coupon) {
      return;
    }
    //todo 获取优惠券信息
    state.coupon = state.couponCode;
  }

  watch(
    () => props.value,
    (v) => {
      if (v && v.length === 2) {
        state.type = v[0];
        if (state.type === TypeEnum.coupon) {
          state.couponCode = v[1];
          state.inpValue = '';
          getConponInfo();
        } else {
          state.inpValue = v[1];
          state.coupon = '';
          state.couponCode = '';
        }
      } else {
        state.type = TypeEnum.coupon;
        state.inpValue = '';
        state.couponCode = '';
        state.coupon = '';
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
