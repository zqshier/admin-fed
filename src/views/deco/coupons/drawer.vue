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
      <template #coupon="{ model, field }">
        <CouponList v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import {
    couponsCenterSave as createApi,
    couponsCenterDetail as detailApi,
    CouponsCenterListItem,
    CouponsCenterCoupon,
  } from '/@/api/app/mms';
  import CouponList from './components/CouponList.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
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

    if (data.record) {
      const result = await detailApi(data.record?.[primaryKey]);
      data.record = { ...result, deleteIds: [] };
      setFieldsValue(data.record);
    }

    updateSchema({
      field: 'code',
      dynamicDisabled: () => unref(isUpdate),
    });
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      setDrawerProps({ confirmLoading: true });

      values.list = values.list.map((item: CouponsCenterCoupon) => {
        return {
          id: item.id,
          couponId: item.couponId,
          start: item.start,
          end: item.end,
          position: item.position,
        };
      });

      const result = await createApi(values as CouponsCenterListItem);

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
