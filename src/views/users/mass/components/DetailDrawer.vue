<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="详情"
    @ok="closeDrawer"
    :destroyOnClose="true"
    :isDetail="true"
  >
    <div class="total-wrap">
      <div class="item">发放数量：{{ openData.total }}</div>
      <div class="item">发放成功：{{ openData.successed }}</div>
      <div class="item">发放失败：{{ openData.failed }}</div>
    </div>
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
  import { tasksLogList as listApi } from '/@/api/app/task';
  import { detailColumns, detailSearchForm } from '../data';

  const openData = reactive<Recordable>({
    id: '',
    total: 0,
    totalSuccess: 0,
    totalFail: 0,
    totalProcessing: 0,
  });

  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    Object.assign(openData, data);
    nextTick(() => {
      reload({ page: 1 });
    });
  });

  const [registerTable, { reload }] = useTable({
    title: '',
    api: listApi,
    rowKey: 'id',
    columns: detailColumns,
    bordered: true,
    showTableSetting: true,
    immediate: false,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: detailSearchForm,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 6,
      },
    },
    beforeFetch(params) {
      return {
        ...params,
        id: openData.id,
      };
    },
  });
</script>

<style lang="less" scoped>
  .total-wrap {
    display: flex;
    align-items: center;
    border: 1px solid #e8e8e8;
    padding: 20px;
    justify-content: space-around;
  }
</style>
