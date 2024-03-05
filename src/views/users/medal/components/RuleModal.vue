<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    :title="title"
    width="500px"
    :minHeight="60"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { nextTick } from 'vue';
  import {
    medalsSettings as detailApi,
    medalsSettingsUpdate as updateApi,
  } from '/@/api/app/medals';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormSchema } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  // 弹窗标题
  const title = '勋章说明';

  const formSchema: FormSchema[] = [
    {
      field: 'rulesimages',
      label: '勋章说明图片',
      component: 'ImageUploadGroup',
      defaultValue: [],
      componentProps: {
        tip: '图片尺寸建议使用750*X，格式为PNG、JPG、JPEG，大小2M以下，最多可上传9张，可拖拽图片调整显示顺序',
        maxCount: 9,
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
    async () => {
      resetFields();
      setModalProps({ confirmLoading: false });

      let _record;
      try {
        const res = await detailApi();
        console.debug('res', res);
        _record = res;
      } catch (err) {}

      if (_record) {
        setFieldsValue({
          rulesimages: _record?.rulesimages.map((i, index) => ({ id: index, url: i })),
        });
      }

      nextTick(redoModalHeight);
    },
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      const params = { ...values };

      if (params?.rulesimages) params.rulesimages = params.rulesimages.map((i) => i.url);
      console.log('handleSubmit', params);
      await updateApi(params);
      closeModal();
      emit('success');
      message.success('提交成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
