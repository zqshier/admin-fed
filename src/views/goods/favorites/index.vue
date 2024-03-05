<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleRecord">导出</a-button> -->
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="GoodsFavorites">
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import { favoritesList as listApi } from '/@/api/app/goods';

  const [registerTable] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    beforeFetch(params) {
      params.targetType = 'sku';
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 12,
      },
    },
  });

  // 收藏记录
  // function handleRecord(row: Recordable) {
  //   openRecordDrawer(true, {
  //     record: row,
  //   });
  // }
</script>
