<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="订单改价"
    width="500px"
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
  import { ordersModifyAmount } from '/@/api/app/orders';
  import Decimal from 'decimal.js';
  import { isNumber } from '/@/utils/is';
  import { ref } from 'vue';

  const formSchemas: FormSchema[] = [
    {
      field: 'goodsPrice',
      label: '改价前商品价格',
      component: 'Input',
      render: ({ model, field }) => model[field],
    },
    {
      required: true,
      field: 'changeGoodsAmount',
      component: 'InputNumber',
      label: '商品价格修改',
      componentProps: {
        style: 'width:150px;',
        onChange: (value: number) => {
          setFieldsValue({
            newPrice: isNumber(value) ? Decimal.add(changeCostFreight.value, value).toNumber() : '',
          });
        },
      },
      itemProps: {
        tip: '',
      },
    },
    {
      field: 'costFreight',
      label: '改价前运费金额',
      component: 'Input',
      render: ({ model, field }) => {
        return model[field];
      },
    },
    {
      required: true,
      field: 'changeCostFreight',
      component: 'InputNumber',
      label: '运费价格修改',
      componentProps: {
        style: 'width:150px;',
        onChange: (value: number) => {
          setFieldsValue({
            newPrice: isNumber(value) ? Decimal.add(changeGoodsAmount.value, value).toNumber() : '',
          });
        },
      },
      itemProps: {
        tip: '输入修改价格',
      },
    },
    {
      required: true,
      field: 'newPrice',
      component: 'InputNumber',
      label: '应付价格',
      render: ({ model, field }) => model[field],
    },
  ];

  interface OpenDataModel {
    changeAmount: number;
    orderNo: string;
    price: number;
    goodsPrice: number;
    costFreight: number;
    changeCostFreight: number;
    success?: () => void;
  }

  let openData: OpenDataModel;
  const changeGoodsAmount = ref(0);
  const changeCostFreight = ref(0);
  const newPrice = ref(0);
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data: OpenDataModel) => {
    openData = data;
    changeGoodsAmount.value = new Decimal(openData.goodsPrice)
      .add(openData.changeAmount)
      .toNumber();
    changeCostFreight.value = new Decimal(openData.costFreight)
      .add(openData.changeCostFreight)
      .toNumber();
    newPrice.value = openData.price;
    setFieldsValue({
      oldPrice: openData.price,
      goodsPrice: openData.goodsPrice,
      costFreight: openData.costFreight,
      changeGoodsAmount: changeGoodsAmount,
      changeCostFreight: changeCostFreight,
      newPrice: newPrice,
    });
    clearValidate();
  });

  const [registerForm, { validate, setFieldsValue, clearValidate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      if (Number(values.newPrice) <= 0) {
        return message.error('不能将订单金额改为0或负数');
      }
      setModalProps({ confirmLoading: true });
      await ordersModifyAmount(
        openData.orderNo,
        values.changeGoodsAmount,
        values.changeCostFreight,
      );
      openData.success?.();
      closeModal();
    } finally {
      await resetFields();
      setModalProps({ confirmLoading: false });
    }
  }
</script>
