<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'value'">
          <div
            ><Tag :key="'value1' + record.id" color="green">满{{ record.threshold }}</Tag></div
          >
          <div
            ><Tag :key="'value2' + record.id" color="red">减{{ record.value }}</Tag></div
          >
        </template>
        <template v-if="column.key === 'status'">
          <Tag :key="'status' + record.id" :color="couponStatusColor(record)">
            {{ couponStatus(record) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                onClick: handleCompile.bind(null, record),
              },
              // {
              //   label: '编辑',
              //   onClick: handleCompile.bind(null, record),
              // },
              {
                label: '分享',
                onClick: handleShare.bind(null, record),
              },
              {
                label: '数据统计',
                onClick: handleRecords.bind(null, record),
              },
              {
                label: '添加库存',
                onClick: handleAddStock.bind(null, record),
              },
              {
                label: '投放',
                ifShow: record.disabled,
                popConfirm: {
                  title: '是否确认投放？',
                  confirm: handleSeton.bind(null, record, false),
                },
              },
              {
                label: '停止投放',
                ifShow: !record.disabled,
                popConfirm: {
                  title: '是否确认停止投放？',
                  confirm: handleSeton.bind(null, record, true),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加优惠券</a-button>
        <a-button type="primary" @click="handleExport">导出</a-button>
        <a-button type="primary" @click="handleShowGetCoupon">优惠券领取记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <ShareModal @register="registerShareModal" />
    <RecordsDrawer @register="registerRecordsDrawer" />
    <ReceiveCouponDrawer @register="registerReceiveCouponDrawer" />
    <BaseNumModal ref="BaseNumModalRef" @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { Tag, message } from 'ant-design-vue';
  import { ref } from 'vue';
  import ReceiveCouponDrawer from './components/ReceiveCouponDrawer.vue';
  import RecordsDrawer from './components/RecordsDrawer.vue';
  import ShareModal from './components/ShareModal.vue';
  import { columns, formSchemaModifyCouponStock, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import {
    couponsUpdateStatus,
    exportConfigs,
    couponsList as listApi,
    couponsUpdate as updateApi,
  } from '/@/api/app/mms';
  import { CouponsListItem } from '/@/api/app/model/mmsModel';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import BaseNumModal, { ModifyInfo } from '/@/views/components/BaseNumModal.vue';

  const BaseNumModalRef = ref();

  const [registerShareModal, { openModal: openShare }] = useModal();
  const [registerModal, { openModal: openAddStockModal }] = useModal();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordsDrawer, { openDrawer: openRecords }] = useDrawer();
  const [registerReceiveCouponDrawer, { openDrawer: openReceiveCoupon }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord, getForm }] = useTable({
    title: '优惠券列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', width: 350 },
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 6 },
    },
  });

  function couponStatusColor(record) {
    if (
      record.expiration &&
      record.expiration.end &&
      Date.now() > new Date(record.expiration.end).valueOf()
    ) {
      return 'red';
    }
    if (record.disabled) return 'orange';
    return 'green';
  }

  function couponStatus(record) {
    if (
      record.expiration &&
      record.expiration.end &&
      Date.now() > new Date(record.expiration.end).valueOf()
    ) {
      return '已过期';
    }
    if (record.disabled) return '未投放';
    return '进行中';
  }

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  //导出
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    exportConfigs(value);
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      isReadonly: true,
      record: row,
    });
  }

  // 分享
  function handleShare(row: Recordable) {
    openShare(true, {
      record: row,
    });
  }

  // 码库
  function handleRecords(row: Recordable) {
    openRecords(true, {
      record: row,
    });
  }

  // 投放
  async function handleSeton(row: Recordable, disabled: boolean) {
    const result = await couponsUpdateStatus(row.id, disabled);
    updateTableDataRecord(result.id, result);
    message.success('操作成功');
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      reload();
    }
  }

  // 优惠券领取
  function handleShowGetCoupon() {
    openReceiveCoupon(true, {});
  }

  // 添加库存
  function handleAddStock(values: Recordable) {
    const { stock, sent } = values;
    const stockCount = +stock - +sent;
    const stateInfo: ModifyInfo = {
      values: { count: stockCount, addCount: '', baseCount: stockCount },
      title: '添加优惠券库存',
      schemas: formSchemaModifyCouponStock,
      ok: null,
      warnTips: '请输入增加库存',
    };
    openAddStockModal(true, {
      ...stateInfo,
      ok: async (row) => {
        console.debug(row);
        try {
          const { addCount = 0 } = row;
          const result = await updateApi(values.id, { stock: +addCount } as CouponsListItem);
          message.success('操作成功');
          BaseNumModalRef.value?.closeModal();
          updateTableDataRecord(values.id, result);
        } finally {
          BaseNumModalRef.value?.setModalProps({ confirmLoading: false });
        }
      },
    } as ModifyInfo);
  }
</script>

<style lang="less">
  .vben-basic-form .ant-form-item.suffix-item .ant-form-item-control {
    margin-top: 0;
  }
</style>
