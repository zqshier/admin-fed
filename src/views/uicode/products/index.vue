<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'code'">
          <a-button class="btn" type="link" @click="handleEditViewDetail(record)">
            {{ record.code }}
          </a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增</a-button>
        <!-- <a-button type="primary" @click="handleImport">导入更新</a-button>
        <a-button type="primary" @click="openExport(true, { id: cardId })">导出</a-button> -->
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="reload" />
    <!-- <ImportCardList @register="registerImportCard" @refresh="reload" />
    <ExportModal @register="registerExport" /> -->
  </div>
</template>
<script lang="ts" setup>
  // import { ref } from 'vue';
  // import { message } from 'ant-design-vue';
  import { productsList as listApi } from '/@/api/app/uicode';
  import { searchFormSchema, primaryKey, columns } from './data';
  import { BasicTable, useTable } from '/@/components/Table';
  // import { useModal } from '/@/components/Modal';
  // import ImportCardList from './ImportCardList.vue';
  // import ExportModal from './ExportModal.vue';
  import { useDrawer } from '/@/components/Drawer';
  import Drawer from './drawer.vue';

  const [registerTable, { reload }] = useTable({
    api: listApi,
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  const [registerDrawer, { openDrawer }] = useDrawer();
  // const [registerImportCard, { openModal: openImportCard }] = useModal();
  // const [registerExport, { openModal: openExport }] = useModal();

  // 导入模板
  // function handleImport() {
  //   openImportCard(true, { id: cardId.value });
  // }

  //新增、编辑成功后
  // function handleSuccess({ isUpdate, values }) {
  //   if (isUpdate) {
  //     updateTableDataRecord(values.id, values);
  //   } else {
  //     reload();
  //   }
  // }

  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  function handleEditViewDetail(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }
</script>
<style lang="less" scoped>
  .btn {
    width: 100%;
    padding: 0;
    :deep(span) {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: keep-all;
    }
  }
</style>
