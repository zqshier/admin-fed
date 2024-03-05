<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="导出"
    width="800px"
    :minHeight="80"
  >
    <div class="pt-3 pr-3px">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operator'">
            <OperatorInfo type="manager" :id="record.operatorId" />
          </template>
          <template v-if="column.key === 'action'">
            <TableAction :actions="[{ label: '导出', onClick: handleExport.bind(null, record) }]" />
          </template>
        </template>
        <template #toolbar>
          <a-button type="primary" @click="handleExport">导出全部</a-button>
        </template>
      </BasicTable>
    </div>
    <template #footer>
      <a-button @click="closeModal()">取消</a-button>
      <a-button type="primary" @click="closeModal()">返回</a-button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { format } from 'date-fns';
  import { ref } from 'vue';
  import { giftCardsBatchList, giftCardsExport } from '/@/api/app/giftCard';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const cardConfigId = ref<number>(0);

  const columns: BasicColumn[] = [
    {
      title: '增加时间',
      dataIndex: 'createdAt',
      customRender({ text }) {
        if (!text) return '-';
        return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
      },
    },
    { title: '增加数量', dataIndex: 'count' },
    { title: '操作人', dataIndex: 'operator' },
  ];

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    cardConfigId.value = data.id || 0;
    if (getDataSource().length) reload();
  });

  const [registerTable, { getDataSource, reload }] = useTable({
    title: '请选择需要导出的数据',
    api: giftCardsBatchList,
    beforeFetch(params) {
      return { id: cardConfigId.value, params };
    },
    rowKey: 'id',
    columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 220,
    },
    useSearchForm: false,
    clickToRowSelect: false,
  });

  function handleExport(row: Recordable) {
    const batchNo = row.batchNo || '';
    giftCardsExport(cardConfigId.value, { batchNo });
  }
</script>
