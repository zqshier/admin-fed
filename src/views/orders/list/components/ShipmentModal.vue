<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="发货"
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
  import { deliveryList } from '../data';
  import { ordersShip } from '/@/api/app/orders';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const formSchemas: FormSchema[] = [
    {
      required: true,
      field: 'logisticsCode',
      label: '物流公司',
      component: 'ApiSelect',
      componentProps: {
        api: () => {
          return {
            list: deliveryList,
          };
        },
        immediate: false,
        resultField: 'list',
        valueField: 'code',
        labelField: 'name',
      },
      itemProps: {
        autoLink: false,
      },
    },
    {
      required: true,
      field: 'logisticsNo',
      label: '物流单号',
      component: 'Input',
    },
  ];

  interface OpenDataModel {
    row?: Recordable;
    ids: number[];
    orderNos: string[];
    onSuccess?: () => void;
  }

  let openData: OpenDataModel;

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data: OpenDataModel) => {
    resetFields();
    //弹窗传入数据
    openData = data;
    console.log(openData);
  });

  const [registerForm, { validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: formSchemas,
    showActionButtonGroup: false,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      await ordersShip({
        parcelNo: null,
        orderNo: openData.orderNos[0],
        logisticsNo: values.logisticsNo,
        logisticsCode: values.logisticsCode,
      });
      closeModal();
      openData.onSuccess?.();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
