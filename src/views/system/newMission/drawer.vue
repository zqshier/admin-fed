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
      <template #questionnaireSlot="{ model, field, schema }">
        <QuestionnaireInput v-model:value="model[field]" :disabled="schema.dynamicDisabled" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { computed, reactive, ref, unref } from 'vue';
  import QuestionnaireInput from './components/QuestionnaireInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { missionsCreated as createdApi, missionsUpdate as updateApi } from '/@/api/app/mission';
  import {
    MissionEnum as EMissionEnum,
    GroupCode,
    IMission,
    MissionCodeEnum,
    RewardType,
  } from '/@/api/app/model/missionModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  let updateId: number;

  const record = reactive<any>({});
  const defaults = {
    code: undefined,
    type: EMissionEnum.daily,
    name: '',
    image: '',
    desc: '',
    condition: 1,
    rewardType: RewardType.point,
    rewardId: '0',
    rewardValue: '1',
    times: 1,
    disabled: true,
    link: '',
    groupCode: GroupCode.mission,
    groupRelatedId: 0,
    groupName: '任务中心',
    startDate: null,
    endDate: null,
    meta: { placement: [], remind: true, hideAfterComplete: false, targetId: '' },
    jumpLink: '',
  };

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
  ] = useForm({
    labelWidth: 130,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    console.debug('data', data);
    Object.assign(record, { ...defaults });

    updateSchema([
      { field: 'type', dynamicDisabled: isUpdate.value },
      { field: 'code', dynamicDisabled: isUpdate.value },
      { field: 'meta.targetId', dynamicDisabled: isUpdate.value },
    ]);

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
          if (key === 'startDate' || key === 'endDate') {
            record[key] = data.record[key] && dayjs(data.record[key] || data.record[key]);
          } else {
            record[key] = data.record[key];
          }
        }
      }
    }

    console.debug('record', record);
    setFieldsValue({
      ...record,
      '[meta.placement, meta.remind]': [record?.meta.placement, record?.meta.remind],
      jumpLink: record.link,
    });
    clearValidate();
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      setDrawerProps({ confirmLoading: true });
      const params = Object.assign(record, { ...values }) as IMission;

      // 除了浏览页面和上传订单截图获得小火苗任务，其他任务link赋值
      if (![MissionCodeEnum.uploadorder, MissionCodeEnum.pageview].includes(params.code))
        params.link = params.jumpLink;

      delete params.jumpLink;

      console.debug('handleSubmit params=', params);
      // return;
      let result: any = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, params);
      } else {
        //新增
        result = await createdApi(params);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
