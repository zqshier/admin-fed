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
          <a-input-number
            class="w-150px"
            :disabled="state.type !== TypeEnum.point || readonly"
            @change="updateValue"
            v-model:value="state.inpValue"
            addon-after="积分"
            :min="inputMinNumber"
            :max="inputMaxNumber"
          />
        </div>
      </a-radio>
    </a-radio-group>
    <CouponPicker @register="registerCouponPick" />
  </div>
</template>

<script lang="ts">
  export enum TypeEnum {
    'coupon' = 'coupon',
    'point' = 'point',
  }
</script>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import {
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    InputNumber as AInputNumber,
  } from 'ant-design-vue';
  import { RowSelectionType } from 'ant-design-vue/lib/table/interface';
  import CouponPicker from './CouponPicker.vue';
  import { useModal } from '/@/components/Modal';

  const [registerCouponPick, { openModal: openCouponModal }] = useModal();

  const props = withDefaults(
    defineProps<{
      value?: [TypeEnum, string];
      readonly?: boolean;
      rowType?: RowSelectionType;
      inputMinNumber?: number;
      inputMaxNumber?: number;
    }>(),
    {
      inputMinNumber: 1,
      inputMaxNumber: 999999,
    },
  );

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
      codes: (state.couponCode && state.couponCode.split(',')) || [],
      type: (props.rowType && props.rowType) || 'radio',
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
