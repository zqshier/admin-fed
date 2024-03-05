<template>
  <a-form-item class="form-wrap">
    <div class="coupon-item">
      <a-popconfirm @confirm="handleDel" title="确认删除？">
        <div class="close"><close-circle-outlined /></div>
      </a-popconfirm>
      <div class="actions">
        <div class="btn"><a-button type="default" size="small" @click="moveUp">上移</a-button></div>
        <div class="btn"
          ><a-button type="default" size="small" @click="moveDown">下移</a-button></div
        >
      </div>
      <div class="cont">
        <div class="f-item">
          <div class="label">关联卡券：</div>
          <div
            class="info"
            :class="{ 'coupon-item-error': value?.validateStatus === 'error' && !coupon }"
          >
            <span class="coupon" v-if="coupon">{{ coupon }}</span>
            <a-button @click="pickCouponInner" v-else>选择优惠券</a-button>
          </div>
        </div>
        <div class="f-item">
          <div class="label">展示时间：</div>
          <div
            class="info"
            :class="{ 'coupon-item-error': value?.validateStatus === 'error' && !hasTime }"
            ><a-range-picker v-model:value="rangeTime" show-time
          /></div>
        </div>
      </div>
    </div>
  </a-form-item>
</template>

<script lang="ts" setup>
  import { CloseCircleOutlined } from '@ant-design/icons-vue';
  import { FormItem as AFormItem, RangePicker as ARangePicker } from 'ant-design-vue';
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import type { Dayjs } from 'dayjs';
  import { CouponsCenterCoupon } from '/@/api/app/mms';
  import { Popconfirm as APopconfirm } from 'ant-design-vue';

  type RangeValue = [Dayjs, Dayjs];

  const props = defineProps({
    pickCoupon: Function,
    value: {
      type: Object as PropType<CouponsCenterCoupon>,
    },
  });

  const emit = defineEmits(['update:value', 'change', 'delete', 'moveup', 'movedown']);

  function getDayjs(date) {
    if (date && date !== '') {
      return dayjs(date);
    }
    return '';
  }

  const rangeTime = computed<RangeValue>({
    get() {
      if (props.value) {
        return [getDayjs(props.value.start), getDayjs(props.value.end)] as RangeValue;
      }
      return [dayjs(), dayjs()];
    },
    set(v) {
      const data = Object.assign({}, props.value, {
        start: dayjs(v[0]).toISOString(),
        end: dayjs(v[1]).toISOString(),
      });
      emit('update:value', data);
      emit('change', data);
    },
  });

  const hasTime = computed(() => {
    if (props.value && props.value.start && props.value.end) {
      return true;
    }
    return false;
  });

  const coupon = computed(() => {
    if (props.value && props.value.couponConfig) {
      return props.value.couponConfig.name;
    }
    return '';
  });

  function pickCouponInner() {
    props.pickCoupon?.((coupon: Recordable) => {
      const data = Object.assign({}, props.value, { couponId: coupon.id, couponConfig: coupon });
      emit('update:value', data);
      emit('change', data);
    });
  }

  function handleDel() {
    emit('delete', props.value);
  }

  function moveUp() {
    emit('moveup', props.value);
  }

  function moveDown() {
    emit('movedown', props.value);
  }
</script>

<style lang="less">
  .ant-form-item-has-error {
    .coupon-item-error {
      .ant-btn {
        border-color: @error-color;
      }
      .ant-picker-range {
        border-color: @error-color;
      }
    }
  }
</style>

<style lang="less" scoped>
  .form-wrap {
    padding-right: 80px;
  }
  .coupon-item {
    position: relative;
    padding: 20px;
    border-radius: 3px;
    border: 1px solid @border-color-base;
    .close {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      color: @text-color;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .actions {
      position: absolute;
      top: 20px;
      right: -60px;
      .btn {
        margin-bottom: 10px;
      }
    }
    .f-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        height: 30px;
        line-height: 30px;
      }
      .info {
        .coupon {
          color: @primary-color;
        }
      }
    }

    .error {
      :deep(.ant-btn) {
        border-color: @error-color;
      }
      :deep(.ant-picker-range) {
        border-color: @error-color;
      }
    }
  }
</style>
