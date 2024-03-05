<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operator'">
          <OperatorInfo :type="record.operatorType" :id="record.operator" />
        </template>
        <template v-if="column.dataIndex === 'afterSaleNo'">
          <Button type="link" @click="handleView(record)">
            {{ record.afterSaleNo }}
          </Button>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              // {
              //   label: '查看详情',
              //   onClick: handleView.bind(null, record),
              // },
              {
                label: record.type === AfterSaleType.MONEY_GOODS ? '同意退货退款申请' : '同意退款',
                popConfirm: {
                  title: '确认对该订单进行同意退款吗？',
                  confirm: handleAccept.bind(null, record),
                },
                ifShow: record.status === EAfterSaleStatus.pending,
                color: 'success',
              },
              {
                label: '同意退货退款',
                onClick: handleAcceptShipment.bind(null, record),
                ifShow: record.status === EAfterSaleStatus.pending_shipment,
                color: 'success',
              },
              {
                label: record.type === AfterSaleType.MONEY_GOODS ? '拒绝退货退款申请' : '拒绝退款',
                onClick: handleReject.bind(null, record),
                ifShow: record.status === EAfterSaleStatus.pending,
                color: 'error',
              },
              {
                label: '拒绝退货退款',
                onClick: handleReject.bind(null, record),
                ifShow: record.status === EAfterSaleStatus.pending_shipment,
                color: 'error',
              },
              {
                label: '重试退款',
                onClick: handleRetryRefund.bind(null, record),
                ifShow: record.status === EAfterSaleStatus.refund_pending,
                color: 'warning',
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出报表</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" />
    <RejectModal @register="registerReject" />
  </div>
</template>
<script lang="ts" setup>
  import { Button, message } from 'ant-design-vue';
  import RejectModal from './components/RejectModal.vue';
  import { columns, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import {
    AfterSaleType,
    EAfterSaleLogsAction,
    EAfterSaleStatus,
  } from '/@/api/app/model/ordersModel';
  import {
    aftersaleRetryRefund,
    aftersaleStatusUpdate,
    exportAftersaleList,
    aftersaleList as listApi,
  } from '/@/api/app/orders';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerReject, { openModal: openReject }] = useModal();

  const [registerTable, { reload, getForm }] = useTable({
    title: '退款管理',
    api: listApi,
    afterFetch(list) {
      console.log(list);
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 280,
      ellipsis: true,
    },
    ellipsis: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        span: 24,
      },
      baseColProps: {
        span: 8,
      },
    },
  });

  // 查看详情
  function handleView(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  // 同意退款
  async function handleAccept(row: Recordable) {
    return aftersaleStatusUpdate({ action: 'approve', afterSaleNo: row.afterSaleNo }).then(() => {
      message.success('操作成功');
      reload();
    });
  }

  async function handleAcceptShipment(row: Recordable) {
    return aftersaleStatusUpdate({ action: 'accept_shipment', afterSaleNo: row.afterSaleNo }).then(
      () => {
        message.success('操作成功');
        reload();
      },
    );
  }

  // async function handleRejectShipment(row: Recordable) {
  //   return aftersaleStatusUpdate({ action: 'reject_shipment', afterSaleNo: row.afterSaleNo }).then(
  //     () => {
  //       message.success('操作成功');
  //       reload();
  //     },
  //   );
  // }

  // 拒绝退款
  async function handleReject(row: Recordable) {
    openReject(true, {
      afterSaleNo: row.afterSaleNo,
      action:
        row.status === EAfterSaleStatus.pending
          ? EAfterSaleLogsAction.refuse
          : EAfterSaleLogsAction.reject_shipment,
      success() {
        message.success('操作成功');
        reload();
      },
    });
  }

  // 重试退款
  async function handleRetryRefund(row: Recordable) {
    await aftersaleRetryRefund(row.afterSaleNo);
    message.success('操作成功，短时间内请勿重复操作');
  }

  //导出
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    if (value['[startTime, endTime]']) {
      const [startTime, endTime] = value['[startTime, endTime]'];
      value.startTime = new Date(startTime);
      value.endTime = new Date(endTime);
      delete value['[startTime, endTime]'];
    }
    exportAftersaleList({ ...value });
  }
</script>
