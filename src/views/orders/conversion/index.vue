<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'id'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.id }}</a-button>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '审核通过',
                ifShow: record.auditStatus === EOrderConversionAuditStatus.pending,
                popConfirm: {
                  title: '是否将该记录审核通过？',
                  confirm: handleAudit.bind(null, record, EOrderConversionAuditStatus.approve),
                },
              },
              {
                label: '审核拒绝',
                color: 'error',
                onClick: handleAudit.bind(null, record, EOrderConversionAuditStatus.reject),
                ifShow: record.auditStatus === EOrderConversionAuditStatus.pending,
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <Popconfirm title="是否将所选的转化记录同意审核吗？" @confirm="handleBatchAgree">
          <a-button type="primary" :disabled="!getSelectRowKeys().length">批量同意</a-button>
        </Popconfirm>

        <a-button type="primary" :disabled="!getSelectRowKeys().length" @click="handleBatchRefuse"
          >批量拒绝</a-button
        >
        <a-button type="primary" @click="handleOpenSetting">订单转化设置</a-button>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>

    <Drawer @register="registerSettingDrawer" />
    <refuseModal @register="registerRefuseModal" @refresh="onRefresh" />
    <ConfirmPriceModal @register="registerComfirmModal" @refresh="onRefresh" />
  </div>
</template>
<script lang="ts" setup name="OrdersConversion">
  import { message, Popconfirm } from 'ant-design-vue';
  import ConfirmPriceModal from './components/ConfirmPriceModal.vue';
  import refuseModal from './components/refuseModal.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { EOrderConversionAuditStatus } from '/@/api/app/model/ordersModel';
  import {
    orderConversionAudit as auditApi,
    orderConversionExport as exportApi,
    orderConversionList as listApi,
  } from '/@/api/app/orders';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();

  const [registerSettingDrawer, { openDrawer: openSettingDrawer }] = useDrawer();
  const [registerRefuseModal, { openModal: openRefuseModal }] = useModal();
  const [registerComfirmModal, { openModal: openComfirmModal }] = useModal();

  const [
    registerTable,
    { getForm, reload, getSelectRowKeys, clearSelectedRowKeys, getSelectRows },
  ] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    rowSelection: { type: 'checkbox' },
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
  });

  // 查看详情
  function handleViewDetail(row: Recordable) {
    go('/orders/conDetail/' + row.id);
  }

  function handleOpenSetting() {
    openSettingDrawer(true, {});
  }

  async function handleAudit(row: Recordable, status: EOrderConversionAuditStatus) {
    // 审核通过
    if (status === EOrderConversionAuditStatus.approve) {
      // 判断该条记录中是否存在"预计发放积分数"
      if (!row.predictIntegral) {
        message.error('请输入实付金额后再次操作');
        return;
      }
      openComfirmModal(true, { ...row });
      return;
    }

    // 审核不通过
    if (status === EOrderConversionAuditStatus.reject) {
      openRefuseModal(true, { ids: [row.id] });
      return;
    }
  }

  async function handleBatchAgree() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) return message.info('请选择转化记录');

    // 检查选择数据 记录中是否存在"预计发放积分数"
    const failRow = getSelectRows().find((i) => !i.predictIntegral);
    if (failRow?.id) {
      message.error(`订单ID${failRow.id} 无实付金额  转化失败`);
      return;
    }

    try {
      await auditApi({ ids: ids.map((i) => +i), isAllow: true });
      message.success('所选的转化记录已全部审核通过！');
      onRefresh();
    } catch (err) {}
  }

  function handleBatchRefuse() {
    openRefuseModal(true, { ids: getSelectRowKeys().map((i) => +i) });
  }

  function onRefresh() {
    clearSelectedRowKeys();
    reload();
  }

  //导出全部
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    if (value['[startTime, endTime]']) {
      const [startTime, endTime] = value['[startTime, endTime]'];
      value.startTime = new Date(startTime);
      value.endTime = new Date(endTime);
      delete value['[startTime, endTime]'];
    }
    exportApi({ ...value });
  }
</script>
<style lang="less" scoped></style>
