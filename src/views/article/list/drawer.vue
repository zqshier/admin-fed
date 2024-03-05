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
      <template #usersInfo="{ model, field }">
        <userSelect :disabled="isDisabled" v-model:value="model[field]" />
      </template>
      <template #corGoodsConfig="{ model, field }">
        <GoodsCorPickModal
          :disabled="isDisabled"
          v-model:value="model[field]"
          ref="goodsCorPickModalRef"
        />
      </template>
      <template #editor="{ model, field }">
        <detail-edit
          v-model:value="model[field]"
          :disabled="isReadonly"
          :max-create-text-len="1"
          :max-image-size="10"
          :max-video-size="100"
        />
      </template>
    </BasicForm>
    <template #footer v-if="isReadonly">
      <a-button key="back" @click="closeDrawer">返回</a-button>
      <a-button
        v-if="record.state === AriticleState.pending || record.state === AriticleState.reject"
        type="primary"
        :loading="loading"
        @click="handleOk"
        >审核通过</a-button
      >
      <a-button
        v-if="record.state === AriticleState.pending || record.state === AriticleState.approve"
        type="primary"
        :loading="loading"
        @click="handleCancel"
        >审核拒绝</a-button
      >
    </template>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { message } from 'ant-design-vue';
  import {
    AriticleInfo,
    AriticlePublicType,
    AriticleState,
    relationsDetail,
  } from '/@/api/app/model/articleModel';
  import { articleCreate, articleUpdate, articleStateUpdate } from '/@/api/app/article';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import GoodsCorPickModal from './components/GoodsCorPickModal.vue';
  import userSelect from './components/userSelect.vue';
  import DetailEdit from '../../goods/list/components/DetailEdit.vue';

  interface IRecord {
    id?: number;
    userType?: string;
    title?: string;
    publicType?: AriticlePublicType;
    state?: AriticleState;
    usersInfo?: { ids: number[]; rows: any };
    correlation?: { values: relationsDetail[]; rows: any };
    editor?: any;
  }
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  const isDisabled = ref<boolean>(false);
  const updateId = ref<number>();
  const record = reactive<IRecord>({});
  const loading = ref<boolean>(false);
  const goodsCorPickModalRef = ref<any>(null);

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema, clearValidate },
  ] = useForm({
    labelWidth: 110,
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
    isDisabled.value = isUpdate.value || isReadonly.value;

    // 默认值
    Object.assign(record, {
      id: 0,
      userId: null,
      userType: '',
      title: '',
      correlation: { values: [], rows: null },
      publicType: AriticlePublicType.admin,
      editor: { rows: [], deleteIds: [] },
      state: AriticleState.pending,
      usersInfo: { ids: [], rows: [] },
    });

    updateSchema([
      {
        field: 'title',
        dynamicDisabled: isReadonly.value,
      },
      {
        field: 'state',
        ifShow: isReadonly.value,
      },
    ]);

    if (data.record) {
      Object.assign(record, data.record);
      record.usersInfo!.ids = [data.record.userId];
      record.usersInfo!.rows = [{ userId: data.record.userId, type: data.record.userType }];
      record.editor.rows = data.record.contents.sort((f, l) => f.position - l.position);
      record.correlation!.values = data.record.relations;
      updateId.value = data.record?.[primaryKey];
    }

    if (record.publicType === AriticlePublicType.admin)
      isDisabled.value = isReadonly.value || false;

    setTimeout(() => {
      goodsCorPickModalRef.value?.initGoodsInfo && goodsCorPickModalRef.value.initGoodsInfo();
    }, 100);

    console.debug('record', record);

    setFieldsValue(record);
    clearValidate();
  });

  // 弹窗标题
  const title = computed(() => {
    if (unref(isReadonly)) {
      return `查看${pageTitle}`;
    } else if (unref(isUpdate)) {
      return `编辑${pageTitle}`;
    } else {
      return `添加${pageTitle}`;
    }
  });

  async function handleSubmit() {
    try {
      await validate();
      const values: IRecord = getFieldsValue();
      console.log(values);
      setDrawerProps({ confirmLoading: true });

      let result = {};
      const params: AriticleInfo = {
        title: values.title!,
        relations: values.correlation!.values,
        contents: values.editor.rows.map((item, index) => ({
          content: item.content,
          type: item.type,
          position: index,
          id: item.id,
        })),
        userId: Number(values.usersInfo?.rows.map((i) => i.userId).join()),
        userType: values.usersInfo?.rows.map((i) => i.type).join(),
        publicType: AriticlePublicType.admin,
        deleteContentIds: values.editor.deleteIds,
      };

      if (unref(isUpdate)) {
        result = await articleUpdate(updateId.value!, params);
      } else {
        result = await articleCreate(params);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }

  async function handleOk() {
    loading.value = true;
    const text = '审核通过';
    const state = AriticleState.approve;
    try {
      const result = await articleStateUpdate({ id: record.id!, state: state });
      closeDrawer();
      message.success(`${text}成功`);
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
    } finally {
      loading.value = false;
    }
  }

  async function handleCancel() {
    loading.value = true;
    const text = '审核拒绝';
    const state = AriticleState.reject;
    try {
      const result = await articleStateUpdate({ id: record.id!, state: state });
      closeDrawer();
      message.success(`${text}成功`);
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
    } finally {
      loading.value = false;
    }
  }
</script>
