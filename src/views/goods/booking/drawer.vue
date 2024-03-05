<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
    @close="onClose"
  >
    <BasicForm @register="registerForm">
      <template #goods="{ model, field, schema }">
        <GoodsInput
          v-model:value="model[field]"
          :options="schema.componentProps.options"
          :disabled="schema.dynamicDisabled"
          @update:value="validateFields([field])"
        />
      </template>
      <template #templateId="{ model, field }">
        <ASelect
          v-model:value="model[field]"
          :options="wxTemplatesOptions"
          @change="onTemplateChange($event)"
        />
      </template>
      <template #templateData="{ model, field }">
        <TemplateDataInput v-model:value="model[field]" :template="selectTemplate" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  export interface IDefaults extends BookingListItem {
    targetData: { target: EBookingTarget; targetId: string };
  }
</script>
<script lang="ts" setup>
  import { Select as ASelect, message } from 'ant-design-vue';
  import { cloneDeep, get, omit } from 'lodash-es';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import GoodsInput from './components/GoodsInput.vue';
  import TemplateDataInput from './components/TemplateDataInput.vue';
  import { TemplateOptionsModel, formSchema, pageTitle, primaryKey } from './data';
  import {
    bookingCreate as createApi,
    bookingUpdate as updateApi,
    wxTemplatesList,
  } from '/@/api/app/booking';
  import { BookingListItem, EBookingTarget } from '/@/api/app/model/bookingModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  const wxTemplatesOptions = ref<TemplateOptionsModel[]>([]);
  const selectTemplate = ref<TemplateOptionsModel>();

  const defaults: IDefaults = {
    id: 0,
    name: '',
    start: '',
    sendAt: '',
    templateId: '',
    templateData: [],
    target: EBookingTarget.goods,
    targetId: '',
    createdAt: '',
    updatedAt: '',
    disabled: false,
    bookedNumbers: 0,
    bookedBaseNumbers: 0,
    targetData: { target: EBookingTarget.goods, targetId: '' },
  };

  const record = reactive<any>({});

  //表单
  const [
    registerForm,
    {
      resetFields,
      setFieldsValue,
      validate,
      getFieldsValue,
      clearValidate,
      validateFields,
      updateSchema,
    },
  ] = useForm({
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
    Object.assign(record, { ...defaults });

    updateSchema([
      {
        field: 'targetData',
        dynamicDisabled: isUpdate.value,
      },
    ]);

    if (data.record) {
      updateId = data.record?.[primaryKey];
      record.targetData = { target: data.record.target, targetId: data.record.targetId };
      Object.assign(record, { ...data.record });
      setTimeout(() => {
        onTemplateChange(data.record.templateId, data.record.templateData);
      }, 100);
    }
    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      const params = cloneDeep(omit(values, 'targetData'));
      params.target = get(values, 'targetData.target', '');
      params.targetId = get(values, 'targetData.targetId', '');
      setDrawerProps({ confirmLoading: true });
      let result = {};
      if (unref(isUpdate)) {
        //编辑
        if (!values.adjustments) {
          values.adjustments = 0;
        }
        result = await updateApi(updateId, { ...params } as any);
      } else {
        //新增
        result = await createApi({ ...params } as any);
      }

      closeDrawer();
      onClose();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  function onTemplateChange(val: any, templateData = []) {
    const template = wxTemplatesOptions.value.find((item) => item.value === val);
    selectTemplate.value = template;
    setFieldsValue({ templateData });
    nextTick(clearValidate);
  }

  async function initTemplate() {
    const result = await wxTemplatesList();
    wxTemplatesOptions.value = result.map((item) => ({
      label: item.title,
      value: item.priTmplId,
      content: item.content,
      example: item.example,
    }));
  }

  function onClose() {
    selectTemplate.value = undefined;
    resetFields();
    clearValidate();
  }

  initTemplate();
</script>
