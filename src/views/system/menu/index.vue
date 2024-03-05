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
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { menuList as listApi, menuDelete as deleteApi } from '/@/api/app/system';
  import { message } from 'ant-design-vue';

  const [registerDrawer, { openDrawer }] = useDrawer();

  function fixChildren(item: Recordable) {
    if (item.children) {
      if (item.children.length === 0) {
        delete item.children;
      } else {
        item.children = item.children.map((child: Recordable) => fixChildren(child));
      }
    }
    return item;
  }

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    afterFetch(_, rowData) {
      console.log(rowData);
      return rowData.app.children.map((item: Recordable) => fixChildren(item));
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    isTreeTable: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        style: 'padding-left:10px;',
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

  // 删除
  async function handleDelete(row: Recordable) {
    return deleteApi(row[primaryKey]).then(() => {
      message.success('删除成功');
      reload();
    });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }
</script>
