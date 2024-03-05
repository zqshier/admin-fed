<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="请填写拒绝原因"
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
  import { cnyStoresAudit as auditApi } from '/@/api/app/mms';
  import { ECnyStoreStatus } from '/@/api/app/model/mmsModel';

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'disapproveReason',
      component: 'InputTextArea',
      label: '',
      componentProps: {
        rows: 4,
        maxlength: 50,
        showCount: true,
        placeholder: '可填写拒绝原因（最多50个字）',
      },
    },
  ];

  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 60,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  let openData: Recordable = { id: '', success: () => {} };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    openData = data;
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      const data = Object.assign(openData, values);
      setModalProps({ confirmLoading: true });
      await auditApi(data.id, {
        status: ECnyStoreStatus.disapproved,
        disapproveReason: data.disapproveReason,
      });
      openData.success?.();
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
