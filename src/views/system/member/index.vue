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
                label: '停用',
                color: 'error',
                ifShow: !!!record.disabled,
                popConfirm: {
                  title: '确认停用？',
                  confirm: handleDelete.bind(null, record),
                },
              },
              {
                label: '重置密码',
                popConfirm: {
                  title: '确认重置密码？',
                  confirm: handleResetPwd.bind(null, record),
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

    <BasicModal
      @register="registerModal"
      :canFullscreen="false"
      title="密码重置成功"
      width="350px"
      :minHeight="60"
      wrap-class-name="common-modal-wrap"
      destroyOnClose
      :showCancelBtn="false"
      :showOkBtn="false"
    >
      <div class="p-8px">
        <!-- <Alert :message="password" type="success" /> -->
        <pre style="font-size: 20px; font-weight: bold; padding-top: 10px; text-align: center">{{
          password
        }}</pre>
        <Alert message="请确认已经保存好该密码后再关闭弹框" type="warning" show-icon />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { message, Alert } from 'ant-design-vue';
  import { listUsers, deleteUser as deleteApi, resetUserPwd } from '/@/api/sys/role';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';

  const password = ref('');
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listUsers,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
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
    try {
      await deleteApi(row[primaryKey]);
      message.success('删除成功', 1).then(() => {
        const userInfo = useUserStore().getUserInfo || {};
        if (userInfo.id === row.id) {
          useUserStore().logout(true);
        } else {
          reload();
        }
      });
    } catch (err) {
      message.error((err as any).message || '操作失败');
      return;
    }
  }

  // 重置密码
  async function handleResetPwd(row: Recordable) {
    try {
      const res = await resetUserPwd(row[primaryKey]);
      password.value = res.password;
    } catch (err) {
      message.error((err as any).message || '重置失败');
      return;
    }
    openModal();
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }
</script>
