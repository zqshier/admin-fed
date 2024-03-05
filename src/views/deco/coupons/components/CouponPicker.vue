<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择优惠券"
    :width="900"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'condition'">
          {{ record.condition.type === 'all' ? '全部商品' : '部分商品' }}
        </template>
        <template v-if="column.key === 'expiration'">
          {{ couponExpiration(record) }}
        </template>
        <template v-if="column.key === 'status'">
          {{ couponStatus(record) }}
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';

  import { couponsList } from '/@/api/app/mms';
  import { message } from 'ant-design-vue';
  import { format } from 'date-fns';

  const searchSchema: FormSchema[] = [
    {
      field: 'name',
      label: '优惠券名称',
      component: 'Input',
    },
  ];

  const tableSchema: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '制单号',
      dataIndex: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '面值',
      dataIndex: 'value',
    },
    {
      title: '条件',
      dataIndex: 'condition',
    },
    {
      title: '有效期',
      dataIndex: 'expiration',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
  ];

  function couponStatus(record) {
    if (
      record.expiration &&
      record.expiration.end &&
      Date.now() > new Date(record.expiration.end).valueOf()
    ) {
      return '已过期';
    }
    if (record.disabled) return '未投放';
    return '进行中';
  }

  const couponExpiration = (record: Recordable) => {
    const { start, end, after, days } = record.expiration;
    if (start) {
      return `${format(new Date(start), 'yyyy/MM/dd HH:mm:ss')} - ${format(
        new Date(end),
        'yyyy/MM/dd HH:mm:ss',
      )}`;
    }
    if (after > 0) {
      return `领券${after}天后生效，有效期${days}天`;
    }
    return `领券后有效期${days}天`;
  };

  let submitCallback: Function;

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    // console.log(data);
    if (data) {
      submitCallback = data.cb;
    }
    setSelectedRowKeys([]);
  });

  const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    api: couponsList,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'radio' },
    useSearchForm: true,
    formConfig: {
      schemas: searchSchema,
      labelWidth: 80,
      baseColProps: {
        span: 14,
      },
      actionColOptions: {
        span: 6,
      },
    },
    afterFetch: (data) => {
      console.log(data);
    },
  });

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      message.info('请选择优惠券');
      return;
    }
    if (submitCallback) {
      submitCallback(rows[0]);
    }
    closeModal();
  }
</script>
