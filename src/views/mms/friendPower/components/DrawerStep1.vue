<template>
  <BasicForm @register="registerForm">
    <template #initiatorAward="{ model, field }">
      <AwardInput
        ref="initiatorAwardRef"
        v-model:value="model[field]"
        :readonly="!isReadonly"
        rowType="checkbox"
        @change="validateFields(['initiatorAward'])"
      />
    </template>
    <template #friendAward="{ model, field }">
      <AwardInput
        ref="friendAwardRef"
        v-model:value="model[field]"
        :readonly="!isReadonly"
        rowType="checkbox"
        @change="validateFields(['friendAward'])"
      />
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaStep1 } from '../data';
  import AwardInput from './AwardInput.vue';

  defineProps({
    editData: {
      type: Object,
    },
    isReadonly: { type: Boolean, default: false },
  });

  const initiatorAwardRef = ref<any>(null);
  const friendAwardRef = ref<any>(null);

  //表单
  const [
    registerForm,
    {
      resetFields,
      setFieldsValue,
      validate,
      getFieldsValue,
      clearValidate,
      updateSchema,
      validateFields,
    },
  ] = useForm({
    labelWidth: 140,
    schemas: formSchemaStep1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  function initData() {
    initiatorAwardRef.value?.initData ? initiatorAwardRef.value?.initData() : '';
    friendAwardRef.value?.initData ? friendAwardRef.value?.initData() : '';
  }

  defineExpose({
    resetFields,
    setFieldsValue,
    validate,
    getFieldsValue,
    clearValidate,
    updateSchema,
    initData,
  });
</script>

<style lang="less" scoped></style>
