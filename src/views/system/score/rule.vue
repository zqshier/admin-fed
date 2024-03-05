<template>
  <div class="p-4">
    <PageWrapper contentBackground title="积分规则">
      <div class="p-4 max-w-800px">
        <BasicForm @register="registerForm">
          <template #amount="{ model, field }">
            <div class="flex items-center">
              <span class="mr-2">每消费</span>
              <a-input-number
                :defaultValue="0"
                :controls="false"
                :min="0"
                :precision="2"
                :stringMode="true"
                class="max-w-80px"
                v-model:value="model[field]"
              />
              <span class="ml-2">元可获得1积分(最多2位小数)</span>
            </div>
          </template>
          <template #points="{ model, field }">
            <div class="flex items-center">
              <a-input-number
                :defaultValue="0"
                :controls="false"
                :min="0"
                :precision="0"
                class="max-w-80px"
                v-model:value="model[field]"
              />
              <span class="ml-2">积分=1元</span>
            </div>
          </template>
          <template #limit="{ model, field }">
            <PercentInput v-model:value="model[field]" />
          </template>
        </BasicForm>
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup>
  import { InputNumber as AInputNumber } from 'ant-design-vue';
  import { onMounted } from 'vue';
  import PercentInput from './components/PercentInput.vue';
  import { getOmsPointsRule, updateOmsPointsRule } from '/@/api/sys/config';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';

  // 表单配置
  const formSchema: FormSchema[] = [
    {
      required: false,
      field: 'amount',
      label: '积分发放',
      component: 'Input',
      slot: 'amount',
      defaultValue: 1,
    },
    {
      required: false,
      field: 'points',
      label: '积分抵扣',
      component: 'Input',
      slot: 'points',
      defaultValue: 100,
    },
    {
      required: false,
      field: 'limit',
      label: '抵扣比例',
      defaultValue: 100,
      component: 'Input',
      slot: 'limit',
    },
  ];

  //表单
  const [registerForm, { validate, getFieldsValue, setFieldsValue, setProps }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    baseColProps: { span: 24 },
    showResetButton: false,
    showSubmitButton: true,
    submitButtonOptions: {
      text: '保存',
    },
    submitFunc: async () => {
      await validate();
      setProps({
        submitButtonOptions: {
          loading: true,
        },
      });
      try {
        const values = getFieldsValue();
        console.log(values);
        await updateOmsPointsRule('pointsRule', values);
        message.success('保存成功');
      } finally {
        setProps({
          submitButtonOptions: {
            loading: false,
          },
        });
      }
    },
  });

  async function initData() {
    const res = await getOmsPointsRule('pointsRule');
    setFieldsValue({ ...res });
  }

  onMounted(() => {
    initData();
  });
</script>
