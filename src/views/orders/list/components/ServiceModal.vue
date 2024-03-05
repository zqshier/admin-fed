<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="退单"
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
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { AfterSaleType } from '/@/api/app/model/ordersModel';
  import { aftersaleRefundOrder } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  let openData = ref({} as OpenDataModel);
  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'refundCostFreight',
      component: 'Checkbox',
      defaultValue: true,
      componentProps: {},
      label: '是否退运费',
    },
  ];

  const [registerForm, { validate, setFieldsValue, clearValidate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  interface OpenDataModel {
    orderNo: string;
    refundGoodsAmount: string;
    goodsId: number;
    skuId: number;
    userId: number;
    refundCostFreight: boolean;
    success?: () => void;
    goodsInfo: { name: string };
  }

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data);
    openData.value = data;
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
      await aftersaleRefundOrder({
        type: AfterSaleType.MONEY_ONLY,
        isRefundCostFright: !!values.refundCostFreight,
        orderNo: openData.value.orderNo,
        userId: openData.value.userId,
        reason: '后台操作退单',
        items: [
          {
            goodsId: openData.value.goodsId,
            skuId: openData.value.skuId,
            refundGoodsAmount: '0',
          },
        ],
      });

      message.success('退单成功');
      openData.value.success?.();
      await resetFields();
      closeModal();
    } catch (err) {
      const e = err as any;
      message.error((e && e.message) || '退单失败');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
