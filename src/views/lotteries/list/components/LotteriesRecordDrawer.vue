<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="中奖记录"
    width="80%"
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
  import { Tag } from 'ant-design-vue';
  import { identity, pickBy } from 'lodash-es';
  import { h, nextTick, ref } from 'vue';
  import { AwardsTypeList } from '../../awards/data';
  import { timeRender } from '../data';
  import { lotteriesRecords, lotteriesRecordsExport } from '/@/api/app/lotteries';
  import { LotteriesRecordListParams } from '/@/api/app/model/lotteriesModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';

  const awardStateList = [
    { value: 'pending', color: 'gray', label: '待处理' },
    { value: 'sent', color: 'green', label: '已发送' },
    { value: 'failed', color: 'red', label: '失败' },
  ];

  //表格列配置
  const columns: BasicColumn[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 100,
    },
    // {
    //   title: '手机号',
    //   dataIndex: 'address.phone',
    //   customRender: ({ record }: Recordable) => {
    //     return record.address?.phone || '-';
    //   },
    // },
    {
      title: '中奖时间',
      dataIndex: 'createdAt',
      customRender: timeRender,
    },
    {
      title: '奖品名称',
      dataIndex: 'award.name',
      customRender({ record }: Recordable) {
        return record.award?.name || '-';
      },
    },
    {
      title: '奖品类型',
      dataIndex: 'award.type',
      customRender: ({ record }: Recordable) => {
        const value = record.award?.type || '';
        const item = AwardsTypeList.find((i) => i.value === value);
        return item?.label;
      },
    },
    {
      title: '收货信息',
      dataIndex: 'address',
      customRender({ record }: Recordable) {
        if (record.address) {
          return [
            record.address.name,
            record.address.phone,
            record.address.province,
            record.address.city,
            record.address.district,
            record.address.address,
          ].join(' ');
        }
        return '-';
      },
    },
    {
      title: '奖品状态',
      dataIndex: 'state',
      customRender({ value }: Recordable) {
        const tag = awardStateList.find((i) => i.value === value);
        return h(Tag, { color: tag?.color }, () => tag?.label);
      },
    },
    {
      title: '发送结果',
      dataIndex: 'result',
    },
  ];

  const searchFormSchema: FormSchema[] = [
    { field: 'userId', label: '用户ID/手机号', component: 'Input' },
    {
      field: 'type',
      label: '奖品类型',
      component: 'Select',
      componentProps: {
        options: AwardsTypeList,
      },
    },
    {
      field: 'state',
      label: '奖品状态',
      component: 'Select',
      componentProps: { options: awardStateList },
    },
    {
      field: '[start, end]',
      label: '中奖时间',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        showTime: { format: 'HH:mm:ss' },
      },
    },
  ];

  let searchParams: LotteriesRecordListParams = { lotteryCode: '', perPage: 10, page: 1 };
  let lotteryCode = '';
  const tableTitle = ref('');

  const [registerTable, { reload }] = useTable({
    api: lotteriesRecords,
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: true,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
    beforeFetch: (params) => {
      params.lotteryCode = lotteryCode;
      searchParams = pickBy(params, identity) as LotteriesRecordListParams;
      return params;
    },
  });

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    lotteryCode = data.record.code;
    tableTitle.value = `${data.record.name} - 中奖记录`;
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  //导出
  function handleExport() {
    lotteriesRecordsExport(`中奖记录`, { ...searchParams });
  }
</script>
