<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="1000px"
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
  import { productsCreate as createApi, productsUpdate as updateApi } from '/@/api/app/uicode';
  import { IProductsParams } from '/@/api/app/model/uicodeModel';

  type IRecord = IProductsParams;

  const recordDefault: IRecord = {
    id: 0,
    code: '',
    barcode: '',
    name: '',
    status: '',
    price: '',
    name_e: '',
    type1: '',
    type2: '',
    type3: '',
    type4: '',
    photos: '',
    qrPhoto: '',
    source: '',
    subtype: '',
    baseModel: '',
    applyType: '',
    surface: '',
    decoration: '',
    lifeCycle: '',
    place: '',
    launchYear: '',
    launchMonth: '',
    channel: '',
    isBaseModel: '',
    onSale: '',
    launchDate: '',
  };

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<IRecord>({} as IRecord);

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 110,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 12 },
    });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(record, { ...recordDefault } as IRecord);

    if (data.record) {
      Object.assign(record, data.record);
      updateId.value = data.record?.[primaryKey];
    }

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

      const params = { ...values };
      if (params['price']) params['price'] = params['price'] + '';

      let result = {};

      if (unref(isUpdate)) {
        result = await updateApi(updateId.value!, { ...params } as IRecord);
      } else {
        result = await createApi(pickBy({ ...params }) as IRecord);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
