<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="500px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #tags="{ model, field }">
        <TagsPicker v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { userTagBind } from '/@/api/app/users';
  import { FormSchema } from '/@/components/Table';
  import TagsPicker from './TagsPicker.vue';

  const emit = defineEmits(['success', 'register']);

  // 弹窗标题
  const title = '添加标签';

  let dataInfo: Recordable = {};

  const formSchema: FormSchema[] = [
    {
      required: true,
      field: 'total',
      label: '已选用户',
      component: 'Input',
      ifShow: ({ values }) => !!values.total,
      render: ({ values }) => {
        return values.total;
      },
    },
    {
      required: true,
      field: 'tagIds',
      label: '设置标签',
      component: 'Input',
      slot: 'tags',
      rules: [
        {
          required: true,
          message: '至少选择一个标签',
          validator: (_, value) =>
            !value || value.length == 0 ? Promise.reject() : Promise.resolve(),
        },
      ],
    },
  ];

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerModal, { setModalProps, closeModal, redoModalHeight }] = useModalInner(
    async (data) => {
      resetFields();
      setModalProps({ confirmLoading: false });

      if (data.record) {
        dataInfo = { ...data.record };
        if (dataInfo.info) {
          setFieldsValue({ total: dataInfo.info.nickname });
        } else {
          setFieldsValue({ total: dataInfo.total + '个' });
        }
      }
      nextTick(redoModalHeight);
    },
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      await userTagBind({ userIds: dataInfo.userIds, tagIds: values.tagIds, ...dataInfo.params });
      dataInfo.resolve?.();
      closeModal();
      emit('success');
      message.success('提交成功，异步处理中，请勿重复操作');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
