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
        <a-button type="primary" @click="handleAdd">添加Banner</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { columns, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import {
    bannersDelete as deleteApi,
    bannersList as listApi,
    bannersUpdate as updateApi,
  } from '/@/api/app/deco';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: 'Banner列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right' },
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { style: 'padding-left:10px;' },
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

  // 删除
  async function handleDelete(row: Recordable) {
    return deleteApi(row[primaryKey]).then(() => {
      message.success('删除成功');
      reload();
    });
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

  // 字段编辑
  async function beforeEditSubmit({ key, rawRecord, value }) {
    if (key !== 'position') {
      return false;
    }
    if (value === '') {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await updateApi(rawRecord.id, { position: Number(value) } as any);
      return true;
    } catch {
      return false;
    }
  }
</script>
