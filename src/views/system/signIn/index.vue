<template>
  <div class="p-4">
    <PageWrapper contentBackground title="签到规则">
      <div class="p-4 w-full">
        <BasicForm @register="registerForm">
          <template #rowAwardSlot="{ model, field }">
            <awardInput :value="model[field]" @validate="validateFields([field])" />
          </template>
        </BasicForm>
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { message } from 'ant-design-vue';
  import { ImageInfo } from '/@/components/ImageUploadGroup/src/types';
  interface IData {
    dailyPoints: number | string;
    rules: ImageInfo[];
    continuousRewards: { days: number; points: number }[];
  }
</script>
<script lang="ts" setup name="SignIn">
  import { onMounted } from 'vue';
  import awardInput from './components/AwardInput.vue';
  import { formSchema } from './data';
  import {
    dailySigninConfigsDetail as detailApi,
    dailySigninConfigsUpdate as updateApi,
  } from '/@/api/app/mms';
  import { IDailySigninItem } from '/@/api/app/model/mmsModel';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';

  const defaultData: IData = { dailyPoints: '', rules: [], continuousRewards: [] };

  //表单
  const [
    registerForm,
    { validate, validateFields, getFieldsValue, setFieldsValue, setProps, clearValidate },
  ] = useForm({
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
      setFieldsValue({ ...handleData(result) });
    } finally {
      clearValidate();
    }
  }

  function handleData(data) {
    data.continuousRewards = data.continuousRewards.sort((a, b) => a.days - b.days);
    return {
      dailyPoints: data.dailyPoints + '',
      rules: (data?.rules && data.rules.map((i, index) => ({ id: index, url: i }))) || [],
      continuousRewards: data.continuousRewards,
    } as IData;
  }

  async function onSubmitFunc() {
    await validate();
    setProps({ submitButtonOptions: { loading: true } });
    try {
      const values = getFieldsValue() as IData;
      const params: IDailySigninItem = {
        dailyPoints: +values.dailyPoints,
        rules: (values?.rules && values.rules.map((i) => i.url)) || [],
        continuousRewards: values.continuousRewards.sort((a, b) => a.days - b.days),
      };

      console.log('onSubmitFunc params=', params);
      const result = await updateApi(params);
      message.success('保存成功');
      setFieldsValue({ ...handleData(result) });
    } finally {
      setProps({ submitButtonOptions: { loading: false } });
    }
  }

  onMounted(() => {
    initData();
  });
</script>
