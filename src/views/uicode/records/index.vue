<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-button type="link" @click="handleCompile(record)">{{ record.name }}</a-button>
        </template>
      </template> -->
      <template #toolbar> </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="UIcodeRecords">
  import { primaryKey, pageTitle, columns, searchFormSchema } from './data';
  import { recordsList as listApi } from '/@/api/app/uicode';
  import { BasicTable, useTable } from '/@/components/Table';

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: true,
    clickToRowSelect: false,
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
