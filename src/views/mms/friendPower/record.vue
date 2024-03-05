<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="活动记录" :isDetail="true">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { pickBy } from 'lodash-es';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './record.data';
  import {
    friendPowerConfigCycleListExportApi as exportApi,
    friendPowerConfigCycleListApi as listApi,
  } from '/@/api/app/friendPower';
  import { IFriendPowerConfigCycleListParams } from '/@/api/app/model/friendPowerModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  let searchParams: IFriendPowerConfigCycleListParams = { perPage: 10, page: 1 };

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async () => {
    try {
      setDrawerProps({ loading: true, onClose: async () => {} });
      reload();
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [registerTable, { reload }] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch: (params) => {
      searchParams = pickBy({ ...params }, (v) => v !== '') as IFriendPowerConfigCycleListParams;
      return searchParams;
    },
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 150,
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

  //导出
  function handleExport() {
    exportApi({ ...searchParams });
  }
</script>
