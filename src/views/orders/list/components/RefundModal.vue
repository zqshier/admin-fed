<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="小额补差"
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
  import { message } from 'ant-design-vue';
  import { createInitiativeAfterSale } from '/@/api/app/orders';
  import Decimal from 'decimal.js';
  import { ref } from 'vue';

  let openData = ref({} as OpenDataModel);
  const formSchemas: FormSchema[] = [
    {
      field: 'goodsRefundableAmount',
      label: '可退金额: ',
      component: 'Input',
      render: ({ model, field }) => model[field],
    },
    {
      required: true,
      field: 'refundGoodsAmount',
      component: 'InputNumber',
      label: '退款金额',
    },
    {
      required: true,
      field: 'refundCostFreight',
      component: 'Checkbox',
      defaultValue: true,
      componentProps: {},
      dynamicDisabled: () => {
        console.log(openData);
        return !openData.value['ableCostFreightRefund'];
      },
      label: '是否退运费',
      itemProps: {
        tip: '无可退运费不可选',
      },
    },
  ];

  const [registerForm, { validate, setFieldsValue, clearValidate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  interface OpenDataModel {
    costFrightRefundableAmount: string;
    goodsRefundableAmount: string;
    orderNo: string;
    refundGoodsAmount: string;
    skuId: string;
    userId: string;
    refundCostFreight: boolean;
    success?: () => void;
    ableCostFreightRefund: boolean;
  }

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    openData.value = data;
    openData.value.ableCostFreightRefund = new Decimal(
      openData.value['costFrightRefundableAmount'],
    ).gt(0);
    setFieldsValue({
      ...openData.value,
      refundCostFreight: false,
    });
    clearValidate();
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      const data = Object.assign(openData.value, values);
      if (Number(values.goodsRefundableAmount) < Number(openData.value.refundGoodsAmount)) {
        return message.error('退款金额不能超过最大可退金额');
      }
      setModalProps({ confirmLoading: true });
      data.goodsRefundableAmount = new Decimal(openData.value.goodsRefundableAmount).toString();
      data.refundCostFreight = values.refundCostFreight;
      data.refundGoodsAmount = values.refundGoodsAmount.toString();
      await createInitiativeAfterSale(data);
      openData.value.success?.();
      await resetFields();
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
