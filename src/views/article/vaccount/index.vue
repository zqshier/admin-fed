<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '启用',
                onClick: handleChangeState.bind(null, record),
                ifShow: record.state === UsersState.disabled,
              },
              {
                label: '禁止',
                ifShow: record.state === UsersState.enabled,
                popConfirm: {
                  title: '是否禁用该账号？',
                  confirm: handleChangeState.bind(null, record),
                },
              },
              {
                label: '编辑',
                onClick: handleEditViewDetail.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加账号</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup name="VirtualAccount">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey } from './data';
  import { usersList, usersUpdate } from '/@/api/app/article';
  import { userList as userInfoListApi } from '/@/api/app/users';
  import { UsersState, UsersInfo } from '/@/api/app/model/articleModel';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '虚拟账号管理',
    api: usersList,
    beforeFetch(params) {
      return {
        ...params,
      };
    },
    afterFetch: async (dataList) => {
      const res = await userInfoListApi({
        userIds: dataList.map((o) => o.userId).join(','),
        page: 1,
        perPage: dataList.length,
      });
      return dataList.map((o) => {
        const u = res.list.find((a) => a.id === o.userId);
        return { ...o, sid: u?.sid || '' };
      });
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
    },
    useSearchForm: true,
    showIndexColumn: false,
    clickToRowSelect: false,
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
      baseColProps: {
        span: 8,
      },
    },
  });

  // 改变
  async function handleChangeState(row: Recordable) {
    const params = cloneDeep(row) as UsersInfo;
    if (!params.id) return;
    params.state = params.state === UsersState.disabled ? UsersState.enabled : UsersState.disabled;
    return usersUpdate(params[primaryKey], { state: params.state } as UsersInfo).then(() => {
      message.success(
        {
          [UsersState.disabled]: '禁止',
          [UsersState.enabled]: '启用',
        }[params.state] + '成功',
      );
      handleSuccess({ isUpdate: true, values: params });
    });
  }

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  // 编辑详情
  function handleEditViewDetail(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
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
</script>
