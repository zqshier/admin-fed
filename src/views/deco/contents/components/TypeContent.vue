<template>
  <div class="pt-1">
    <a-radio-group v-model:value="type" @change="onTypeChange">
      <a-radio :value="item.value" v-for="item in typeList" :key="item.value">{{
        item.label
      }}</a-radio>
    </a-radio-group>
    <div class="mt-2" v-if="type === Types.text">
      <Input.TextArea v-model:value="content" placeholder="请输入" :rows="3" />
    </div>
    <div class="mt-2" v-if="type === Types.image">
      <ImageUpload v-model:value="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RadioGroup as ARadioGroup, Radio as ARadio, Input } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { ImageUpload } from '/@/components/ImageUpload';

  const props = defineProps({
    value: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const type = ref('text');
  const content = ref('');
  const lockUpdate = ref(false);

  enum Types {
    text = 'text',
    image = 'image',
  }

  const typeList = [
    { label: '文字', value: Types.text },
    { label: '图片', value: Types.image },
  ];

  function onTypeChange() {
    content.value = '';
    updateValue();
  }

  function updateValue() {
    let val = [type.value, content.value];
    if (val.some((item) => !item)) val = [];

    lockUpdate.value = true;
    emit('update:value', val);
    emit('change', val);
    setTimeout(() => {
      lockUpdate.value = false;
    }, 100);
  }

  watch(
    () => content.value,
    () => {
      updateValue();
    },
  );

  watch(
    () => type.value,
    () => {
      updateValue();
    },
  );

  watch(
    () => props.value,
    (val) => {
      if (lockUpdate.value) return;
      if (val && val.length === 2) {
        type.value = val[0];
        content.value = typeof val[1] === 'object' ? (val[1] as any).v : val[1];
      } else {
        content.value = '';
      }
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped></style>
