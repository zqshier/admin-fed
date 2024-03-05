<template>
  <BasicForm @register="registerForm">
    <template #keywords="{ model, field }">
      <keyword-input v-model:value="model[field]" />
    </template>
    <template #catalog="{ model, field }">
      <catalog-input v-model:value="model[field]" />
    </template>
    <template #propertiesSlot="{ model, field }">
      <PropertiesInput v-model:value="model[field]" :catalogIds="model['catalogIds']" />
    </template>
    <template #cardSlot="{ model, field }">
      <cards-input v-model:value="model[field]" :disabled="!!editData?.id" />
    </template>
    <template #couponSlot="{ model, field }">
      <CouponsInput v-model:value="model[field]" :disabled="!!editData?.id" />
    </template>
    <template #saleTime="{ model, field }">
      <sale-time v-model:value="model[field]" :saleStatus="model['saleStatus']" />
    </template>
    <template #skus="{ model, field }">
      <sku-table v-model:value="model[field]" />
    </template>
    <template #kindsSlot="{ model, field }">
      <kinds-input v-model:value="model[field]" :items="model['kind']" />
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { formSchemaStep1 } from '../data';
  import CardsInput from './CardsInput.vue';
  import CatalogInput from './CatalogInput.vue';
  import CouponsInput from './CouponsInput.vue';
  import KeywordInput from './KeywordInput.vue';
  import KindsInput from './KindsInput.vue';
  import PropertiesInput from './PropertiesInput.vue';
  import SaleTime from './SaleTime.vue';
  import SkuTable from './SkuTable.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';

  defineProps({
    editData: {
      type: Object,
    },
  });

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
  ] = useForm({
    labelWidth: 140,
    schemas: formSchemaStep1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  defineExpose({
    resetFields,
    setFieldsValue,
    validate,
    getFieldsValue,
    clearValidate,
    updateSchema,
  });
</script>

<style lang="less" scoped></style>
