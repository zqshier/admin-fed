<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="抽签详情" :isDetail="true">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operator'">
          <OperatorInfo type="user" :id="record.userId" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    detailColumns as columns,
    primaryKey,
    detaillSearchFormSchema as searchFormSchema,
  } from '../data';
  import { DrawLotsCodeParams, drawLotsCodeList, drawLotsExport } from '/@/api/app/mms';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  const currentNo = ref<string>('');
  const exportParams = ref<DrawLotsCodeParams>({} as DrawLotsCodeParams);

  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    try {
      setDrawerProps({
        loading: true,
        onClose: async () => {},
      });

      if (!currentNo.value) {
        currentNo.value = data.record.id;
        return;
      }
      currentNo.value = data.record.id;
      reload();
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [registerTable, { reload }] = useTable({
    api: drawLotsCodeList,
    beforeFetch(params) {
      console.debug(params);
      // return { id: 1, params };
      exportParams.value = params;
      return { id: currentNo.value, params };
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        span: 3,
      },
    },
  });

  //导出
  function handleExport() {
    drawLotsExport(`营销资源抽签`, +currentNo.value, { ...exportParams.value });
  }
</script>

<style lang="less" scoped></style>
