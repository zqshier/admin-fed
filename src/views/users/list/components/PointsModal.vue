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
  import { FormSchema } from '/@/components/Table';
  import TagsPicker from './TagsPicker.vue';
  import { userPointsUpdate } from '/@/api/app/users';

  const emit = defineEmits(['success', 'register']);

  // 弹窗标题
  const title = '修改积分';

  let dataInfo: Recordable = {};

  const formSchema: FormSchema[] = [
    {
      required: true,
      field: 'total',
      label: '已选用户',
      component: 'Input',
      ifShow: ({ values }) => !!values.total,
      render: ({ values }) => {
        return values.total + '个';
      },
    },
    {
      required: true,
      field: 'points',
      label: '修改积分',
      component: 'InputNumber',
      itemProps: {
        tip: '只能输入整数，输入10表示增加10，输入-10表示减少10',
      },
      componentProps: {
        min: -99999,
        max: 99999,
      },
    },
    {
      required: true,
      field: 'remark',
      label: '备注',
      component: 'InputTextArea',
      componentProps: {
        rows: 3,
        placeholder: '最多100个字，需备注增减原因',
      },
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
        setFieldsValue({ total: dataInfo.total });
      }
      nextTick(redoModalHeight);
    },
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      const params = { ...values, userIds: dataInfo.userIds, ...dataInfo.params };
      console.log('handleSubmit', params);
      await userPointsUpdate({
        userId: dataInfo.userIds[0],
        changed: params.points,
        memo: params.remark,
      });
      dataInfo.resolve?.();
      closeModal();
      emit('success');
      message.success('提交成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
