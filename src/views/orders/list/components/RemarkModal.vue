<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="备注"
    width="400px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { orderRemark } from '/@/api/app/orders';

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'remark',
      component: 'InputTextArea',
      label: '备注',
      componentProps: {
        rows: 4,
      },
    },
  ];

  const [registerForm, { validate, setFieldsValue }] = useForm({
    labelWidth: 60,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });
  const remarkData = {} as { orderNo; success; remark };
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    remarkData.orderNo = data.orderNo;
    remarkData.success = data.success;
    remarkData.remark = data.remark;
    console.log('xxxxx', data.remark);
    setFieldsValue({
      remark: data.remark,
    });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      setModalProps({ confirmLoading: true });
      await orderRemark(remarkData.orderNo, values.remark);
      await remarkData.success();
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
