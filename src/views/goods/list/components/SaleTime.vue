<template>
  <div style="margin-top: -20px">
    <a-checkbox v-model:checked="checked"
      >启用定时{{ saleStatus === statusType.on ? '下架' : '上架' }}
      <a-date-picker
        placeholder="请选择日期时间"
        :format="pickTimeFormat"
        show-time
        v-model:value="pickTime"
        @ok="onOk"
      />
    </a-checkbox>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import { Checkbox as ACheckbox, DatePicker as ADatePicker } from 'ant-design-vue';

  enum statusType {
    on = 1, //上架
    off = 2, //下架
  }

  interface SaleTimeModel {
    saleTime?: string; //上架时间
    closeTime?: string; //下架时间
  }

  const props = defineProps({
    value: {
      type: Object as PropType<SaleTimeModel>,
    },
    saleStatus: {
      type: Number,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const checked = ref(false);
  const pickTime = ref<Dayjs | undefined>();
  const pickTimeFormat = 'YYYY-MM-DD HH:mm:ss';

  watch(
    () => props.value,
    (value: SaleTimeModel) => {
      initValue(value);
    },
  );

  watch(
    () => checked.value,
    () => updateValue(),
  );

  function getResult(d: any) {
    return dayjs(d).format(pickTimeFormat);
  }

  function initValue(value: SaleTimeModel) {
    if (value) {
      if (value.closeTime) {
        pickTime.value = dayjs(value.closeTime);
        checked.value = true;
      } else if (value.saleTime) {
        pickTime.value = dayjs(value.saleTime);
        checked.value = true;
      }
    } else {
      pickTime.value = undefined;
      checked.value = false;
    }
  }

  function updateValue() {
    let time: SaleTimeModel | null = null;
    if (checked.value) {
      time = {};
      if (pickTime.value) {
        const d = getResult(pickTime.value);
        if (props.saleStatus === statusType.on) {
          time.closeTime = d;
        } else {
          time.saleTime = d;
        }
      }
    }
    emit('update:value', time);
    emit('change', time);
  }

  function onOk() {
    updateValue();
  }
</script>
