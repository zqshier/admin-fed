<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="500px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { userTagUpdate, userTagCreate } from '/@/api/app/users';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number | undefined;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (data.record) {
      setFieldsValue({ ...data.record });
    }

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
    } else {
      updateId = undefined;
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await userTagUpdate(updateId as number, values);
      } else {
        //新增
        result = await userTagCreate(values);
      }

      closeModal();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
