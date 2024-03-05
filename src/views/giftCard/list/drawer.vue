<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { message } from 'ant-design-vue';
  import { pickBy } from 'lodash-es';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { giftCardCreate, giftCardUpdate } from '/@/api/app/giftCard';
  import { GiftCardCreateParams } from '/@/api/app/model/giftCardModel';

  type IRecord = GiftCardCreateParams;

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<IRecord>({} as IRecord);

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
  ] = useForm({
    labelWidth: 110,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(record, {
      name: '',
      value: '',
      expireAfterBound: '',
      expireBeforeBound: '',
    } as unknown as IRecord);

    if (data.record) {
      Object.assign(record, data.record);
      // if (record.expireBeforeBound === 9999) record.expireBeforeBound = '' as unknown as number;
      updateId.value = data.record?.[primaryKey];
    }

    updateSchema([
      {
        field: 'value',
        dynamicDisabled: isUpdate.value,
      },
      {
        field: 'expireBeforeBound',
        dynamicDisabled: isUpdate.value,
      },
      {
        field: 'expireAfterBound',
        dynamicDisabled: isUpdate.value,
      },
    ]);

    console.debug('record', record);

    setFieldsValue(record);
    clearValidate();
  });

  // 弹窗标题
  const title = computed(() => {
    if (unref(isUpdate)) {
      return `编辑${pageTitle}`;
    } else {
      return `添加${pageTitle}`;
    }
  });

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      let result = {};

      if (unref(isUpdate)) {
        result = await giftCardUpdate(updateId.value!, pickBy({ ...values }) as IRecord);
      } else {
        result = await giftCardCreate(pickBy({ ...values }) as IRecord);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
