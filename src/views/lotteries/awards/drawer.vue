<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="60%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #coupon="{ model, field }">
        <CouponInput v-model:value="model[field]" ref="couponInputRef" :disabled="isUpdate" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import { AwardsType, formSchema, pageTitle, primaryKey } from './data';
  import { awardsCreate as createApi, awardsUpdate as updateApi } from '/@/api/app/lotteries';
  import { AwardsCreateModel, AwardsUpdateModel } from '/@/api/app/model/lotteriesModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import CouponInput from '/@/views/components/CouponInput.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const couponInputRef = ref<any>(null);
  let updateId: number;

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

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      if (data.record.type === AwardsType.money || data.record.type === AwardsType.point) {
        if (data.record.value !== '') {
          data.record.value = Number(data.record.value);
        }
      }
      setFieldsValue({ ...data.record });
      setTimeout(() => {
        couponInputRef.value?.initCouponInfo ? couponInputRef.value.initCouponInfo() : '';
      }, 100);
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.error('values', values);
      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        if (!values.adjustments) {
          values.adjustments = 0;
        }
        result = await updateApi(updateId, { ...values } as AwardsUpdateModel);
      } else {
        //新增
        result = await createApi({ ...values } as AwardsCreateModel);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
