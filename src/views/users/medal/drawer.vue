<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="80%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #kindsSlot="{ model, field }">
        <kinds-input v-model:value="model[field]" :disabled="isUpdate" />
      </template>
      <template #demandSlot="{ model, field }">
        <MedalInput
          v-model:value="model[field]"
          :group="model['group']"
          ref="medalInputRef"
          :disabled="isUpdate"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { getYear } from 'date-fns';
  import dayjs from 'dayjs';
  import { EMedalsConfigsGroup, IMedalsConfigsParams } from '/@/api/app/model/medalsModel';
  interface IDefaults extends IMedalsConfigsParams {
    year?: Date;
    kindId?: number;
  }
</script>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import MedalInput from './components/MedalInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { medalsConfigs as configApi, medalsConfigsDetail as detailApi } from '/@/api/app/medals';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import KindsInput from '/@/views/goods/list/components/KindsInput.vue';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const updateId = ref<EMedalsConfigsGroup>();
  const record = reactive<any>({});
  const medalInputRef = ref<any>(null);

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
  ] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const defaults: IDefaults = {
    topic: '',
    group: null,
    link: '',
    medals: [],
    grantTips: '',
  };

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();

    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    Object.assign(record, { ...defaults });

    updateSchema([
      { field: 'group', dynamicDisabled: isUpdate.value },
      { field: 'year', dynamicDisabled: isUpdate.value },
    ]);

    if (data.record) {
      let _record = data.record;
      updateId.value = _record?.[primaryKey];
      try {
        const result = await detailApi({ group: updateId.value, subgroup: _record.subgroup });
        result.forEach((i) => {
          if (i?.condition?.year) _record.year = dayjs(new Date(i.condition.year));
          if (i?.condition?.kindId) _record.kindId = i.condition.kindId;
          if (i?.link) _record.link = i.link;
          if (i?.grantTips) _record.grantTips = i.grantTips;
        });
        _record.medals = result;
      } catch (err) {}

      Object.assign(record, { ..._record });
    }

    console.debug('record', record);
    setFieldsValue(record);
    clearValidate();
  });

  async function handleSubmit() {
    // 更新勋章要求列表数据 再校验
    medalInputRef.value?.updateValue && medalInputRef.value?.updateValue();
    try {
      await validate();
      const values = getFieldsValue();
      console.debug('handleSubmit', values);

      setDrawerProps({ confirmLoading: true });

      let result = {};

      // if (unref(isUpdate)) {
      //   // const params = omit(values, ['start', 'end']) as IActiviyParams;
      //   // result = await updateApi(updateId.value as number, params);
      // } else {
      //   const params = { ...values } as IMedalsConfigsParams;
      //   console.debug('params=========>', params);
      //   result = await configApi({ ...params });
      // }
      const params = { ...values } as IDefaults;
      if (params?.year) {
        params.medals = params.medals.map((i) => {
          return {
            ...i,
            condition: { ...i.condition, year: getYear(new Date(params.year!)).toString() },
          };
        });
        delete params.year;
      }

      if (params?.kindId) {
        params.medals = params.medals.map((i) => ({
          ...i,
          condition: { ...i.condition, kindId: params.kindId },
        }));
        delete params.kindId;
      }

      console.debug('params=========>', params);
      result = await configApi({ ...params });

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
