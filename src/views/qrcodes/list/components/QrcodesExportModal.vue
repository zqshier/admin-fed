<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="title"
    width="800px"
    @ok="handleSubmit"
    okText="返回"
  >
    <div ref="wrapEl">
      <div class="text-center">请选择需要导出的链接</div>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '导出',
                  onClick: handleExport.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { timeRender } from '../data';
  import { qrcodesBatchesExport, qrcodesBatchesList } from '/@/api/app/qrcodes';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';

  let recordId = 0;

  //弹窗
  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });
    recordId = data.record.id;
    reload({ page: 1 });
  });

  // 弹窗标题
  const title = '导出';

  const columns: BasicColumn[] = [
    {
      title: '增加时间',
      dataIndex: 'createdAt',
      customRender: timeRender,
    },
    {
      title: '增加数量',
      dataIndex: 'count',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      customRender: ({ record }: Recordable) => {
        return record.operator?.name || '-';
      },
    },
  ];

  const [registerTable, { reload }] = useTable({
    api: qrcodesBatchesList,
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: false,
    showIndexColumn: false,
    useSearchForm: false,
    immediate: false,
    beforeFetch(params) {
      params.id = recordId;
      return params;
    },
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right' },
  });

  async function handleSubmit() {
    closeModal();
  }

  function handleExport(row: Recordable) {
    qrcodesBatchesExport('一物一码' + row.id, recordId, row.id);
  }
</script>
