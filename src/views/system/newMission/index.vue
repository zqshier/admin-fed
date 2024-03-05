<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :beforeEditSubmit="beforeEditSubmit">
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
                  title: '确认删除？',
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
  // import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import {
    missionsDelete as deleteApi,
    missionsList as listApi,
    missionsUpdate as updateApi,
  } from '/@/api/app/mission';
  import { GroupCode, IMission } from '/@/api/app/model/missionModel';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord, deleteTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    beforeFetch(params) {
      params.groupCode = GroupCode.mission;
      params.groupRelatedId = 0;
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 200 },
    useSearchForm: false,
    formConfig: {
      labelWidth: 90,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
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
    console.debug(row);
    await deleteApi(row[primaryKey]).then(() => {
      message.success('删除成功', 1).then(() => {
        deleteTableDataRecord(row[primaryKey]);
      });
    });
  }

  // 字段编辑
  async function beforeEditSubmit({ key, value, rawRecord }) {
    if (key !== 'position') return false;

    if (!value) {
      message.info('请填写排序数字');
      return false;
    }

    try {
      await updateApi(rawRecord.id, { position: value } as IMission);
      reload();
      return true;
    } catch {
      return false;
    }
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
</script>
