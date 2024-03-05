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
                label: '邀请记录',
                onClick: handleInviteView.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <InviteDrawer @register="registerInviteDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import InviteDrawer from './inviteDrawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { missionsGroupsList as listApi } from '/@/api/app/mission';
  import { GroupCode } from '/@/api/app/model/missionModel';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerInviteDrawer, { openDrawer: openInviteDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    beforeFetch(params) {
      params.groupCode = GroupCode.lottery;
      params.groupRelatedIds = [];
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: undefined,
    },
    useSearchForm: false,
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

  // 邀请记录
  function handleInviteView(row: Recordable) {
    openInviteDrawer(true, { record: row });
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
</script>
