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
        <AwardInput v-model:value="model[field]" />
      </template>
      <template #tags="{ model, field }">
        <TagsInput v-model:value="model[field]" />
      </template>
      <template #importPhone="{ model, field }">
        <ImportPhone v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle, ReceiveTypeEnum } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import AwardInput from './components/AwardInput.vue';
  import TagsInput from './components/TagsInput.vue';
  import ImportPhone from './components/ImportPhone.vue';
  import { tasksCreate as createApi } from '/@/api/app/task';

  //todo: 添加接口
  // const createApi = (_values: any) => Promise.resolve({});
  // const updateApi = (_id: number, _values: any) => Promise.resolve({});

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

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // 默认值
    Object.assign(
      {
        type: '',
        value: '',
        receiveType: ReceiveTypeEnum.tag,
        name: '',
        tagIds: '',
        file: '',
      },
      data.record,
    );

    if (data.record) {
      updateId.value = data.record?.[primaryKey];
      setFieldsValue(data.record);
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log('values', values);
      setDrawerProps({ confirmLoading: true });

      if (values.receiveType !== ReceiveTypeEnum.phone) {
        delete values['file'];
      } else {
        delete values['tagIds'];
      }

      const result = await createApi(values as any);
      // let result = {};

      // if (unref(isUpdate)) {
      //   result = await updateApi(updateId.value as number, values as any);
      // } else {
      //   result = await createApi(values as any);
      // }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
