<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="数据统计"
    @ok="closeDrawer"
    :destroyOnClose="true"
    :isDetail="true"
  >
    <BasicTable @register="registerTable">
      <!-- <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template> -->
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { couponsRecords as listApi } from '/@/api/app/mms';
  import { recordsColumns, recordsSearchForm } from '../data';

  const openData = reactive({
    id: 0,
  });

  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    console.log(data);
    openData.id = data.record.id;
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  const [registerTable, { reload }] = useTable({
    title: '',
    api: listApi,
    rowKey: 'id',
    columns: recordsColumns,
    bordered: true,
    showTableSetting: true,
    immediate: false,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: recordsSearchForm,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 8,
      },
    },
    beforeFetch(params) {
      return {
        ...params,
        couponIds: openData.id,
      };
    },
  });

  //todo 导出
  // function handleExport() {}
</script>
