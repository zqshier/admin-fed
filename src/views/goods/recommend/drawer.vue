<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #corGoodsConfig="{ model, field }">
        <GoodsInput v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import GoodsInput from './components/GoodsInput.vue';
  import { formSchema } from './data';
  import {
    goodsRecommendDetail as detailApi,
    goodsRecommendUpdate as updateApi,
  } from '/@/api/app/deco';
  import { IGoodsRecommendParams } from '/@/api/app/model/decoModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const record = reactive<IGoodsRecommendParams>({} as any);
  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: number;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isReadonly.value = !!data?.isReadonly;

    // 默认值
    Object.assign(record, {
      itemId: 0,
      isShow: false,
      sort: 0,
      relationItems: [],
    });

    if (unref(isUpdate)) {
      updateId = data.record?.itemId;

      if (updateId) {
        const result = await detailApi(updateId);
        Object.assign(record, result);
      }
    }

    setFieldsValue(record);
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加猜你喜欢' : '编辑猜你喜欢'));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      if (!values?.relationItems) values.relationItems = [];

      setDrawerProps({ confirmLoading: true });
      const params: IGoodsRecommendParams = { ...values, itemId: updateId };
      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(params);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
