<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="退款"
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
  import { h } from 'vue';
  import { message } from 'ant-design-vue';
  import { giftCardsRefund } from '/@/api/app/giftCard';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  const schemas: FormSchema[] = [
    {
      field: 'balance',
      label: '卡余额',
      defaultValue: '50',
      component: 'Input',
      render({ model, field }) {
        return h('span', { style: { paddingLeft: '10px' } }, model[field]);
      },
    },
    {
      field: 'amount',
      label: '退款金额',
      component: 'InputNumber',
      componentProps: { min: 0 },
    },
  ];

  let cardNo = '';
  const emit = defineEmits(['success']);

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    cardNo = data.record?.cardNo || '';
    setFieldsValue({ ...data.record });
  });

  const [registerForm, { validate, setFieldsValue }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
    schemas,
  });

  async function handleSubmit() {
    if (!cardNo) return;
    try {
      const values = await validate();
      if (!values.amount) return message.warn('请输入退款金额');
      const amount = (+values.amount).toFixed(2);
      const balance = (+values.balance).toFixed(2);
      if (amount !== balance) return message.warn('退款金额必须等于卡余额');
      setModalProps({ confirmLoading: true });
      const result = await giftCardsRefund({ cardNo, amount });
      message.success('操作退款成功');
      emit('success', { values: { ...result }, isUpdate: true });
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
