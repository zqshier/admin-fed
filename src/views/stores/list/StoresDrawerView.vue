<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #district="{ model, field }">
        <DistrictPicker :disabled="true" ref="districtPicker" v-model:value="model[field]" />
      </template>
      <template #upload="{ model, field }">
        <ImageUpload :disabled="true" v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './stores.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import DistrictPicker from './components/DistrictPicker.vue';
  import ImageUpload from '/@/components/ImageUpload/src/ImageUpload.vue';

  defineEmits(['success', 'register']);

  const districtPicker = ref();

  // 弹窗标题
  const title = '查看门店';

  //表单
  const [registerForm, { resetFields, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 80,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    disabled: true,
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false, showCancelBtn: false, okText: '返回' });

    updateSchema({
      field: 'map',
      ifShow: false,
    });

    updateSchema({
      field: 'loca',
      ifShow: false,
    });

    formSchema.forEach((item) => {
      updateSchema({
        field: item.field,
        dynamicDisabled: true,
      });
    });

    setFieldsValue({
      ...data.record,
    });
  });

  async function handleSubmit() {
    closeDrawer();
  }
</script>
