<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEditViewDetail.bind(null, record),
              },
              {
                label: '新增',
                onClick: handleNumModify.bind(null, record),
              },
              {
                label: '查看',
                onClick: handleViewDetail.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新建卡</a-button>
        <a-button v-if="false" type="primary" @click="handleExport">导出报表</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <DetailDrawer @register="registerDetailDrawer" />
    <BaseNumModal ref="BaseNumModalRef" @register="registerBaseNumModify" />
  </div>
</template>
<script lang="ts" setup name="GiftCardList">
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { primaryKey, columns, searchFormSchema, formSchemaModifyGoodsStock } from './data';
  import { giftCardList, giftCardsBatchCreate } from '/@/api/app/giftCard';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import BaseNumModal, { ModifyInfo } from '../../components/BaseNumModal.vue';
  import Drawer from './drawer.vue';
  import DetailDrawer from './components/DetailDrawer.vue';

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '卡列表',
    api: giftCardList,
    rowKey: primaryKey,
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
  });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  const [registerBaseNumModify, { openModal: openBaseNumModify }] = useModal();

  const BaseNumModalRef = ref();
  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      reload();
    }
  }

  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  function handleExport() {}

  function handleEditViewDetail(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  function handleViewDetail(row: Recordable) {
    openDetailDrawer(true, { record: row });
  }

  function handleNumModify(values) {
    const { totalCount = 0, salesCount = 0 } = values.counter;
    const stockCount = +totalCount - +salesCount;
    const stateInfo: ModifyInfo = {
      values: { count: stockCount, addCount: '', baseCount: stockCount },
      title: '添加商品库存',
      schemas: formSchemaModifyGoodsStock,
      ok: null,
      warnTips: '请输入增加库存',
    };
    openBaseNumModify(true, {
      ...stateInfo,
      ok: async (row) => {
        try {
          const { addCount = 0 } = row;
          const result = await giftCardsBatchCreate(values.id, { count: +addCount });
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
