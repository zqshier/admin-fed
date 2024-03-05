<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operator' && record.userId">
          <OperatorInfo type="user" :id="record.userId" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="GiftConsumeRecord">
  import { pickBy } from 'lodash-es';
  import { columns, primaryKey, searchFormSchema } from './data';
  import { giftCardConsumeExport, giftCardConsumeList } from '/@/api/app/giftCard';
  import { BasicTable, useTable } from '/@/components/Table';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const [registerTable, { getForm }] = useTable({
    title: '消费记录',
    api: giftCardConsumeList,
    beforeFetch: (params) => {
      return pickBy(params);
    },
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: true,
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    if (value['[startAt,endAt]']) {
      const [startAt, endAt] = value['[startAt,endAt]'];
      value.startAt = new Date(startAt);
      value.endAt = new Date(endAt);
      delete value['[startAt,endAt]'];
    }
    giftCardConsumeExport({ ...value });
  }
</script>
