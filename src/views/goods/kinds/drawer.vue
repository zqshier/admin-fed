<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
    @close="onClose"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { computed, reactive, ref, unref } from 'vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { kindsCreate as createApi, kindsUpdate as updateApi } from '/@/api/app/goods';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  const defaults = { name: '', code: '' };

  const record = reactive<any>({});

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
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
    Object.assign(record, { ...defaults });

    if (data.record) {
      updateId = data.record?.[primaryKey];
      Object.assign(record, { ...data.record });
    }
    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      const params = cloneDeep(values);
      setDrawerProps({ confirmLoading: true });
      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, { ...params } as any);
      } else {
        //新增
        result = await createApi({ ...params } as any);
      }

      closeDrawer();
      onClose();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
  function onClose() {
    resetFields();
    clearValidate();
  }
</script>
