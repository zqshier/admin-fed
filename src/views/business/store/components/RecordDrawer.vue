<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="奖励记录"
    width="80%"
    @ok="closeDrawer"
    :showCancelBtn="false"
    :okText="'返回'"
    :destroyOnClose="true"
  >
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template
          v-if="column.dataIndex === 'action' && record.status !== ECnyStoreRetryStatus.pending"
        >
          <Tag v-if="record.status === ECnyStoreRetryStatus.ok" color="green">成功</Tag>
          <Popconfirm title="是否重新发放奖励？" @confirm="handleRetry(record)">
            <a-button v-if="record.status === ECnyStoreRetryStatus.fail" type="primary"
              >重新发起</a-button
            >
          </Popconfirm>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport" :loading="exportLoading">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { Popconfirm, Tag, message } from 'ant-design-vue';
  import { h, nextTick, ref } from 'vue';
  import {
    cnyStoresRetry,
    cnyStoresRecordsExport as exportApi,
    cnyStoresRecords as listApi,
  } from '/@/api/app/mms';
  import { ECnyStoreRetryStatus, ICnyStoreListParams } from '/@/api/app/model/mmsModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const auditOptions = [
    { value: ECnyStoreRetryStatus.pending, color: 'gray', label: '发放中' },
    { value: ECnyStoreRetryStatus.ok, color: 'green', label: '已发放' },
    { value: ECnyStoreRetryStatus.fail, color: 'red', label: '发放失败' },
  ];

  //表格列配置
  const columns: BasicColumn[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      customRender: ({ text }: Recordable) => {
        if (!text) return '';
        return h(OperatorInfo, {
          type: 'user',
          id: text,
          showType: true,
          showId: true,
          block: true,
        });
      },
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
      customRender: ({ record }) => record?.store?.name || '',
    },
    {
      title: '用户姓名',
      dataIndex: 'userName',
      customRender: ({ record }) => record?.store?.userName || '',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      customRender: ({ record }) => record?.store?.phone || '',
    },
    {
      title: '扫码时间',
      dataIndex: 'createdAt',
      customRender({ text }) {
        if (!text) return '-';
        return formatToDateTime(text);
      },
    },
    {
      title: '店铺地址',
      dataIndex: 'address',
      customRender({ record }: Recordable) {
        const { province = '', city = '', district = '', address = '' } = record?.store;
        return `${province}${city}${district}${address}`;
      },
    },
    {
      title: '发放奖励金额（元）',
      dataIndex: 'money',
    },
    {
      title: '奖励状态',
      dataIndex: 'status',
      customRender: ({ value }: Recordable) => {
        if (!value) return '';
        const tag = auditOptions.find((item) => item.value === value);
        return h(Tag, { color: tag?.color }, () => tag?.label);
      },
    },
  ];

  const searchFormSchema: FormSchema[] = [
    { field: 'userId', label: '用户ID', component: 'Input' },
    { field: 'phone', label: '手机号', component: 'Input' },
    { field: 'storeName', label: '店铺名称', component: 'Input' },
    { field: 'userName', label: '用户名称', component: 'Input' },
    {
      field: 'status',
      label: '奖励状态',
      component: 'Select',
      componentProps: { options: auditOptions },
    },
    { field: 'address', label: '门店地址', component: 'Input' },
  ];

  let searchParams = { perPage: 10, page: 1 } as ICnyStoreListParams;

  const [registerTable, { reload }] = useTable({
    api: listApi,
    beforeFetch: (params) => {
      searchParams = params;
      return params;
    },
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
    actionColumn: { title: '奖励发放结果', dataIndex: 'action', fixed: 'right', width: 150 },
  });

  //弹窗
  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    console.debug('data', data);
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  const handleRetry = async (row: Recordable) => {
    if (!row.id) return;
    try {
      await cnyStoresRetry(row.id);
      message.success('操作成功');
      reload();
    } catch (err) {
      message.error((err as any).message || '操作失败');
    }
  };

  const exportLoading = ref<boolean>(false);

  //导出
  async function handleExport() {
    exportLoading.value = true;
    exportApi({ ...searchParams }).finally(() => {
      exportLoading.value = false;
    });
  }
</script>
