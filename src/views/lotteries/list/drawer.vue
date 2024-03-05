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
      <template #awards="{ model, field }">
        <AwardsInput v-model:value="model[field]" @delete-award="onDeleteAward" />
      </template>
      <template #time="{ model, field }">
        <RangePicker
          v-model:value="model[field]"
          :show-time="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['开始时间', '结束时间']"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { RangePicker, message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { computed, ref, unref } from 'vue';
  import AwardsInput from './components/AwardsInput.vue';
  import { formSchema, pageTitle } from './data';
  import {
    lotteriesCreate as createApi,
    lotteriesDetail,
    lotteriesUpdate as updateApi,
  } from '/@/api/app/lotteries';
  import { LotteriesModel } from '/@/api/app/model/lotteriesModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';

  const emit = defineEmits(['success', 'register']);

  const deleteAwardIds = ref<number[]>([]);
  const isUpdate = ref<boolean>(true);
  let updateId: string;

  //表单
  const [registerForm, { setFieldsValue, validate, getFieldsValue, resetFields }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    deleteAwardIds.value = [];

    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    // const _record: LotteriesModel = {
    //   name: '',
    //   image: '',
    //   start: '',
    //   end: '',
    //   cardImages: [],
    //   awards: [],
    //   disabled: false,
    //   limitPerDay: 0,
    //   limitTotal: 0,
    //   shareTitle: '',
    //   shareImage: '',
    // };
    // // 默认值
    // Object.assign(record.value, { ..._record });

    if (unref(isUpdate)) {
      updateId = data.record?.code;
      const detail = await lotteriesDetail(updateId);
      Object.assign(data.record, detail);

      data.record['[start,end]'] = [];
      if (data.record?.start) {
        data.record['[start,end]'] = [dayjs(data.record.start), dayjs(data.record.end)];
      }

      if (data.record?.cardImages) {
        const image = data.record.cardImages.map((i, idx) => ({ id: idx, url: i }));
        data.record.cardImages = image;
      }

      data.record.awards.sort((a, b) => b.position - a.position);
      setFieldsValue({ ...data.record });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加' + pageTitle : '编辑' + pageTitle));

  function onDeleteAward(id: number) {
    console.debug('onDeleteAward', id);
    deleteAwardIds.value.push(id);
  }

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      // console.debug(values);
      if (!values.awards?.length) {
        return message.error('请配置奖品');
      }

      for (const a of values.awards) {
        if (typeof a.position === 'undefined' || a.position === '' || a.position === null) {
          a.position = 0;
        }
      }

      if (values.cardImages?.length) {
        const images = values.cardImages.map((i) => i.url);
        values.cardImages = images;
      } else {
        values.cardImages = [];
      }

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        // 编辑
        result = await updateApi(updateId, {
          ...values,
          deleteAwardIds: [...deleteAwardIds.value],
        } as LotteriesModel);
      } else {
        // 新增
        result = await createApi({ ...values } as LotteriesModel);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
