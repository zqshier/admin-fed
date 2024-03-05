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
      <template #tags="{ model, field }">
        <TagsInput v-model:value="model[field]" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema, primaryKey, pageTitle } from './data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { message } from 'ant-design-vue';
  import { TopicsListItem, TopicsTagsItem, topicsCreateOrUpdate } from '/@/api/app/mms';
  import { goodsList } from '/@/api/app/goods';
  import TagsInput from './components/TagsInput.vue';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref<boolean>(true);
  const isReadonly = ref<boolean>(false);
  let updateId: number | undefined;

  //表单
  const [registerForm, { resetFields, setFieldsValue, validate, getFieldsValue }] = useForm({
    labelWidth: 140,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  // 读取最新商品数据合并
  const mapGoods = async (record) => {
    const itemIds: number[] = []; // flatten(record.tags.map((o) => o.items.itemIds));
    for (const t of record.tags) {
      for (const o of t.items) {
        if (o.itemType === 'goods') itemIds.push(o.itemId);
      }
    }
    const { list } = await goodsList({
      ids: itemIds,
      perPage: Math.max(itemIds.length, 20),
      page: 1,
    });
    for (const tag of record.tags) {
      for (const o of tag.items) {
        if (o.itemType !== 'goods') continue;
        const tt = list.find((a) => a.id === o.itemId);
        if (!tt) continue;
        if (!o.image) o.image = tt.image;
        if (!o.name) o.name = tt.name;
      }
    }
  };

  //弹窗
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isReadonly.value = !!data?.isReadonly;

    if (data.record) {
      //数据复制一份来编辑，避免取消后影响列表数据
      data.record = cloneDeep(data.record);
    }

    if (data.record?.tags) {
      await mapGoods(data.record);
    }

    if (unref(isUpdate)) {
      updateId = data.record?.[primaryKey];
      setFieldsValue({
        ...data.record,
      });
    } else {
      updateId = undefined;
    }
  });

  // 弹窗标题
  const title = computed(() => (!unref(isUpdate) ? `添加${pageTitle}` : `编辑${pageTitle}`));

  async function handleSubmit() {
    try {
      await validate();
      const values = getFieldsValue();
      setDrawerProps({ confirmLoading: true });

      const params: TopicsListItem = {
        id: updateId,
        name: values.name,
        code: Date.now() + '',
        start: new Date().toISOString(),
        end: new Date('2099-01-01 00:00:00').toISOString(),
        tags: values.tags.map((item: TopicsTagsItem) => {
          return {
            name: item.name,
            items: item.items,
          };
        }),
      };
      const result = await topicsCreateOrUpdate(params);

      closeDrawer();
      emit('success', { values: { ...result }, isUpdate: unref(isUpdate) });
      message.success('提交成功');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
