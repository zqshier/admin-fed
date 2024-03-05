<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="900px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import { formSchema, pageTitle } from './data';
  import { UserRightsModel } from '/@/api/app/model/userModel';
  import { userRightsSave as createApi } from '/@/api/app/users';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  const editData = ref({} as UserRightsModel);

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
    isReadonly.value = !!data?.isReadonly;

    if (data.record) {
      setFieldsValue(data.record);
    }

    if (unref(isUpdate)) {
      editData.value = { ...data.record } as UserRightsModel;
    } else {
      editData.value = { enabled: true, position: 0 } as UserRightsModel;
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log('values', values);
      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        result = await createApi({ ...editData.value, ...values } as UserRightsModel);
      } else {
        result = await createApi({ ...editData.value, ...values } as UserRightsModel);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
