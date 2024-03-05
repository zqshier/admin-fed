<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
        <a-button type="primary" @click="handleRecord">评分记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <RatingRecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup name="GoodsRating">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import RatingRecordDrawer from './components/RatingRecordDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { ratingList as listApi } from '/@/api/app/goods';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
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

  // 评分记录
  function handleRecord(row: Recordable) {
    openRecordDrawer(true, {
      record: row,
    });
  }
</script>
