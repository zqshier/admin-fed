<template>
  <div>
    <a-radio-group v-model:value="timeData.__type" @change="updateValue" :disabled="disabled">
      <a-radio :value="timeTypeD.exact">
        <div class="flex">
          <a-range-picker
            @change="updateValue"
            v-model:value="rangeTime"
            show-time
            :disabled="disabled"
          />
        </div>
      </a-radio>
      <a-radio :value="timeTypeD.delay">
        <div class="flex items-center mt-3">
          <span>领券</span>
          <a-input-number
            @change="updateValue"
            style="margin: 0 4px"
            v-model:value="timeData.after"
            :disabled="disabled"
            :min="0"
          />
          <span>天后生效，有效期</span>
          <a-input-number
            @change="updateValue"
            style="margin: 0 4px"
            v-model:value="timeData.days"
            :disabled="disabled"
            :min="1"
          />
          <span>天</span>
        </div>
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script lang="ts" setup>
  import {
    InputNumber as AInputNumber,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    RangePicker as ARangePicker,
  } from 'ant-design-vue';
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import { onMounted, ref, watch } from 'vue';
  import { CouponsExpiration } from '/@/api/app/model/mmsModel';

  const props = defineProps({
    value: {
      type: Object as PropType<CouponsExpiration>,
    },
    disabled: { type: Boolean },
  });

  const emit = defineEmits(['update:value', 'change']);

  const timeFormat = 'YYYY-MM-DD HH:mm:ss';

  type RangeValue = [Dayjs, Dayjs];

  const rangeTime = ref<RangeValue | undefined>();

  enum timeTypeD {
    exact = 'exact',
    delay = 'delay',
  }

  const timeData = ref<CouponsExpiration>({
    __type: timeTypeD.exact,
    start: '',
    end: '',
    after: '',
    days: '',
  });

  async function updateValue() {
    let data;
    let { __type, start, end, after, days } = timeData.value;

    if (__type === timeTypeD.exact) {
      if (rangeTime.value && rangeTime.value.length === 2) {
        start = dayjs(rangeTime.value[0]).format(timeFormat);
        end = dayjs(rangeTime.value[1]).format(timeFormat);
      }

      data = {
        __type,
        start,
        end,
      };
    } else {
      data = {
        __type,
        after,
        days,
      };
    }
    emit('update:value', data);
    emit('change', data);
  }

  function initValue() {
    console.log('initValue', props.value);
    if (props.value) {
      const { __type, start, end, after, days } = props.value;
      if (__type === timeTypeD.exact || start) {
        Object.assign(timeData.value, { __type: timeTypeD.exact, start, end });
        if (start && end) {
          rangeTime.value = [dayjs(start), dayjs(end)];
        } else {
          rangeTime.value = undefined;
        }
      } else {
        Object.assign(timeData.value, { __type: timeTypeD.delay, after, days });
      }
    } else {
      rangeTime.value = undefined;
      timeData.value = {
        __type: timeTypeD.exact,
        start: '',
        end: '',
        after: '',
        days: '',
      };
    }
  }

  onMounted(() => {
    initValue();
  });

  watch(
    () => props.value,
    () => initValue(),
    { deep: true },
  );
</script>
