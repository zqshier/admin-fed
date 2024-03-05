<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="优惠券领取记录"
    @ok="closeDrawer"
    :destroyOnClose="true"
    :isDetail="true"
  >
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '作废',
                ifShow: isActiveStatus(record),
                popConfirm: {
                  title: '是否确认后将该优惠券进行作废？',
                  confirm: handleDiscard.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <Popconfirm title="是否将所选的优惠券进行作废？" @confirm="handleBatchDiscard">
          <a-button type="primary" :disabled="!getSelectRowKeys().length">批量作废</a-button>
        </Popconfirm>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message, Popconfirm } from 'ant-design-vue';
  import { nextTick } from 'vue';
  import { receiveCouponColumns as columns, receiveCouponSearchForm as searchForm } from '../data';
  import { couponsDiscard as discardApi, couponsRecords as listApi } from '/@/api/app/mms';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { closeDrawer }] = useDrawerInner(async () => {
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  const [registerTable, { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys }] =
    useTable({
      title: '',
      api: listApi,
      rowKey: 'code',
      columns,
      bordered: true,
      showTableSetting: true,
      immediate: false,
      useSearchForm: true,
      clickToRowSelect: false,
      rowSelection: { type: 'checkbox' },
      showIndexColumn: false,
      formConfig: {
        labelWidth: 100,
        schemas: searchForm,
        resetButtonOptions: { text: '清空' },
        submitButtonOptions: { text: '筛选' },
        baseColProps: { span: 8 },
      },
      actionColumn: { title: '操作', dataIndex: 'action', width: 100 },
    });

  async function handleDiscard(row: Recordable) {
    const { userId, code } = row;
    if (!userId || !code) return;
    return discardApi({ userId, code }).then(() => {
      message.success('作废成功！');
      reload();
    });
  }

  function isActiveStatus(record: Recordable) {
    return record.status === 'active' && !(Date.now() > new Date(record.end).getTime());
  }

  async function handleBatchDiscard() {
    const rows = getSelectRows();
    if (rows.length === 0) return message.info('请选择作废记录');

    // 检查选择数据 是否有作废操作
    const failRow = getSelectRows().find((i) => !isActiveStatus(i));
    if (failRow?.code)
      return message.error(`当前选择优惠券【${failRow.config.name}】不存在作废操作`);

    const promiseAll = rows.map((i) => discardApi({ userId: i.userId, code: i.code }));
    await Promise.all(promiseAll).then(() => {
      message.success('所选的作废记录已全部操作成功！');
      onRefresh();
    });
  }

  function onRefresh() {
    clearSelectedRowKeys();
    reload();
  }

  //todo 导出
  // function handleExport() {}
</script>
