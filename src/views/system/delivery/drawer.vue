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
      <template #threshold="{ model, field }">
        <div class="flex items-center">
          <span class="mr-1">订单实付满</span>
          <a-input-number v-model:value="model[field]" style="width: 100px" />
          <span class="ml-1">元包邮</span>
        </div>
      </template>
      <template #rules="{ model, field }">
        <RulesInput v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message, InputNumber as AInputNumber } from 'ant-design-vue';
  import {
    deliveryTemplatesCreate as createApi,
    deliveryTemplatesUpdate as updateApi,
    DeliveryTemplates,
  } from '/@/api/app/system';
  import RulesInput from './components/RulesInput.vue';
  import _ from 'lodash-es';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 100,
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
      setFieldsValue(_.cloneDeep(data.record));
    } else {
      setFieldsValue({ valuationRules: [] });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加模版' : '编辑模版'));

  async function handleSubmit() {
    try {
      await validate();
      const values: DeliveryTemplates = getFieldsValue() as DeliveryTemplates;

      values.valuationType = 1;

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, values);
      } else {
        //新增
        result = await createApi(values);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
