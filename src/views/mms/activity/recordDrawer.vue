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
  import { nextTick } from 'vue';
  import {
    recordColumns as columns,
    primaryKey,
    recordSearchFormSchema as searchFormSchema,
  } from './data';
  import {
    activityRecordExport as exportApi,
    activityRecordList as listApi,
  } from '/@/api/app/activity';
  import { IActiviyReocrdListParams } from '/@/api/app/model/activityModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  let searchParams: IActiviyReocrdListParams = { perPage: 10, page: 1 } as IActiviyReocrdListParams;

  //弹窗
  const [registerDrawer] = useDrawerInner(async () => {
    nextTick(() => {
      reload();
    });
  });

  const [registerTable, { reload }] = useTable({
    api: listApi,
    beforeFetch: (params) => {
      searchParams = params;
      return params;
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  async function handleExport() {
    exportApi({ ...searchParams });
  }
</script>

<style lang="less" scoped></style>
