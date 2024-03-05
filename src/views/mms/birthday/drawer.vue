<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="700px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #award="{ model, field }">
        <AwardInput v-model:value="model[field]" :readonly="!canMofify" />
      </template>
      <template #time="{ model, field }">
        <TimeInput v-model:value="model[field]" :readonly="!canMofify" />
      </template>
      <template #sendTime="{ model, field }">
        <SendTimeInput v-model:value="model[field]" :readonly="!canMofify" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import SendTimeInput from './components/SendTimeInput.vue';
  import TimeInput from './components/TimeInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import {
    birthdayGiftsCreate as createApi,
    birthdayGiftsUpdate as updateApi,
  } from '/@/api/app/mms';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import AwardInput from '/@/views/components/AwardInput.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 110,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const defaults = {
    name: '',
    type: 'point',
    value: '',
    timeType: 'fix',
    start: new Date('1970-01-01 00:00:00'),
    end: new Date('2999-01-01 00:00:00'),
    /** 0 天, 1 月 */
    sendType: 0,
    sendAt: 0,
  };

  const canMofify = ref<boolean>(false);

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    const values = { ...defaults, ...data.record };

    if (data.record) {
      updateId.value = data.record?.[primaryKey];
    }

    if (new Date(values.end).getFullYear() === 2999) {
      values.timeType = 'forever';
      values.start = null;
      values.end = null;
    }

    console.warn('values', values);

    // 活动开始后，时间和奖励不可修改
    if (!unref(isUpdate.value) || !values.start) {
      canMofify.value = true;
    } else {
      canMofify.value = new Date(values.start).getTime() > Date.now();
    }

    setFieldsValue(values);
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      if (values.timeType === 'fix') {
        if (!values.start || !values.end) {
          return message.error('请选择固定时间');
        }
      }

      if (values.timeType === 'forever') {
        values.start = new Date('1970-01-01 00:00:00');
        values.end = new Date('2999-01-01 00:00:00');
      }

      values.sendType = 0;
      values.sendAt = 0;

      console.debug('handleSubmit', values);

      let result = {};

      if (unref(isUpdate)) {
        result = await updateApi(updateId.value as number, values as any);
      } else {
        result = await createApi(values as any);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
