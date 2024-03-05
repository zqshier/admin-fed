<template>
  <div class="detail-edit p-1">
    <div class="item-con-wrap" v-for="(item, index) in detailList" :key="index">
      <div class="flex pb-2">
        <a-checkbox v-model:checked="item.checked" :disabled="true">{{
          item.type === IQuestionnaireItemType.radio && '单选题'
        }}</a-checkbox>
        <a-button
          type="link"
          :disabled="disabled || !item.checked"
          size="small"
          @click="addItem(index)"
          >添加题目</a-button
        >
      </div>
      <div class="flex mb-2" v-for="(itm, idx) in item.formList" :key="itm">
        <div class="flex-1 p-5 form_box mr-10">
          <BasicForm @register="itm.Form[0]" :disabled="disabled">
            <template #title="{ model, field, schema }">
              <Input
                v-model:value="model[field]"
                :maxlength="schema.componentProps.maxlength"
                :show-count="schema.componentProps.showCount"
                placeholder="请输入题目标题"
                @change="getValue"
                :disabled="disabled"
              />
            </template>
            <template #optionsSlot="{ model, field }">
              <BasicTable
                @register="registerTable"
                :data-source="model[field]"
                :columns="columns"
                @edit-end="(event) => onEditChage(event, index, idx)"
              >
                <template #bodyCell="{ column, index: tableIndex }">
                  <template v-if="column.key === 'sort'">
                    <a-button
                      type="link"
                      @click="tableMoveUp(model[field], tableIndex)"
                      :disabled="disabled"
                    >
                      <Icon icon="material-symbols:arrow-upward-rounded" :size="20" />
                    </a-button>
                    <a-button
                      type="link"
                      @click="tableMoveDown(model[field], tableIndex)"
                      :disabled="disabled"
                    >
                      <Icon icon="material-symbols:arrow-downward-rounded" :size="20" />
                    </a-button>
                  </template>
                  <template v-if="column.key === 'action'">
                    <TableAction
                      :actions="[
                        {
                          label: '添加',
                          disabled: disabled || model[field].length === addMax,
                          onClick: handleTableAdd.bind(null, model[field]),
                        },
                        {
                          label: '删除',
                          color: 'error',
                          ifShow: tableIndex !== 0,
                          disabled: disabled || model[field].length <= addMin,
                          popConfirm: {
                            title: '是否确认删除？',
                            confirm: () => model[field].splice(tableIndex, 1),
                          },
                        },
                      ]"
                    />
                  </template>
                </template>
              </BasicTable>
            </template>
          </BasicForm>
        </div>
        <div class="flex w-100px flex-col">
          <a-button class="mb-2" size="small" :disabled="disabled" @click="itemMoveUp(index, idx)"
            >上移</a-button
          >
          <a-button class="mb-2" size="small" :disabled="disabled" @click="itemMoveDown(index, idx)"
            >下移</a-button
          >
          <a-popconfirm title="确认删除？" placement="topRight" @confirm="delItem(index, idx)">
            <a-button size="small" :disabled="disabled">删除题目</a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Checkbox as ACheckbox, Popconfirm as APopconfirm, Input } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import {
    IQuestionnaireItemQuestions,
    IQuestionnaireItemType,
  } from '/@/api/app/model/articleModel';
  import { BasicColumn, FormSchema } from '/@/components/Table';
  interface IDetailList {
    type: IQuestionnaireItemType.radio;
    checked: boolean;
    list: IQuestionnaireItemQuestions[];
    formList: { key: string; Form: UseFormReturnType }[];
  }

  const formSchema: FormSchema[] = [
    {
      required: true,
      field: 'title',
      label: '题目标题',
      component: 'Input',
      componentProps: { maxlength: 20, showCount: true },
      slot: 'title',
    },
    {
      field: 'image',
      label: '图片',
      component: 'ImageUpload',
      componentProps: { accept: 'image/jpeg,image/png,image/gif', maxCount: 1 },
    },
    {
      field: 'options',
      label: '题目选项',
      component: 'Input',
      slot: 'optionsSlot',
      rules: [
        {
          required: true,
          validator(_, value: Recordable[]) {
            if (value?.length < 2 || value?.length > 4)
              return Promise.reject('最少存在2个选项，最多存在4个选项');
            for (const item of value) {
              if (!item?.value) return Promise.reject('请填写题目选项');
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];

  // 公共属性
  const baseFormConfig: Partial<FormProps> = {
    showActionButtonGroup: false,
    labelWidth: 80,
  };

  const columns: BasicColumn[] = [
    { title: '选项', dataIndex: 'value', edit: true, editComponentProps: { maxlength: 10 } },
    { title: '上移下移', dataIndex: 'sort' },
  ];

  const mockDefaultValue = {
    title: '',
    image: '',
    options: [
      { value: '', ext: '' },
      { value: '', ext: '' },
    ],
  };
  const addMin = 2;
  const addMax = 4;
</script>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicForm, FormProps, UseFormReturnType, useForm } from '/@/components/Form/index';
  import Icon from '/@/components/Icon';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  const detailList = ref<IDetailList[]>([
    { type: IQuestionnaireItemType.radio, checked: true, list: [], formList: [] },
  ]);

  const props = defineProps({
    value: {
      type: Array as PropType<any>,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const isUpdateValue = ref(false);
  const emit = defineEmits(['update:value', 'change']);

  const [registerTable] = useTable({
    rowKey: 'id',
    columns,
    pagination: false,
    showIndexColumn: false,
    bordered: true,
    size: 'small',
    actionColumn: { title: '操作', dataIndex: 'action', fixed: undefined },
  });

  function updateValue(value) {
    isUpdateValue.value = true;
    console.debug('DetailEdit value', value);
    emit('update:value', value);
    emit('change', value);

    nextTick(() => (isUpdateValue.value = false));
  }

  async function initValue() {
    console.debug('initValue', props);
    detailList.value = [
      { type: IQuestionnaireItemType.radio, checked: true, list: [], formList: [] },
    ];

    if (props.value) {
      props.value.forEach((item, index) => {
        detailList.value[0].formList.push({
          key: index + '',
          Form: useForm(Object.assign({ schemas: formSchema }, baseFormConfig) as FormProps),
        });
        const maxLen = detailList.value[0].formList.length - 1;

        nextTick(async () => {
          const { setFieldsValue, clearValidate } = detailList.value[0].formList[maxLen].Form[1];
          const value = {
            title: item.title,
            image: item.image,
            options: item.options.map((i) => ({ ext: i.ext, value: i.value })),
          };
          await setFieldsValue(value);
          await clearValidate();
        });
      });
    }

    const _columns = columns;
    for (const column of _columns) {
      if (column?.edit !== undefined) column.edit = !props.disabled;
    }
  }

  const addItem = (index) => {
    detailList.value[index].list.push(cloneDeep(mockDefaultValue));

    detailList.value[index].formList.push({
      key: detailList.value[index].list.length + '',
      Form: useForm(Object.assign({ schemas: formSchema }, baseFormConfig) as FormProps),
    });

    const maxLen = detailList.value[index].formList.length - 1;
    nextTick(async () => {
      const { setFieldsValue, clearValidate } = detailList.value[index].formList[maxLen].Form[1];
      await setFieldsValue(cloneDeep(mockDefaultValue));
      await clearValidate();
    });

    updateValue(detailList.value[index].list);
  };

  const itemMoveUp = (findex: number, index: number) => {
    if (index === 0) return;
    const indexUp = index - 1;
    const arr = detailList.value[findex].list;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];
    const formArr = detailList.value[findex].formList;
    [formArr[indexUp], formArr[index]] = [formArr[index], formArr[indexUp]];
    getValue();
  };

  const itemMoveDown = (findex: number, index: number) => {
    if (index === detailList.value[findex].formList.length - 1) return;
    const indexUp = index + 1;
    const arr = detailList.value[findex].list;
    [arr[indexUp], arr[index]] = [arr[index], arr[indexUp]];
    const formArr = detailList.value[findex].formList;
    [formArr[indexUp], formArr[index]] = [formArr[index], formArr[indexUp]];
    getValue();
  };

  const delItem = (findex: number, index: number) => {
    detailList.value[findex].list.splice(index, 1);
    detailList.value[findex].formList.splice(index, 1);
    getValue();
  };

  const handleTableAdd = (data) => {
    if (!data?.length) return;
    data.push({ name: '' });
  };

  const tableMoveUp = (data, index) => {
    if (index === 0) return;
    const indexUp = index - 1;
    [data[indexUp], data[index]] = [data[index], data[indexUp]];
    getValue();
  };

  const tableMoveDown = (data, index) => {
    if (index === data.length - 1) return;
    const indexUp = index + 1;
    [data[indexUp], data[index]] = [data[index], data[indexUp]];
    getValue();
  };

  async function getValue() {
    let values: Recordable = [];
    try {
      for (const list of detailList.value) {
        for (const item of list.formList) {
          // const { validate, getFieldsValue } = item.Form[1];
          // await validate();
          const { getFieldsValue } = item.Form[1];
          const obj: Recordable = {
            options: [],
            type: list.type,
            ...getFieldsValue(),
          };
          obj.options = obj.options.map((i) => ({ value: i.value || '', ext: i.ext || '' }));
          values.push(obj);
        }
      }
      console.debug('submit values: ', values);
    } catch (e) {
      console.error('getValue values: ', values);
    }
    updateValue(values);
    // return values;
  }

  async function handleValidate() {
    let flag = true;
    try {
      for (const list of detailList.value) {
        for (const item of list.formList) {
          const { validate } = item.Form[1];
          await validate();
        }
      }
    } catch (e) {
      flag = false;
    }
    return flag ? Promise.resolve() : Promise.reject();
  }

  async function onEditChage(_, fIndex, cIndex) {
    const { validate } = detailList.value[fIndex].formList[cIndex].Form[1];
    await validate();
    await getValue();
  }
  defineExpose({ handleValidate, initValue });
</script>
<style lang="less" scoped>
  .form_box {
    border: 1px solid #d9d9d9;
  }
</style>
