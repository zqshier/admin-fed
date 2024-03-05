<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { catalogsCreate as createApi, catalogsUpdate as updateApi } from '/@/api/app/goods';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isAddChildren = ref<boolean>(false);
  let updateId: number;
  let parentId: number;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
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
    isAddChildren.value = !!data?.isAddChildren;

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({
        ...data.record,
      });
    } else if (unref(isAddChildren)) {
      parentId = data.record?.id;
      setFieldsValue({
        parentName: data.record?.name,
      });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加分组' : '编辑分组'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });

      let result = {} as any;
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, values);
      } else if (unref(isAddChildren)) {
        //新增子类
        result = await createApi({ ...values, parentId });
      } else {
        //新增
        result = await createApi(values);
      }

      // 统一数据类型
      if (typeof result.hidden !== 'undefined') {
        result.hidden = Number(result.hidden);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
