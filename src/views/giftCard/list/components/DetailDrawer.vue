<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" :isDetail="true">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
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
        <div class="flex items-center batch_wrap">
          <Popconfirm
            :visible="channelOfflineVisible"
            title="是否将已选择的兑换卡修改为“线下购买”渠道"
            @confirm="handleOfflineChannelBat(true)"
            @visible-change="(bool) => (!bool ? (channelOfflineVisible = false) : '')"
          >
            <a-button type="primary" @click="handleOfflineChannelBat()"
              >批量修改线下购买渠道</a-button
            >
          </Popconfirm>
          <Popconfirm
            :visible="channelGiftVisible"
            title="是否将已选择的兑换卡修改为“礼赠”渠道"
            @confirm="handleGiftsChannelBat(true)"
            @visible-change="(bool) => (!bool ? (channelGiftVisible = false) : '')"
          >
            <a-button type="primary" @click="handleGiftsChannelBat()">批量修改礼赠渠道</a-button>
          </Popconfirm>
        </div>
        <a-button type="primary" @click="handleImport">导入更新</a-button>
        <a-button type="primary" @click="openExport(true, { id: cardId })">导出</a-button>
      </template>
    </BasicTable>
    <ImportCardList @register="registerImportCard" @refresh="reload" />
    <NumConfirmModal @register="registerNumConfirm" @success="handleSuccess" />
    <ExportModal @register="registerExport" />
    <RemarkModal @register="registerRemark" @success="handleSuccess" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { message, Popconfirm } from 'ant-design-vue';
  import { ref } from 'vue';
  import {
    detailColumns as columns,
    primaryKey,
    detaillSearchFormSchema as searchFormSchema,
  } from '../data';
  import { giftCardDetail, giftCardsBatchUpdate, giftCardsOpt } from '/@/api/app/giftCard';
  import {
    GiftCardOptParams,
    GiftCardsBatchUpdateParams,
    GiftCardsBatchUpdateType,
    GiftCardStates,
  } from '/@/api/app/model/giftCardModel';
  // import { drawLotsCodeList, DrawLotsCodeParams, drawLotsExport } from '/@/api/app/mms';
  import ExportModal from './ExportModal.vue';
  import ImportCardList from './ImportCardList.vue';
  import NumConfirmModal from './NumConfirmModal.vue';
  import RemarkModal from './RemarkModal.vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const cardId = ref<number>(0);
  const channelOfflineVisible = ref(false);
  const channelGiftVisible = ref(false);
  // const exportParams = ref<DrawLotsCodeParams>({} as DrawLotsCodeParams);

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    try {
      setDrawerProps({
        loading: true,
        onClose: async () => {},
      });

      if (!cardId.value) {
        cardId.value = data.record.id;
        return;
      }
      cardId.value = data.record.id;
      reload();
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [
    registerTable,
    { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys, updateTableDataRecord },
  ] = useTable({
    api: giftCardDetail,
    beforeFetch(params) {
      // console.debug(params);
      return { id: cardId.value, params };
    },
    showIndexColumn: true,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
    },
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  const [registerImportCard, { openModal: openImportCard }] = useModal();
  const [registerNumConfirm, { openModal: openNumConfirm }] = useModal();
  const [registerExport, { openModal: openExport }] = useModal();
  const [registerRemark, { openModal: openRemark }] = useModal();

  async function handleOfflineChannelBat(next = false) {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选卡号');
    }
    // console.log(getSelectRowKeys());
    // console.log('getSelectRows', getSelectRows());
    channelOfflineVisible.value = true;
    if (next) {
      const cards = getSelectRows().map((row) => ({ channel: '线下购买', cardNo: row.cardNo }));
      const result = await handleCardsBatch({ cards });
      if (result) {
        channelOfflineVisible.value = !channelOfflineVisible.value;
        clearSelectedRowKeys();
      }
    }
  }

  async function handleGiftsChannelBat(next = false) {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选卡号');
    }
    // console.log(getSelectRowKeys());
    channelGiftVisible.value = true;
    if (next) {
      const cards = getSelectRows().map((row) => ({ channel: '礼赠', cardNo: row.cardNo }));
      const result = await handleCardsBatch({ cards });
      if (result) {
        channelGiftVisible.value = !channelGiftVisible.value;
        clearSelectedRowKeys();
      }
    }
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

  // 导入模板
  function handleImport() {
    openImportCard(true, { id: cardId.value });
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

  // 批量修改礼品卡信息
  async function handleCardsBatch(params: GiftCardsBatchUpdateParams) {
    try {
      await giftCardsBatchUpdate(cardId.value, params);
      message.success('操作完成');
      reload();
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  function handleShowFrozenBtn(row: Recordable) {
    const { state, bindUserId } = row;
    if (state === GiftCardStates.frozen && !bindUserId) return false; // 未绑定的卡无解冻按钮
    return state === GiftCardStates.frozen;
  }
</script>

<style lang="less" scoped>
  .batch_wrap {
    flex: 1;
    :deep(.ant-btn) {
      margin-right: 10px;
    }
  }
</style>
