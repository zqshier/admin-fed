<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="订单导出"
    width="400px"
    :minHeight="80"
    @ok="handleSubmit"
  >
    <div class="pt-3 pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { exportOrders } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  const formSchemas: FormSchema[] = [
    {
      field: 'mode',
      label: '报表维度',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '订单维度', value: 1 },
          { label: '商品维度', value: 2 },
        ],
      },
    },
  ];

  interface orderFilterParams {
    orderFilterParams: any;
  }
  let props: orderFilterParams;
  const [registerModal, { setModalProps }] = useModalInner((data: orderFilterParams) => {
    //弹窗传入数据
    props = data;
  });
  const [registerForm, { validate }] = useForm({
    labelWidth: 80,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      await exportOrders({ ...values, ...props.orderFilterParams });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
