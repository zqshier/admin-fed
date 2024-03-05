<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择问卷"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { Tag, message } from 'ant-design-vue';
  import { questionnaireStatus } from '../article/questionnaire/data';
  import { IQuestionnaireRecordItem } from '/@/api/app/model/articleModel';
  import { formatToDateTime } from '/@/utils/dateUtil';
  export interface GoodsPickData {
    ids?: number[] | string[];
    rows?: IQuestionnaireRecordItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
    disabledIdsFun?: Function;
  }
</script>

<script lang="ts" setup>
  import { h, reactive } from 'vue';
  import { questionnaireList as listApi } from '/@/api/app/article';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    BasicColumn,
    BasicTable,
    FormSchema,
    TableRowSelection,
    useTable,
  } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'radio',
    preserveSelectedRowKeys: true,
  });

  const goodsTableSchema: BasicColumn[] = [
    {
      title: '问卷备注',
      dataIndex: 'title',
    },
    {
      title: '问卷时间',
      dataIndex: 'start',
      customRender: ({ record }: Recordable) =>
        `${formatToDateTime(record.start)} - ${formatToDateTime(record.end)}`,
    },
    {
      title: '问卷状态',
      dataIndex: 'state',
      customRender: ({ value }) => {
        const tag = questionnaireStatus.find((item) => item.value === value);
        return (tag && h(Tag, { color: tag?.color }, () => tag?.label)) || '';
      },
    },
  ];

  const searchSchema: FormSchema[] = [
    {
      field: 'title',
      label: '问卷备注',
      component: 'Input',
    },
  ];

  //商品选择表格
  const [
    registerTable,
    { getSelectRowKeys, setSelectedRowKeys, reload, getDataSource, getSelectRows },
  ] = useTable({
    title: '',
    rowKey: 'id',
    api: listApi,
    columns: goodsTableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    immediate: false,
    useSearchForm: true,
    formConfig: {
      schemas: searchSchema,
      labelWidth: 80,
      baseColProps: { span: 6 },
    },
  });

  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    async (data: GoodsPickData) => {
      await reload();
      if (data) {
        setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
        actions.callback = data.callback;
        if (data.type) rowSelection.type = data.type === 'multiple' ? 'checkbox' : 'radio';
        if (data.disabled) {
          rowSelection.getCheckboxProps = () => ({
            disabled: data.disabled,
          });
          setModalProps({ showOkBtn: !data.disabled });
        }
        if (data.disabledIdsFun) {
          const ids = await data.disabledIdsFun(getDataSource().map((i) => i.id));
          if (!ids?.length) return;
          rowSelection.getCheckboxProps = (record) => {
            return { disabled: ids.includes(record.id) };
          };
        }
      }
    },
  );

  async function handleSubmit() {
    const ids = getSelectRowKeys();

    if (ids.length === 0) return message.info('请先选择问卷');

    const data: GoodsPickData = {
      ids: ids,
      rows: await getSelectRows(),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
