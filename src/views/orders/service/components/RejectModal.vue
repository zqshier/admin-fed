<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="拒绝退款"
    width="400px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <div class="mb-2">确认对该订单进行拒绝退款吗？请填写拒绝原因</div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { aftersaleStatusUpdate } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const formSchemas: FormSchema[] = [
    {
      field: 'refuseRemark',
      component: 'InputTextArea',
      label: '',
      componentProps: {
        rows: 4,
        placeholder: '可填写拒绝原因（最多200个字）',
        maxlength: 200,
        showCount: true,
      },
    },
  ];

  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 60,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  let openData: Recordable = { afterSaleNo: '', action: '', success: () => {} };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    openData = { afterSaleNo: '', action: '', success: () => {} };
    resetFields();
    openData = data;
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      setModalProps({ confirmLoading: true });
      await aftersaleStatusUpdate({
        action: openData.action,
        afterSaleNo: openData.afterSaleNo,
        refuseRemark: values.refuseRemark,
      });
      openData.success?.();
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
