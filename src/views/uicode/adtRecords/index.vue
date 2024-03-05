<template>
  <div class="p-4">
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup name="UIcodeAdtRecords">
  import { primaryKey, pageTitle, columns, searchFormSchema } from './data';
  import { bindDailyList as listApi } from '/@/api/app/uicode';
  import { BasicTable, useTable } from '/@/components/Table';

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
  });
</script>
