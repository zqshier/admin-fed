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
      <template #contentSlot="{ model, field, schema }">
        <DetailEdit
          ref="questionsRef"
          v-model:value="model[field]"
          :disabled="schema.dynamicDisabled"
          @change="validateFields([field])"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { cloneDeep, pick } from 'lodash-es';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import DetailEdit from './components/DetailEdit.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import {
    questionnaireCreate as createApi,
    questionnaireDetail as detailApi,
    questionnaireUpdate as updateApi,
  } from '/@/api/app/article';
  import { IQuestionnaireParams } from '/@/api/app/model/articleModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  interface IRecord {
    id?: number;
  }
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<number>();
  const record = reactive<IRecord>({});
  const questionsRef = ref<any>(null);

  // 弹窗标题
  const title = computed(() => {
    if (unref(isUpdate)) {
      return `编辑${pageTitle}`;
    } else {
      return `添加${pageTitle}`;
    }
  });
  //表单
  const [
    registerForm,
    {
      resetFields,
      setFieldsValue,
      validate,
      validateFields,
      getFieldsValue,
      clearValidate,
      updateSchema,
    },
  ] = useForm({
    labelWidth: 110,
    schemas: formSchema,
    showActionButtonGroup: false,
    showResetButton: true,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(record, { id: 0, title: '', image: '', start: null, end: null, questions: [] });

    updateSchema([{ field: 'questions', dynamicDisabled: isUpdate.value }]);

    if (data.record) {
      let _record = data.record;
      updateId.value = _record?.[primaryKey];
      try {
        const res = await detailApi(updateId.value!);
        console.debug('res', res);
        _record = res;
      } catch (err) {}

      _record = await handleGroupRecord(_record);

      Object.assign(record, { ..._record });
    }

    console.debug('record', record);
    await setFieldsValue(record);
    nextTick(() => {
      questionsRef.value?.initValue ? questionsRef.value.initValue() : '';
    });
    clearValidate();
  });

  async function handleGroupRecord(record: Recordable) {
    if (record?.start) record.start = dayjs(record.start);
    if (record?.end) record.end = dayjs(record.end);

    return record;
  }

  async function handleSubmit() {
    try {
      if (!unref(isUpdate)) await questionsRef.value?.handleValidate();
      await validate();
      const values: IRecord = getFieldsValue();
      console.debug('handleSubmit values', values);
      setDrawerProps({ confirmLoading: true });

      let result = {};
      const params = cloneDeep(values);

      if (unref(isUpdate)) {
        result = await updateApi(
          updateId.value!,
          pick(params, ['title', 'start', 'end']) as IQuestionnaireParams,
        );
      } else {
        result = await createApi({ ...params } as IQuestionnaireParams);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
