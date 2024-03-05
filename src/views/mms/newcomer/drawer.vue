<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #award="{ model, field }">
        <AwardInput v-model:value="model[field]" :readonly="!canMofify" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import {
    NewcomerGiftsItem,
    newcomerGiftsCreate as createApi,
    newcomerGiftsUpdate as updateApi,
  } from '/@/api/app/mms';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import AwardInput from '/@/views/components/AwardInput.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<{
    id?: number;
    name?: string;
    type?: 'coupon' | 'point';
    value?: string;
    start?: string;
    end?: string;
  }>({});

  // 活动开始后，时间和奖励不可修改
  const canMofify = computed(() => {
    if (!unref(isUpdate) || !record.start) return true;
    return new Date(record.start).getTime() > Date.now();
  });

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
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

    // 默认值
    Object.assign(record, {
      id: 0,
      name: '',
      type: 'point',
      value: '',
      start: '',
      end: '',
    });

    if (isUpdate.value) {
      updateSchema({
        field: '[start,end]',
        dynamicDisabled: () => {
          console.log('canMofify.value', canMofify.value);
          return !canMofify.value;
        },
      });
    }

    if (data.record) {
      Object.assign(record, data.record);
      updateId.value = data.record?.[primaryKey];
    }
    setFieldsValue(record);
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log(values);
      setDrawerProps({ confirmLoading: true });

      let result = {};

      if (unref(isUpdate)) {
        result = await updateApi(updateId.value as number, values as NewcomerGiftsItem);
      } else {
        result = await createApi(values as NewcomerGiftsItem);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
