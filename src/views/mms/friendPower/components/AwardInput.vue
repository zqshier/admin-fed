<template>
  <div>
    <a-checkbox-group v-model:value="checkedList" @change="updateValue" :disabled="readonly">
      <a-row class="mb-2">
        <a-col>
          <a-checkbox :value="TypeEnum.coupon">
            <div class="flex items-center">
              <div class="mr-2 w-60px">送优惠券</div>
              <div class="mr-2 text-blue-600" v-if="state.coupon">{{ state.coupon }}</div>
              <div v-if="!readonly"
                ><a-button :disabled="!checkedList.includes(TypeEnum.coupon)" @click="addCoupon"
                  >添加优惠券</a-button
                ></div
              >
            </div>
          </a-checkbox>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-checkbox :value="TypeEnum.point">
            <div class="flex items-center">
              <div class="mr-2 w-60px">送积分</div>
              <a-input-number
                class="w-150px"
                :disabled="!checkedList.includes(TypeEnum.point) || readonly"
                @change="updateValue"
                v-model:value="state.inpValue"
                addon-after="积分"
                :min="inputMinNumber"
                :max="inputMaxNumber"
              />
            </div>
          </a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>
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
  import { reactive, watch, ref } from 'vue';
  import {
    Row as ARow,
    Col as ACol,
    CheckboxGroup as ACheckboxGroup,
    Checkbox as ACheckbox,
    InputNumber as AInputNumber,
  } from 'ant-design-vue';
  import { RowSelectionType } from 'ant-design-vue/lib/table/interface';
  import CouponPicker from '/@/views/components/CouponPicker.vue';
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
      inputMaxNumber: 99999,
    },
  );

  const emit = defineEmits(['update:value', 'change']);

  const checkedList = ref<string[]>([]);

  const state = reactive<{ type: TypeEnum; inpValue: string; coupon: string; couponCode: string }>({
    type: TypeEnum.coupon,
    inpValue: '',
    coupon: '',
    couponCode: '',
  });

  function updateValue() {
    let v = checkedList.value.map((item) => ({
      type: item,
      value: item === TypeEnum.point ? state.inpValue : state.couponCode,
      displayName: item === TypeEnum.point ? `${state.inpValue}积分` : state.coupon,
    }));

    emit('update:value', v);
    emit('change', v);
  }

  function addCoupon() {
    openCouponModal(true, {
      codes: (state.couponCode && state.couponCode.split(',')) || [],
      type: (props.rowType && props.rowType) || 'radio',
      maxLimit: 3,
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

  function initData() {
    checkedList.value = [];
    state.inpValue = '';
    state.couponCode = '';
    state.coupon = '';
  }

  watch(
    () => props.value,
    (v: any) => {
      if (v && v.length > 0) {
        for (const i of v) {
          if (i.type === TypeEnum.coupon) {
            state.couponCode = i.value;
            getConponInfo();
          }
          if (i.type === TypeEnum.point) state.inpValue = i.value;
          !checkedList.value.includes(i.type) ? checkedList.value.push(i.type) : '';
        }
      } else {
        // checkedList.value = [];
        // state.inpValue = '';
        // state.couponCode = '';
        // state.coupon = '';
      }
    },
    { immediate: true },
  );

  defineExpose({ initData });
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
