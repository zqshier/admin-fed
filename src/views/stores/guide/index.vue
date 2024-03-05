<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'global'">
          <a-tag v-if="record.global">已启用</a-tag>
          <a-popconfirm v-else @confirm="handleGlobal(record)" title="确认启用？">
            <a-button type="link">启用</a-button>
          </a-popconfirm>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除' + record.name + '？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加导购</a-button>
        <a-button type="primary" @click="handleExport">导出全部导购</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey } from './data';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { guidesList, guidesDelete, guidesUpdate } from '/@/api/app/stores';
  import { message, Tag as ATag, Popconfirm as APopconfirm } from 'ant-design-vue';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '导购列表',
    api: guidesList,
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
      labelWidth: 180,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        span: 24,
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

  // 删除
  function handleDelete(row: Recordable) {
    guidesDelete(row[primaryKey]).then(() => {
      message.success('删除成功');
      reload();
    });
  }

  //专属导购
  async function handleGlobal(row: Recordable) {
    await guidesUpdate(row.id, { global: true });
    reload();
  }

  //导出全部
  function handleExport() {}

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
