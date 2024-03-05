<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="邀请记录" width="80%">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  // import { message } from 'ant-design-vue';
  import { inviteColumns as columns, primaryKey, searchFormSchema } from './data';
  import { usersInviteExport as exportApi, userInvitesList as listApi } from '/@/api/app/users';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  const lotteryId = ref<number>(0);

  const [registerTable, { reload, getForm }] = useTable({
    title: '邀请记录列表',
    api: listApi,
    beforeFetch(params) {
      params.fromChannel = `lottery:${lotteryId.value}`;
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: { span: 24 },
      baseColProps: { span: 10 },
    },
  });

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    try {
      setDrawerProps({
        loading: true,
        onClose: async () => {},
      });

      if (!lotteryId.value) {
        lotteryId.value = data.record.relatedId;
        return;
      }
      lotteryId.value = data.record.relatedId;
      reload();
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    const params = { ...value, fromChannel: `lottery:${lotteryId.value}` };
    exportApi(params);
  }
</script>
