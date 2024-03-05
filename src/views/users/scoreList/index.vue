<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup name="ScoreList">
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import { userPointsList as listApi } from '/@/api/app/users';
  import { BasicTable, useTable } from '/@/components/Table';

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
  });
</script>
