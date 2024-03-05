<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operatorUser' && record.userId">
          <OperatorInfo type="user" :id="record.userId" />
        </template>
        <template v-if="column.dataIndex === 'operatorBindUser' && record.bindUserId">
          <OperatorInfo type="user" :id="record.bindUserId" />
        </template>
        <template v-if="column.key === 'remarkSlot'">
          <a-button type="link" @click="handleRemark(record)">编辑</a-button>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '激活',
                color: 'success',
                ifShow: [GiftCardStates.unactivated].includes(record.state),
                popConfirm: {
                  title: '是否将该兑换卡激活？激活后该兑换卡可在小程序绑定',
                  confirm: handleOperation.bind(null, record, GiftCardsBatchUpdateType.activate),
                },
              },
              {
                label: '冻结',
                color: 'error',
                ifShow: [GiftCardStates.activated, GiftCardStates.bound].includes(record.state),
                popConfirm: {
                  title: '是否将选中的兑换卡冻结？冻结后该兑换卡将在小程序不可用',
                  confirm: handleOperation.bind(null, record, GiftCardsBatchUpdateType.freeze),
                },
              },
              {
                label: '退款',
                color: 'warning',
                ifShow: [
                  GiftCardStates.expired,
                  GiftCardStates.frozen,
                  GiftCardStates.invalid,
                ].includes(record.state),
                onClick: handleOpenRefundModal.bind(null, record),
              },
              {
                label: '解冻',
                color: 'success',
                ifShow: handleShowFrozenBtn(record),
                popConfirm: {
                  title: '是否将选中的兑换卡解冻，解冻后将重新计算使用有效期',
                  confirm: handleOperation.bind(null, record, GiftCardsBatchUpdateType.unfreeze),
                },
              },
              {
                label: '注销',
                color: 'error',
                ifShow: [
                  GiftCardStates.expired,
                  GiftCardStates.frozen,
                  GiftCardStates.invalid,
                ].includes(record.state),
                popConfirm: {
                  title: '是否将选中的兑换卡注销？取消后该兑换卡将不在小程序展示',
                  confirm: handleOperation.bind(null, record, GiftCardsBatchUpdateType.close),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
    <RemarkModal @register="registerRemark" @success="handleSuccess" />
    <NumConfirmModal @register="registerNumConfirm" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="GiftCardQuery">
  import { message } from 'ant-design-vue';
  import NumConfirmModal from '../list/components/NumConfirmModal.vue';
  import RemarkModal from '../list/components/RemarkModal.vue';
  import { columns, primaryKey, searchFormSchema } from './data';
  import { giftCardQueryExport, giftCardQueryList, giftCardsOpt } from '/@/api/app/giftCard';
  import {
    GiftCardOptParams,
    GiftCardQueryListParams,
    GiftCardStates,
    GiftCardsBatchUpdateType,
  } from '/@/api/app/model/giftCardModel';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  let searchParams: GiftCardQueryListParams = { perPage: 10, page: 1 };

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '卡查询',
    api: giftCardQueryList,
    beforeFetch: (params) => {
      searchParams = params;
      return params;
    },
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: true,
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 180,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
    },
  });

  const [registerNumConfirm, { openModal: openNumConfirm }] = useModal();
  const [registerRemark, { openModal: openRemark }] = useModal();

  function handleShowFrozenBtn(row: Recordable) {
    const { state, bindUserId } = row;
    if (state === GiftCardStates.frozen && !bindUserId) return false; // 未绑定的卡无解冻按钮
    return state === GiftCardStates.frozen;
  }

  function handleExport() {
    giftCardQueryExport({ ...searchParams });
  }

  function handleOpenRefundModal(row: Recordable) {
    openNumConfirm(true, { record: { balance: row.balance, amount: '', cardNo: row.cardNo } });
  }

  // 处理备注
  function handleRemark(row: Recordable) {
    let record = { cardNo: row.cardNo };
    if (row?.ext) record = Object.assign(record, row.ext);
    openRemark(true, {
      isUpdate: true,
      cardConfigId: row.cardConfigId,
      cardId: row.id,
      record,
    });
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  // 操作
  async function handleOperation(row: Recordable, type = GiftCardsBatchUpdateType.activate) {
    const id = row.id || 0;
    if (!id) return;

    const params: GiftCardOptParams = { type, cardNo: row.cardNo };

    if (type === GiftCardsBatchUpdateType.activate) {
      params.cardConfigId = row.cardConfigId;
    }
    try {
      const result = await giftCardsOpt(params);
      message.success('操作完成');
      updateTableDataRecord(id, result);
    } catch (error) {
      message.error('操作失败');
    }
  }
</script>
