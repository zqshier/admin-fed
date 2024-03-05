<template>
  <BasicForm @register="registerForm">
    <!-- 预约通知 start -->
    <template #bookingTemplateId="{ model, field }">
      <div class="flex items-center">
        <span>模板ID：</span>
        <ASelect
          v-model:value="model[field]"
          :style="{ width: '300px' }"
          :options="wxTemplatesOptions"
        />
      </div>
    </template>
    <template #bookingTemplateData="{ model, field }">
      <TemplateDataInput
        v-model:value="model[field]"
        :template="getSelectTemplate(model['bookingTemplateId'])"
        :valueTypes="['商品名称', '商品价格', '抽签时间']"
      />
    </template>
    <!-- 预约通知 end -->

    <!-- 中奖通知 start -->
    <template #pickOnTemplateId="{ model, field }">
      <div class="flex items-center">
        <span>模板ID：</span>
        <ASelect
          v-model:value="model[field]"
          :style="{ width: '300px' }"
          :options="wxTemplatesOptions"
        />
      </div>
    </template>
    <template #pickOnTemplateData="{ model, field }">
      <TemplateDataInput
        v-model:value="model[field]"
        :template="getSelectTemplate(model['pickOnTemplateId'])"
        :valueTypes="['商品名称', '商品价格', '抽签时间', '抽选结果']"
      />
    </template>
    <!-- 中奖通知 end -->

    <!-- 待支付订单通知 start -->
    <template #waitingPaymentTemplateId="{ model, field }">
      <div class="flex items-center">
        <span>模板ID：</span>
        <ASelect
          v-model:value="model[field]"
          :style="{ width: '300px' }"
          :options="wxTemplatesOptions"
        />
      </div>
    </template>
    <template #waitingPaymentTemplateData="{ model, field }">
      <TemplateDataInput
        v-model:value="model[field]"
        :template="getSelectTemplate(model['waitingPaymentTemplateId'])"
        :valueTypes="['商品名称', '商品价格', '抽签时间', '抽选结果', '中签时间', '公布结果时间']"
      />
    </template>
    <!-- 待支付订单通知 end -->
  </BasicForm>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { Select as ASelect } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchemaStep2 } from '../data';
  import { wxTemplatesList } from '/@/api/app/booking';
  import { TemplateOptionsModel } from '../../../goods/booking/data';
  import TemplateDataInput from '../../../goods/booking/components/TemplateDataInput.vue';

  const props = defineProps({
    editData: {
      type: Object,
    },
  });

  const wxTemplatesOptions = ref<TemplateOptionsModel[]>([]);

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchemaStep2,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  onMounted(() => {
    initTemplate();
    nextTick(() => {
      if (props.editData && props.editData.id) {
        setFieldsValue({ ...props.editData });
      }
    });
  });

  async function initTemplate() {
    const result = await wxTemplatesList();
    wxTemplatesOptions.value = result.map((item) => ({
      label: item.title,
      value: item.priTmplId,
      content: item.content,
      example: item.example,
    }));
  }

  function getSelectTemplate(value: string) {
    const template = wxTemplatesOptions.value.find((item) => item.value === value);
    return template;
  }

  defineExpose({
    resetFields: () => {
      resetFields();
    },
    setFieldsValue,
    validate,
    getFieldsValue,
    clearValidate,
  });
</script>
