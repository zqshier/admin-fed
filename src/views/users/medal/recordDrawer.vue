<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="获取记录" :isDetail="true">
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { recordColumns as columns, recordSearchFormSchema as searchFormSchema } from './data';
  import { medalsRecordsList as listApi } from '/@/api/app/medals';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  //弹窗
  const [registerDrawer] = useDrawerInner(async () => {
    nextTick(() => {
      reload();
    });
  });

  const [registerTable, { reload }] = useTable({
    api: listApi,
    showIndexColumn: true,
    rowKey: (record: Recordable) =>
      `${record.group}${record.userId}${new Date(record.createdAt).getTime()}`,
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
</script>

<style lang="less" scoped></style>
