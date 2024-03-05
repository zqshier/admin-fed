<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'orderNo'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.orderNo }}</a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="OrdersEvaluate">
  import { OrderType } from '../list/data';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import { IOrderCommentsListParams } from '/@/api/app/model/ordersModel';
  import {
    orderCommentsExport as exportApi,
    orderCommentsList as listApi,
    ordersDetail,
  } from '/@/api/app/orders';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();

  let searchParams: IOrderCommentsListParams = { perPage: 10, page: 1 };

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch: (params) => {
      searchParams = params;
      return params;
    },
    rowKey: primaryKey,
    columns: columns,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 110,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
  });

  // 查看详情
  async function handleViewDetail(row: Recordable) {
    const result = await ordersDetail(row.orderNo);
    const { bizCode = '' } = result;
    let url = '/orders/detail/';
    if (bizCode === OrderType.point) url = '/orders/pointDetail/';
    go(`${url}${row.orderNo}`);
  }

  //导出全部
  function handleExport() {
    exportApi({ ...searchParams });
  }
</script>
<style lang="less" scoped></style>
