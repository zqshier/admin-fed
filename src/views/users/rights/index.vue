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
                disabled: true,
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
    <Drawer @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { userRightsList as listApi, userRightsSave as updateApi } from '/@/api/app/users';
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
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
    useSearchForm: false,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
    beforeEditSubmit,
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

  //删除
  async function handleDelete(row: Recordable) {
    console.log(row);
    //todo: 删除接口
  }

  // 编辑排序
  async function beforeEditSubmit({ key, rawRecord, value }) {
    if (key !== 'position') {
      return false;
    }
    if (value === '') {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await updateApi({ ...rawRecord, position: Number(value) } as any);
      reload();
      return true;
    } catch {
      return false;
    }
  }
</script>
