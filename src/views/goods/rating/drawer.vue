<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="900px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #GoodsSlot="{ model, field }">
        <GoodsInput
          v-model:value="model[field]"
          :configId="record.id"
          @change="validateFields(['itemIds'])"
        />
      </template>
      <template #valueSlot="{ model, field }">
        <Row>
          <Col :span="8" class="mr-4">
            <a-input
              type="text"
              placeholder="请输入评分标签名称"
              :maxlength="10"
              :showCount="true"
              v-model:value="addValue"
              :disabled="model[field] && model[field]?.length >= 100"
            />
          </Col>
          <Col :span="4">
            <a-button
              type="default"
              @click="handleAddValue(model[field])"
              :disabled="!addValue || model[field].length >= 100"
              >添加</a-button
            >
          </Col>
        </Row>
        <Row>
          <Col>
            <draggable v-model="model[field]" group="people" item-key="id">
              <template #item="{ element }">
                <Row class="mt-2">
                  <Col :span="10">
                    <a-input :maxlength="10" :showCount="true" v-model:value="element.name">
                      <template #addonBefore>
                        <Icon icon="prime:align-left" color="#888888" size="24" />
                      </template>
                      <template #addonAfter>
                        <a-popconfirm
                          @confirm="delItem(model[field], element.name)"
                          :title="`确认删除？`"
                        >
                          <a-button type="link" size="small">删除</a-button>
                        </a-popconfirm>
                      </template>
                    </a-input>
                  </Col>
                </Row>
              </template>
            </draggable>
          </Col>
        </Row>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Popconfirm as APopconfirm, Col, Row, message } from 'ant-design-vue';
  import { computed, reactive, ref, toRaw, unref } from 'vue';
  import draggable from 'vuedraggable';
  import GoodsInput from './components/GoodsInput.vue';
  import { formSchema, pageTitle, primaryKey } from './data';
  import { ratingCreate as createApi, ratingUpdate as updateApi } from '/@/api/app/goods';
  import { RatingParams } from '/@/api/app/model/goodsModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import Icon from '/@/components/Icon';

  const emit = defineEmits(['success', 'register']);

  let updateId: number;
  const addValue = ref('');
  const isUpdate = ref<boolean>(true);
  const record = reactive<{
    id: number;
    title: string;
    tags: string[];
    disabled: boolean;
    itemIds: number[];
  }>({ id: 0, title: '', tags: [], disabled: true, itemIds: [] });

  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  //表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, validateFields, getFieldsValue, clearValidate },
  ] = useForm({
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

    // 默认值
    Object.assign(record, { id: 0, title: '', tags: [], disabled: true, itemIds: [] });

    if (data.record) {
      // const result = await detailApi(data.record?.[primaryKey]);
      const _record = { ...data.record };
      updateId = _record?.[primaryKey];
      _record.tags = toRaw(_record.tags.map((i) => ({ name: i })));
      _record.itemIds = toRaw(_record.relevanceItems.map((i) => i.itemId));
      Object.assign(record, { ..._record });
    }

    setFieldsValue(record);
    console.debug('record=', record);
    clearValidate();
  });

  function handleAddValue(data) {
    data.push({ name: addValue.value });
    addValue.value = '';
    validateFields(['tags']);
  }

  function delItem(data, name) {
    data.forEach((item, index) => {
      if (item.name === name) {
        data.splice(index, 1);
      }
    });
  }

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();

      // console.debug(values);
      // return;
      setDrawerProps({ confirmLoading: true });

      const params = { ...values };
      params.tags = values.tags.map((i) => i.name);

      let result = {};

      if (unref(isUpdate)) {
        //编辑
        result = await updateApi(updateId, params as RatingParams);
      } else {
        //新增
        result = await createApi(params as RatingParams);
      }

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
