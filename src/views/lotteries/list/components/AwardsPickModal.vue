<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="添加奖品"
    :width="1100"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';

  import { awardsList } from '/@/api/app/lotteries';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from '../../awards/data';

  let submitCallback: Function;

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    if (data) {
      submitCallback = data.cb;
    }
    setSelectedRowKeys([]);
  });

  const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    api: awardsList,
    columns: columns,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      labelWidth: 80,
      baseColProps: {
        span: 8,
      },
      actionColOptions: {
        span: 6,
      },
    },
  });

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      message.info('请选择奖品');
      return;
    }
    if (submitCallback) {
      submitCallback(
        rows.map((item) => {
          const newItem = Object.assign({}, item);
          newItem.awardId = newItem.id;
          delete newItem.id;
          return newItem;
        }),
      );
    }
    closeModal();
  }
</script>
