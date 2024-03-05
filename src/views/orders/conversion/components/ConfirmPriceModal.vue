<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="请确定发放积分数量"
    width="400px"
    :minHeight="100"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import {
    EOrderConversionAuditStatus,
    IOrderConversionListItem,
  } from '/@/api/app/model/ordersModel';
  import { orderConversionAudit as auditApi } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const emit = defineEmits(['refresh']);

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'actualIntegral',
      label: '发放积分数',
      component: 'InputNumber',
      componentProps: { min: 1, max: 999999, controls: false, style: { width: '200px' } },
    },
  ];

  let record: IOrderConversionListItem | null = null;

  const [registerForm, { validate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(
    (data: IOrderConversionListItem) => {
      resetFields();
      record = data || null;
      console.debug('record', record);
      setFieldsValue({ actualIntegral: record.predictIntegral || null });
    },
  );

  async function handleSubmit() {
    if (!record) return;
    try {
      const values = await validate();
      console.log(values);
      let { actualIntegral } = values;
      const isAllow = record.auditStatus === EOrderConversionAuditStatus.pending;
      await auditApi({ ids: [record.id], isAllow, actualIntegral });
      message.success(`审核通过成功`);
      emit('refresh');
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
