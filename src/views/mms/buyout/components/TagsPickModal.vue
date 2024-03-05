<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择用户标签"
    :width="800"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerGoodsTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    FormSchema,
    TableRowSelection,
  } from '/@/components/Table';
  import { userTagList as listApi } from '/@/api/app/users';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ success: Function | undefined }>({
    success: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const tableSchema: BasicColumn[] = [
    {
      title: '标签ID',
      dataIndex: 'id',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
    },
    {
      title: '标签定义',
      dataIndex: 'desc',
    },
    {
      title: '标签人数',
      dataIndex: 'num',
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '标签名称',
      component: 'Input',
    },
  ];

  const [registerGoodsTable, { getSelectRowKeys, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    api: listApi,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: true,
    formConfig: {
      schemas: searchGoodsSchema,
      labelWidth: 80,
      baseColProps: {
        span: 12,
      },
    },
  });

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (data) {
      setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
      actions.success = data.success;
    }
  });

  async function handleSubmit() {
    const ids = getSelectRowKeys();
    const data = { ids };
    emit('success', data);
    actions.success?.(data);
    closeModal();
  }
</script>
