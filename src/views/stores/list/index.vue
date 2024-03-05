<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看',
                onClick: handleCheck.bind(null, record),
              },
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加门店</a-button>
        <a-button type="primary" @click="handleExport">导出全部门店</a-button>
      </template>
    </BasicTable>
    <StoresDrawer @register="registerDrawer" @success="handleSuccess" />
    <StoresDrawerView @register="registerDrawerView" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { storesListApi } from '/@/api/app/stores';
  import { columns, searchFormSchema } from './stores.data';
  import StoresDrawer from './StoresDrawer.vue';
  import StoresDrawerView from './StoresDrawerView.vue';
  import { useDrawer } from '/@/components/Drawer';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDrawerView, drawerView] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '门店列表',
    api: storesListApi,
    rowKey: 'code',
    columns: columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: true,
    formConfig: {
      labelWidth: 90,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        span: 4,
      },
    },
  });

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  // 查看
  function handleCheck(row) {
    console.log('查看row: ', row);
    drawerView.openDrawer(true, {
      record: row,
    });
  }

  // 编辑
  function handleCompile(row) {
    console.log('编辑row: ', row);
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  //导出全部门店
  function handleExport() {}

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.code, values);
      console.log(result);
    } else {
      reload();
    }
  }
</script>
