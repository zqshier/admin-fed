<template>
  <div>
    <a-radio-group v-model:value="thresholdData.type" @change="updateValue" :disabled="disabled">
      <a-radio :value="EThresholdType.discount">
        <div class="flex items-center">
          <span>满&nbsp;</span>
          <InputNumber
            class="flex-1"
            v-model:value="thresholdData.num"
            :disabled="disabled"
            placeholder="请输入使用门槛"
          />
          <span>&nbsp;元</span>
        </div>
      </a-radio>
      <a-radio :value="EThresholdType.noThreshold">
        <div class="flex items-center mt-3">
          <span>无门槛</span>
        </div>
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { RadioGroup as ARadioGroup, Radio as ARadio, InputNumber } from 'ant-design-vue';

  const props = defineProps({
    value: {
      type: Object as PropType<{ type: EThresholdType; num: number | string }>,
    },
    disabled: { type: Boolean },
  });

  const emit = defineEmits(['update:value', 'change']);

  enum EThresholdType {
    discount = '1',
    noThreshold = '2',
  }

  const thresholdData = ref<{ type: EThresholdType; num: number | string }>({
    type: EThresholdType.discount,
    num: '',
  });

  async function updateValue() {
    let data;
    let { type, num } = thresholdData.value;
    data = { type, num };
    emit('update:value', data);
    emit('change', data);
  }

  function initValue() {
    if (props.value) {
      Object.assign(thresholdData.value, { ...props.value });
    } else {
      thresholdData.value = { type: EThresholdType.discount, num: '' };
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
