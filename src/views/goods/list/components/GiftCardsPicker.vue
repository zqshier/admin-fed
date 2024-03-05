<template>
  <BasicModal @register="registerModal" :canFullscreen="false" :width="900" @ok="handleSubmit">
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import { giftCardList } from '/@/api/app/giftCard';
  import { message } from 'ant-design-vue';

  const searchSchema: FormSchema[] = [
    {
      field: 'name',
      label: '商品名称',
      component: 'Input',
    },
  ];

  const tableSchema: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '卡面值',
      dataIndex: 'value',
    },
    {
      title: '库存',
      dataIndex: 'counter.totalCount',
      customRender: ({ record }: Recordable) => record.counter.totalCount,
    },
  ];

  let submitCallback: Function;
  let selectId = 0;

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (data) {
      submitCallback = data.cb;
      selectId = data.id;
    }
    selectId ? setSelectedRowKeys([selectId]) : setSelectedRowKeys([]);
  });

  const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
    title: '关联兑换卡',
    rowKey: 'id',
    api: giftCardList,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'radio' },
    useSearchForm: true,
    formConfig: {
      schemas: searchSchema,
      labelWidth: 80,
      baseColProps: {
        span: 14,
      },
      actionColOptions: {
        span: 6,
      },
    },
  });

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      message.info('请选择关联卡');
      return;
    }
    if (submitCallback) {
      submitCallback(rows[0]);
    }
    closeModal();
  }
</script>
