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
      <template #config="{ model, field }">
        <GroupUser v-model:value="model[field]" />
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
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message, RangePicker } from 'ant-design-vue';
  import { bannersCreate as createApi, bannersUpdate as updateApi } from '/@/api/app/deco';
  import { BannersListItem } from '/@/api/app/model/decoModel';
  import dayjs from 'dayjs';
  import GroupUser from './components/GroupUser.vue';

  const emit = defineEmits(['success', 'register']);

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

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({
        ...data.record,
        '[start,end]': [dayjs(data.record.start), dayjs(data.record.end)],
      });
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? '添加Banner' : '编辑Banner'));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      if (values.linkType === 'none') values.link = '';

      if (/mp4$/i.test(values.src)) {
        values.srcType = 'video';
      } else {
        values.srcType = 'image';
      }

      setDrawerProps({ confirmLoading: true });

      let result = {};
      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, values as BannersListItem);
      } else {
        //新增
        result = await createApi(values as BannersListItem);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
