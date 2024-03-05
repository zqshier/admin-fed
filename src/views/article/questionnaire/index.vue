<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '编辑', onClick: handleEditViewDetail.bind(null, record) },
              { label: '问卷统计', onClick: handleViewDetail.bind(null, record) },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增问卷</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <RecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup name="Article">
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import RecordDrawer from './recordDrawer.vue';
  import { questionnaireList as listApi } from '/@/api/app/article';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  // 查看详情
  function handleViewDetail(row: Recordable) {
    openRecordDrawer(true, { record: row });
  }

  // 编辑详情
  function handleEditViewDetail(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  //新增
  function handleAdd() {
    openDrawer(true, { isUpdate: false });
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
</script>
