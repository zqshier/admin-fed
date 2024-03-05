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
      <template #corGoodsConfig="{ model, field }">
        <GoodsCorPickModal
          ref="goodsCorPickModalRef"
          v-model:value="model[field]"
          :disabled="isReadonly"
          type="checkbox"
          @change="handleGoodsCorPickChange"
        />
        <RelationsTable v-model:value="goodsData" @change="handleRtableChange" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { message } from 'ant-design-vue';
  import { formSchema, primaryKey, pageTitle } from './data';
  import {
    UsersType,
    UsersState,
    UsersInfo,
    relationsDetail,
    UsersListGoodsItem,
  } from '/@/api/app/model/articleModel';
  import { usersCreate, usersDetail, usersUpdate } from '/@/api/app/article';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import GoodsCorPickModal from '../list/components/GoodsCorPickModal.vue';
  import RelationsTable from './components/RelationsTable.vue';

  interface IRecord extends UsersInfo {
    correlation?: { values: relationsDetail[]; rows: any };
  }

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  const updateId = ref<number>();
  const record = reactive<IRecord>({} as any);
  const goodsData = ref<UsersListGoodsItem[]>([]);
  const goodsCorPickModalRef = ref<any>(null);

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, clearValidate, updateSchema },
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

    // 默认值
    Object.assign(record, {
      id: 0,
      userId: 0,
      nickname: '',
      avatar: '',
      type: UsersType.official,
      state: UsersState.enabled,
      description: '',
      goods: [],
      correlation: { values: [], rows: null },
    });
    goodsData.value = [];

    updateSchema([
      {
        field: 'nickname',
        dynamicDisabled: isUpdate.value,
      },
      {
        field: 'avatar',
        dynamicDisabled: isUpdate.value,
      },
      {
        field: 'type',
        dynamicDisabled: isUpdate.value,
      },
    ]);

    if (unref(isUpdate)) {
      const result = await usersDetail(data.record.id);
      Object.assign(record, result);

      updateId.value = result?.[primaryKey];

      goodsData.value = result.goods;
      record.correlation!.values = result.goods.map((item) => ({ type: item.type, v: item.id }));
      // console.debug('usersDetail result', result);
    }

    // if (data.record) {
    //   Object.assign(record, data.record);
    //   // record.correlation!.rows = [data.record.goods];
    //   updateId.value = data.record?.[primaryKey];
    // }

    setTimeout(() => {
      goodsCorPickModalRef.value?.initGoodsInfo && goodsCorPickModalRef.value.initGoodsInfo();
    }, 100);

    setFieldsValue(record);
    if (!isUpdate.value) clearValidate();
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  function handleGoodsCorPickChange(event) {
    goodsData.value = event.rows.map((item) => ({
      type: 'goods',
      id: item.id || 0,
      title: item.name || '',
      image: item.image || '',
    }));
  }

  function handleRtableChange(list) {
    if (list.length === 0) {
      record.correlation ? (record.correlation.rows = []) : '';
      record.correlation ? (record.correlation.values = []) : '';
    } else {
      record.correlation
        ? (record.correlation.values = list.map((item) => ({ type: item.type, v: item.id })))
        : '';
    }
    setFieldsValue(record);
    clearValidate();
  }

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      console.log(values);
      setDrawerProps({ confirmLoading: true });

      let params = { ...values, state: record.state, goods: [] as UsersListGoodsItem[] };
      goodsData.value ? (params.goods = goodsData.value) : '';
      delete params['correlation'];

      let result = {};
      if (unref(isUpdate)) {
        result = await usersUpdate(updateId.value as number, params as UsersInfo);
      } else {
        result = await usersCreate(params as UsersInfo);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
