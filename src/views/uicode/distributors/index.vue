<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-button type="link" @click="handleCompile(record)">{{ record.name }}</a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加经销商</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="UIcodeList">
  import { primaryKey, pageTitle, columns, searchFormSchema } from './data';
  import { distributorsList as listApi } from '/@/api/app/uicode';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import Drawer from './drawer.vue';

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: `${pageTitle}管理`,
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 180,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 12 },
    },
  });

  const [registerDrawer, { openDrawer }] = useDrawer();

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

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }
</script>
