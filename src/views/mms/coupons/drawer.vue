<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #threshold="{ model, field }">
        <div class="flex items-center">
          <span>满&nbsp;</span>
          <InputNumber
            class="flex-1"
            v-model:value="model[field]"
            :disabled="isReadonly"
            placeholder="请输入使用门槛"
          />
          <span>&nbsp;元</span>
        </div>
      </template>
      <template #condition="{ model, field, schema }">
        <ConditionInput
          :disabled="isReadonly"
          :options="schema.componentProps.options"
          v-model:value="model[field]"
        />
      </template>
      <template #expiration="{ model, field }">
        <ExpirationInput v-model:value="model[field]" :disabled="isReadonly" />
      </template>
      <template #limit="{ model, field }">
        <a-radio-group v-model:value="model[field]" :disabled="isReadonly">
          <a-radio value="2">使用后可领取</a-radio>
          <a-radio value="1">
            <InputNumber v-model:value="days" :disabled="isReadonly" :min="1" />
            天领取1次
          </a-radio>
        </a-radio-group>
      </template>
      <template #limitConfig>
        每用户限领 <InputNumber v-model:value="perUser" :disabled="isReadonly" /> 张
      </template>
      <template #link="{ model, field, schema }">
        <InputNumber
          v-model:value="model[field]"
          :controls="schema.componentProps.controls"
          :placeholder="schema.componentProps.placeholder"
          :max="schema.componentProps.max"
          style="width: 200px"
        />
        <div class="text-xs mt-1 text-gray-500">为空时默认跳转商城，输入商品ID即可跳转</div>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Radio as ARadio, RadioGroup as ARadioGroup, InputNumber, message } from 'ant-design-vue';
  import { computed, ref, unref } from 'vue';
  import ConditionInput from './components/ConditionInput.vue';
  import ExpirationInput from './components/ExpirationInput.vue';
  import { formSchema, primaryKey } from './data';
  import { couponsCreate as createApi, couponsUpdate as updateApi } from '/@/api/app/mms';
  import { CouponsListItem } from '/@/api/app/model/mmsModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: number;

  const days = ref<number>();
  const perUser = ref<number>();

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema }] =
    useForm({
      labelWidth: 100,
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

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({ ...data.record });
      days.value = data.record?.limitConfig?.days;
      perUser.value = data.record?.limitConfig?.perUser;
    }

    for (const s of formSchema) {
      if (s.field === 'rules') continue;
      updateSchema({ field: s.field, dynamicDisabled: isReadonly.value });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加优惠券' : '编辑优惠券'));

  async function handleSubmit() {
    try {
      // console.log(getFieldsValue());
      await validate();
      const values = getFieldsValue();

      values.limitConfig = { days: unref(days), perUser: unref(perUser) };
      if (!values.rules) values.rules = '';

      console.debug('handleSubmit', values);

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, values as CouponsListItem);
      } else {
        //新增
        result = await createApi(values as CouponsListItem);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
