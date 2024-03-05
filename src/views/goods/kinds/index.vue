<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '编辑', onClick: handleCompile.bind(null, record) },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除“品类名称”',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { columns, pageTitle, primaryKey } from './data';
  import Drawer from './drawer.vue';
  import { kindsDelete as deleteApi, kindsList as listApi } from '/@/api/app/goods';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right' },
    useSearchForm: false,
  });

  //新增
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

<style lang="less" scoped></style>
