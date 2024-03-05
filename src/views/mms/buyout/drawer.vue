<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="900px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #groupUser="{ model, field }">
        <GroupUser v-model:value="model[field]" />
      </template>
      <template #goods="{ model, field }">
        <GoodsInput v-model:value="model[field]" @remove="onRemoveItem" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import GoodsInput from './components/GoodsInput.vue';
  import GroupUser from './components/GroupUser.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { BuyoutPrice } from '/@/api/app/model/promotionsModel';
  import {
    buyoutPriceCreate as createApi,
    buyoutPriceDetail as detailApi,
    buyoutPriceUpdate as updateApi,
  } from '/@/api/app/promotions';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const deleteSkuIds = ref<{ skuId: number; id: number }[]>([]);
  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: string;

  const onRemoveItem = (rows: { skuId: number; id: number }[]) => {
    console.debug('onRemoveItem rows=', rows);
    for (const row of rows) {
      deleteSkuIds.value.findIndex((i) => i.id === row.id) === -1
        ? deleteSkuIds.value.push(row)
        : '';
    }
    console.debug('deleteSkuIds=', deleteSkuIds.value);
  };

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isReadonly.value = !!data?.isReadonly;
    deleteSkuIds.value = [];

    console.debug(data.record);

    if (data.record) {
      const result = await detailApi(data.record?.[primaryKey]);
      console.log(result);
      Object.assign(data.record, result);
      for (const g of data.record.goods) {
        if (!g.enableLimit) {
          g.quantity = '';
        }
      }
      setFieldsValue(data.record);
    }

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
    } else {
      updateId = '';
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log('values', values);

      for (const g of values.goods) {
        if (
          g.quantity === null ||
          g.quantity === '' ||
          isNaN(Number(g.quantity)) ||
          Number(g.quantity) < 0
        ) {
          g.quantity = 0;
          g.enableLimit = false;
        } else {
          g.enableLimit = true;
        }

        // 如果删除了商品又添加回来，当修改操作
        // console.debug('deleteSkuIds.value', deleteSkuIds.value);
        const dIdx = deleteSkuIds.value.findIndex((i) => i.skuId === g.skuId);
        // console.debug('dIdx', dIdx);
        if (dIdx >= 0) {
          // 合并原数据
          Object.assign(g, { ...deleteSkuIds.value[dIdx], ...g });
          deleteSkuIds.value.splice(dIdx, 1);
        }
      }

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        result = await updateApi(updateId, {
          ...values,
          deleteSkuIds: deleteSkuIds.value.map((i) => i.skuId),
        } as BuyoutPrice);
      } else {
        result = await createApi({ ...values } as BuyoutPrice);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
