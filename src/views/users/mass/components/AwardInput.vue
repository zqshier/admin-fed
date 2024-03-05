<template>
  <div>
    <a-radio-group v-model:value="state.type" @change="typeChange">
      <a-radio class="radio-item" :value="AwardTypeEnum.coupon">
        <div class="flex items-center">
          <div class="mr-2 w-60px">送优惠券</div>
          <div class="mr-2 text-blue-600" v-if="state.coupon">{{ state.coupon }}</div>
          <div
            ><a-button :disabled="state.type !== AwardTypeEnum.coupon" @click="addCoupon"
              >添加优惠券</a-button
            ></div
          >
        </div>
      </a-radio>
      <a-radio class="radio-item" :value="AwardTypeEnum.point">
        <div class="flex items-center">
          <div class="mr-2 w-60px">送积分</div>
          <div class="mr-1">
            <a-input-number
              class="no-require"
              :disabled="state.type !== AwardTypeEnum.point"
              :min="1"
              :max="99999"
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
  import { AwardTypeEnum } from '../data';

  const [registerCouponPick, { openModal: openCouponModal }] = useModal();

  const props = defineProps<{
    value?: [AwardTypeEnum, string];
  }>();

  const emit = defineEmits(['update:value', 'change']);

  const state = reactive<{
    type: AwardTypeEnum;
    inpValue: string;
    coupon: string;
    couponCode: string;
  }>({
    type: AwardTypeEnum.coupon,
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
    if (state.type === AwardTypeEnum.coupon) {
      v = [state.type, state.couponCode];
    }

    emit('update:value', v);
    emit('change', v);
  }

  function addCoupon() {
    openCouponModal(true, {
      codes: (state.couponCode && state.couponCode.split(',')) || [],
      cb: (coupons: Recordable) => {
        const names = coupons.map((c) => c.name);
        const codes = coupons.map((c) => c.code);
        state.coupon = (names && names.join(',')) || '';
        state.couponCode = (codes && codes.join(',')) || '';
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
        if (state.type === AwardTypeEnum.coupon) {
          state.couponCode = v[1];
          state.inpValue = '';
          state.coupon = '';
          getConponInfo();
        } else {
          state.inpValue = v[1];
          state.coupon = '';
          state.couponCode = '';
        }
      } else {
        state.type = AwardTypeEnum.coupon;
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
