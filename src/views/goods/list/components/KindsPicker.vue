<template>
  <BasicModal
    @register="registerModal"
    title="选择品类"
    :canFullscreen="false"
    :width="600"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { kindsList as listApi } from '/@/api/app/goods';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';

  const searchSchema: FormSchema[] = [{ field: 'name', label: '品类名称', component: 'Input' }];

  const tableSchema: BasicColumn[] = [{ title: '品类名称', dataIndex: 'name' }];

  let submitCallback: Function;
  let selectId = 0;

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    reload();
    if (data) {
      submitCallback = data.cb;
      selectId = Number(data.id);
    }
    selectId ? setSelectedRowKeys([selectId]) : setSelectedRowKeys([]);
  });

  const [registerTable, { getSelectRows, setSelectedRowKeys, reload }] = useTable({
    title: '',
    rowKey: 'id',
    api: listApi,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'radio' },
    useSearchForm: true,
    immediate: false,
    formConfig: {
      schemas: searchSchema,
      labelWidth: 80,
      baseColProps: { span: 12 },
      actionColOptions: { span: 12 },
    },
  });

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) return message.info('请选择品类');

    if (submitCallback) {
      submitCallback(rows[0]);
    }
    closeModal();
  }
</script>
