<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex items-center">
            <div class="w-60px">
              <TableImg :imgList="[record.image]" :size="60" />
            </div>
            <div class="ml-2 text-left">
              <div class="break-all whitespace-pre-wrap">{{ record.item.name }}</div>
              <div>{{ getCombText(record.comb) }}</div>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'price'">
          <CellEdit
            v-model:value="record[column.key]"
            :record="{ row: record, key: column.key }"
            :beforeSubmit="cellEditSubmit"
          />
        </template>
        <template v-if="column.key === 'guidePrice'">
          <CellEdit
            v-model:value="record[column.key]"
            :showDelete="true"
            :record="{ row: record, key: column.key }"
            :beforeSubmit="cellEditSubmit"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleImport">导入价格</a-button>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import CellEdit from './components/CellEdit.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import { skuList as listApi, skuUpdate as updateApi } from '/@/api/app/goods';
  import { CombItem } from '/@/api/app/model/goodsModel';
  import { BasicTable, TableImg, useTable } from '/@/components/Table';

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
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

  function getCombText(comb: CombItem[]) {
    return comb.map((item) => item.v).join('-');
  }

  //导入
  function handleImport() {}

  //导出
  function handleExport() {}

  async function cellEditSubmit({ value, record }) {
    const result = await updateApi(record.row.id, { [record.key]: value || null });
    return result[record.key];
  }
</script>
