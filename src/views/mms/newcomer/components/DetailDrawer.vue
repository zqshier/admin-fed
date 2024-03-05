<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="详情"
    @ok="closeDrawer"
    :destroyOnClose="true"
    :isDetail="true"
  >
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '再发一次',
                onClick: handleSend.bind(null, record),
                ifShow: record.state !== 'success',
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button v-if="false" type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { detailColumns, detailSearchForm } from '../data';
  import { newcomerGiftsSendRecord as listApi } from '/@/api/app/mms';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const openData = reactive<Recordable>({
    id: '',
  });

  const [registerDrawer, { closeDrawer }] = useDrawerInner(async (data) => {
    openData.id = data.id;
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
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
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

  //todo 再发一次
  function handleSend(row: Recordable) {
    console.log(row);
  }

  //todo 导出
  function handleExport() {}
</script>
