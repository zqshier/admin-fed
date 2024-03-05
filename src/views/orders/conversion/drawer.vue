<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="订单转化设置"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { reactive } from 'vue';
  import { formSchema } from './data';
  import {
    EOrderConversionConfigType,
    IOrderConversionConfigParams,
  } from '/@/api/app/model/ordersModel';
  import {
    orderConversionConfigDetail as detailApi,
    orderConversionConfigSave as updateApi,
  } from '/@/api/app/orders';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  const record = reactive<any>({});

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 150,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  const defaults: IOrderConversionConfigParams = {
    status: true,
    type: EOrderConversionConfigType.payAmountAndRate,
    image: '',
    explainImage: [],
    shareImage: '',
  };

  // 弹窗标题

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async () => {
    resetFields();

    setDrawerProps({ confirmLoading: false });
    Object.assign(record, { ...defaults });

    let _record = {};

    try {
      const res = await detailApi();
      console.debug('conversion detail res=', res);
      _record = res;
    } catch (err) {}

    Object.assign(record, { ..._record });

    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });
      console.debug('handleSubmit', values);

      const params = cloneDeep(values);

      params.explainImage = params.explainImage?.length
        ? (params.explainImage = params.explainImage.map((i, index) => ({
            id: (i?.id && i.id) || index,
            url: i.url,
          })))
        : [];

      await updateApi(params as IOrderConversionConfigParams);

      closeDrawer();
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
