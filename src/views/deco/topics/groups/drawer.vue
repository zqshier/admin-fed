<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="800px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #topic="{ model, field }">
        <TopicsInput v-model:value="model[field]" />
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
  import { ref, computed, unref, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message, RangePicker } from 'ant-design-vue';
  import { TopicsGroupsListItem, topicsGroupsCreateOrUpdate } from '/@/api/app/mms';
  import TopicsInput from './components/TopicsInput.vue';
  import dayjs from 'dayjs';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: number | undefined;

  //表单
  const [registerForm, { setFieldsValue, validate, getFieldsValue, updateSchema, clearValidate }] =
    useForm({
      labelWidth: 140,
      schemas: formSchema,
      showActionButtonGroup: false,
      baseColProps: { span: 24 },
    });

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    // resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isReadonly.value = !!data?.isReadonly;

    const values = {
      name: '',
      code: '',
      topicInfo: {
        topicIds: [],
        topics: [],
      },
      '[start,end]': [],
    };

    if (data.record) {
      Object.assign(values, {
        name: data.record.name,
        code: data.record.code,
        topicInfo: {
          topicIds: data.record.topicIds,
          topics: data.record.topics,
        },
        '[start,end]': [dayjs(data.record.start), dayjs(data.record.end)],
      });
    }

    setFieldsValue(values);

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
    } else {
      updateId = undefined;
    }

    updateSchema({
      field: 'code',
      dynamicDisabled: unref(isUpdate),
    });

    nextTick(clearValidate);
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      const params: TopicsGroupsListItem = {
        id: isUpdate.value ? updateId : undefined,
        name: values.name,
        code: values.code,
        start: values.start,
        end: values.end,
        topicIds: values.topicInfo.topicIds,
      };
      console.debug(params);
      const result = await topicsGroupsCreateOrUpdate(params);

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
