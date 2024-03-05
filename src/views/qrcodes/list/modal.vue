<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { qrcodesCreate as createApi, qrcodesUpdate as updateApi } from '/@/api/app/qrcodes';
  import { QrcodesModel } from '/@/api/app/model/qrcodesModel';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: string;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
      labelWidth: 140,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  //弹窗
  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({ ...data.record });
    }

    updateSchema({ field: 'page', dynamicDisabled: isUpdate.value });
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      setModalProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //todo: 编辑接口
        console.log(updateId);
        result = await updateApi(Number(updateId), { ...values } as QrcodesModel);
      } else {
        //新增
        result = await createApi({ ...values } as QrcodesModel);
      }

      closeModal();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
