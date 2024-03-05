<template>
  <div class="p-4">
    <PageWrapper contentBackground title="视频号">
      <div class="p-4 w-full">
        <BasicForm @register="registerForm" />
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup name="vChannelIndex">
  import { message } from 'ant-design-vue';
  import { onMounted } from 'vue';
  import { formSchema } from './data';
  import { videoChannelDetail as detailApi, videoChannelEdit as updateApi } from '/@/api/app/deco';
  import { IVideoChannelParams } from '/@/api/app/model/decoModel';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';

  const defaultData = {
    reservationImage: '',
    liveImage: '',
    position: [],
    status: false,
  } as unknown as IVideoChannelParams;

  //表单
  const [registerForm, { validate, getFieldsValue, setFieldsValue, setProps, clearValidate }] =
    useForm({
      labelWidth: 120,
      schemas: formSchema,
      baseColProps: { span: 24 },
      showResetButton: false,
      showSubmitButton: true,
      submitButtonOptions: { text: '保存' },
      submitFunc: onSubmitFunc,
    });

  async function initData() {
    setFieldsValue({ ...defaultData });
    try {
      const result = await detailApi();
      setFieldsValue({ ...result });
    } finally {
      clearValidate();
    }
  }

  // function mapRecord(record: Recordable) {
  //   for (const key of ['start', 'end']) {
  //     if (record[key]) record[key] = dayjs(record[key]).format('YYYY-MM-DD HH:mm:ss');
  //   }
  //   return { ...record };
  // }

  async function onSubmitFunc() {
    await validate();
    setProps({ submitButtonOptions: { loading: true } });
    try {
      const values = getFieldsValue() as IVideoChannelParams;

      console.log('onSubmitFunc params=', values);
      const result = await updateApi(values);
      message.success('保存成功');
      setFieldsValue({ ...result });
    } finally {
      setProps({ submitButtonOptions: { loading: false } });
    }
  }

  onMounted(() => {
    initData();
  });
</script>
