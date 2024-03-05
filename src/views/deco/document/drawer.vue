<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #editor="{ model, field }">
        <detail-edit v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { documentsSave as updateApi, documentsShow } from '/@/api/app/deco';
  import DetailEdit from '../../goods/list/components/DetailEdit.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema, clearValidate },
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
    isReadonly.value = !!data?.isReadonly;

    const values = { title: '', editor: { rows: [], deleteIds: [] }, ...data.record };

    if (unref(isUpdate)) {
      try {
        const res = await documentsShow(data.record.code);
        values.editor.rows = res.contents;
        isUpdate.value = true;
      } catch (err) {
        isUpdate.value = false;
      }
    }

    setFieldsValue(values);

    clearValidate();

    updateSchema({
      field: 'code',
      dynamicDisabled: unref(isUpdate) || !!values.code,
    });
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加文档' : '编辑文档'));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log(values);

      setDrawerProps({ confirmLoading: true });

      const result = await updateApi({
        title: values.title,
        code: values.code,
        contents: values.editor.rows,
        deleteIds: values.editor.deleteIds,
      });

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
