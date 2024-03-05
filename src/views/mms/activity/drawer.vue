<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="900px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import dayjs from 'dayjs';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { formSchema, primaryKey, pageTitle } from './data';
  import {
    activityCreate as createApi,
    activityUpdate as updateApi,
    activityDetail as detailApi,
  } from '/@/api/app/activity';
  import { IActiviyListItem, IActiviyParams } from '/@/api/app/model/activityModel';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<any>({});

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
  ] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const defaults: IActiviyListItem = {
    title: '',
    start: null,
    end: null,
    image: '',
    mainImage: [],
    detailImage: [],
    shareImage: '',
    createdAt: null,
    updatedAt: null,
    state: 0,
    sign_up_num: 0,
  };

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();

    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    Object.assign(record, { ...defaults });

    if (data.record) {
      let _record = data.record;
      updateId.value = _record?.[primaryKey];
      try {
        const result = await detailApi(updateId.value!);
        _record = result;
      } catch (err) {}
      if (_record?.start) _record.start = dayjs(_record.start);
      if (_record?.end) _record.end = dayjs(_record.end);

      if (_record?.mainImage)
        _record.mainImage = _record.mainImage.map((i, index) => ({ id: index, url: i }));
      if (_record?.detailImage)
        _record.detailImage = _record.detailImage.map((i, index) => ({ id: index, url: i }));

      Object.assign(record, { ..._record });
    }

    updateSchema([{ field: '[start,end]', dynamicDisabled: isUpdate.value }]);

    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.debug('handleSubmit', values);

      values.mainImage?.length ? (values.mainImage = values.mainImage.map((i) => i.url)) : '';
      values.detailImage?.length ? (values.detailImage = values.detailImage.map((i) => i.url)) : '';

      setDrawerProps({ confirmLoading: true });

      let result = {};

      if (unref(isUpdate)) {
        const params = omit(values, ['start', 'end']) as IActiviyParams;
        result = await updateApi(updateId.value as number, params);
      } else {
        const params = { ...values } as IActiviyParams;
        console.debug('params=========>', params);
        result = await createApi({ ...params });
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
