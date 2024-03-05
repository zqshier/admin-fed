<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { menuCreate as createApi, menuUpdate as updateApi } from '/@/api/app/system';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({
        ...data.record,
      });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, values);
      } else {
        //新增
        result = await createApi(values);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
