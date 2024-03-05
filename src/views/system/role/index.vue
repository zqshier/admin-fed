<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '菜单权限',
                onClick: handleMenu.bind(null, record),
              },
              {
                label: 'API权限',
                onClick: handleApi.bind(null, record),
              },
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
    <ApiModal @register="registerApiModal" />
    <MenuModal @register="registerMenuModal" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import ApiModal from './components/ApiModal.vue';
  import MenuModal from './components/MenuModal.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { deleteRoles as deleteApi, listRoles } from '/@/api/sys/role';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerApiModal, { openModal: openApiModal }] = useModal();
  const [registerMenuModal, { openModal: openMenuModal }] = useModal();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listRoles,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right' },
    useSearchForm: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { style: 'padding-left:10px;' },
      baseColProps: { span: 6 },
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
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate && values?.[primaryKey]) {
      const result = updateTableDataRecord(values[primaryKey], values);
      console.log(result);
    } else {
      reload();
    }
  }

  function handleApi(record: Recordable) {
    console.log(record);
    openApiModal(true, {
      record,
      success: () => {
        reload();
      },
    });
  }

  function handleMenu(record: Recordable) {
    openMenuModal(true, { record, success: () => reload() });
  }
</script>
