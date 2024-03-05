<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="1000px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #distributorsSlot="{ model, field }">
        <DealersInput ref="dealersInputRef" v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { pickBy } from 'lodash-es';
  import { computed, reactive, ref, unref } from 'vue';
  import DealersInput from './components/DealersInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { IBatchesParams, IBatchesType } from '/@/api/app/model/uicodeModel';
  import { batchesCreate as createApi } from '/@/api/app/uicode';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  type IRecord = IBatchesParams;

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<IRecord>({} as IRecord);
  const dealersInputRef = ref<any>(null);

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
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

    // 初始化DealersInput组件内部数据
    if (dealersInputRef.value?.initData) dealersInputRef.value?.initData();

    // 默认值
    Object.assign(record, {
      memo: '',
      type: IBatchesType.normal,
      distributors: [],
    } as unknown as IRecord);

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

      console.debug('values', values);
      // return;
      let result = {};

      if (unref(isUpdate)) {
        // result = await updateApi(updateId.value!, pickBy({ ...values }) as IRecord);
      } else {
        result = await createApi(pickBy({ ...values }) as IRecord);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
