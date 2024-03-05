<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #content="{ model, field }">
        <TypeContent v-model:value="model[field]" />
      </template>
      <template #meta="{ model, field }">
        <MetaInput v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle, documentCode } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { contentsSave } from '/@/api/app/deco';
  import TypeContent from './components/TypeContent.vue';
  import MetaInput from './components/MetaInput.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: number | undefined;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
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
    isReadonly.value = !!data?.isReadonly;

    if (data.record) {
      setFieldsValue(data.record);
    }

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
    } else {
      updateId = undefined;
    }

    updateSchema({
      field: 'code',
      dynamicDisabled: unref(isUpdate),
    });
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      const result = await contentsSave(documentCode, {
        ...values,
        flag: 'daily',
        id: isUpdate.value ? updateId : undefined,
      });

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
