<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="评分记录"
    width="90%"
    @ok="closeDrawer"
    :showCancelBtn="false"
    :okText="'返回'"
    :destroyOnClose="true"
  >
    <BasicTable @register="registerTable" :title="tableTitle">
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { timeRender } from '../data';
  import {
    RatingRecordParams,
    ratingRecordExport as exportApi,
    ratingRecordList as listApi,
  } from '/@/api/app/goods';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';

  //表格列配置
  const columns: BasicColumn[] = [
    {
      title: '评分名称',
      dataIndex: 'title',
      width: 100,
    },
    {
      title: '评分时间',
      dataIndex: 'createdAt',
      customRender: timeRender,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
    },
    {
      title: '商品规格',
      dataIndex: 'skuComb',
      customRender: ({ value }: Recordable) => {
        const skus = value.map((item) => `${item.k && item.v ? `${item.k}-${item.v}` : ''}`);
        return skus.join('、').trim();
      },
    },
    {
      title: '推荐指数',
      dataIndex: 'star',
    },
    {
      title: '选择标签',
      dataIndex: 'chooseTags',
      customRender: ({ text }: Recordable) => {
        return text.join('、');
      },
    },
  ];

  const searchFormSchema: FormSchema[] = [
    { field: 'title', label: '评分名称', component: 'Input' },
    { field: 'itemName', label: '商品名称', component: 'Input' },
    { field: 'userId', label: '用户ID/手机号', component: 'Input' },
    {
      field: '[startTime, endTime]',
      label: '评分时间',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        showTime: { format: 'HH:mm:ss' },
      },
    },
  ];

  let searchParams = { perPage: 10, page: 1 };
  const tableTitle = ref('评分记录');

  const [registerTable, { reload }] = useTable({
    api: listApi,
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: true,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 110,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
    beforeFetch: (params) => {
      searchParams = params;
      return params;
    },
  });

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async () => {
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  //导出
  function handleExport() {
    exportApi({ ...searchParams } as RatingRecordParams);
  }
</script>
