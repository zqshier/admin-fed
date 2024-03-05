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
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { createUser, updateUser as updateApi } from '/@/api/sys/role';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
      labelWidth: 100,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    console.log('data', data);

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      const a = data.record.auths?.find((a) => a.identityType === 'pwd');
      const role = data.record.roles?.[0];
      setFieldsValue({
        username: a && a.identifier,
        info: {
          phone: data.record.phone,
          nickname: data.record.nickname,
        },
        role: role?.roleName,
      });
    }

    updateSchema({
      field: 'username',
      dynamicDisabled: unref(isUpdate),
    });

    updateSchema({
      field: 'password',
      required: !unref(isUpdate),
      ifShow: !unref(isUpdate),
    });
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      const { role, ...params } = values;
      const postData = { ...params, roles: [role] };
      console.debug('update user', updateId, postData);
      const result = unref(isUpdate)
        ? await updateApi(updateId, postData)
        : await createUser(postData);
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
      closeDrawer();
    } catch (err) {
      message.error((err as any).message || '保存失败');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
