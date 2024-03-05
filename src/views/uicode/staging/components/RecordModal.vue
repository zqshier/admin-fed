<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="扫码日志"
    :width="1000"
    :showOkBtn="false"
  >
    <div class="p-8px">
      <BasicTable @register="registerTable" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { stagingLogList as listApi } from '/@/api/app/uicode';

  const tableSchema: BasicColumn[] = [
    {
      title: '扫码/删除时间',
      dataIndex: 'datetime',
      customRender({ text }) {
        if (!text) return '-';
        return formatToDateTime(text);
      },
      width: 200,
    },
    {
      title: '操作人',
      dataIndex: 'creator',
      width: 200,
    },
    {
      title: '明码',
      dataIndex: 'sn',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'log',
    },
  ];

  //商品选择表格
  const [registerTable, { reload }] = useTable({
    title: '仅展示当天的扫码日志',
    rowKey: 'id',
    api: listApi,
    beforeFetch(params) {
      return { ...params };
    },
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: false,
    immediate: false,
  });

  const [registerModal] = useModalInner(() => {
    reload();
  });
</script>
