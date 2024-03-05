<template>
  <BasicForm @register="registerForm">
    <template #details="{ model, field }">
      <detail-edit v-model:value="model[field]" :show-text-btn="false" />
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaStep2 } from '../data';
  import DetailEdit from '../../../goods/list/components/DetailEdit.vue';
  import { nextTick, onMounted } from 'vue';

  const props = defineProps({
    editData: {
      type: Object,
    },
  });

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchemaStep2,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  onMounted(() => {
    nextTick(() => {
      if (props.editData && props.editData.id) {
        setFieldsValue({ ...props.editData });
      }
    });
  });

  defineExpose({
    resetFields,
    setFieldsValue,
    validate,
    getFieldsValue,
    clearValidate,
  });
</script>
