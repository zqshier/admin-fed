<template>
  <BasicForm @register="registerForm">
    <template #details="{ model, field }">
      <detail-edit v-model:value="model[field]" />
    </template>
    <template #images="{ model, field, schema }">
      <image-upload-group
        v-model:value="model[field]"
        :tip="schema.componentProps.tip"
        @delete="delImage"
      />
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaStep2 } from '../data';
  import DetailEdit from './DetailEdit.vue';
  import { nextTick, onMounted } from 'vue';
  import { ImageUploadGroup } from '/@/components/ImageUploadGroup';

  const props = defineProps({
    editData: {
      type: Object,
    },
  });

  let deleteImages: number[] = [];

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchemaStep2,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  function delImage({ id }) {
    if (id) {
      deleteImages.push(id);
    }
  }

  onMounted(() => {
    nextTick(() => {
      if (props.editData && props.editData.id) {
        setFieldsValue({ ...props.editData });
      }
    });
  });

  defineExpose({
    resetFields: () => {
      deleteImages = [];
      resetFields();
    },
    setFieldsValue,
    validate,
    getFieldsValue,
    clearValidate,
    getDeleteImages: () => deleteImages,
  });
</script>
