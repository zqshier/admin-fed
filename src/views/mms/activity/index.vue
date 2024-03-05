<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[{ label: '编辑', onClick: handleCompile.bind(null, record) }]" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
        <a-button type="primary" @click="openRecordDrawer(true, {})">活动记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <RecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import RecordDrawer from './recordDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { activityList as listApi } from '/@/api/app/activity';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 },
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 6,
      },
    },
  });

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }
</script>
