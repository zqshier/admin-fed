<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="30%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { createRoles, updateRoles } from '/@/api/sys/role';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useUserStore } from '/@/store/modules/user';

  const emit = defineEmits(['success', 'register']);

  const rowData = ref({ domainId: '0', appId: '0' });
  const isUpdate = ref<boolean>(true);
  let updateId: string;

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
      setFieldsValue({ ...data.record });
      rowData.value = { ...data.record };
    } else {
      const userStore = useUserStore();
      const userInfo = userStore.getUserInfo || {};
      rowData.value = { domainId: userInfo.domainId, appId: userStore.getAppId };
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue() as { name: string; remark: string };
      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateRoles(updateId, {
          ...values,
          domainId: rowData.value.domainId,
          appId: rowData.value.appId,
        });
      } else {
        //新增
        result = await createRoles({
          ...values,
          domainId: rowData.value.domainId,
          appId: rowData.value.appId,
          menuIds: [],
          apiIds: [],
        });
      }

      closeDrawer();
      console.log('result', result);
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
