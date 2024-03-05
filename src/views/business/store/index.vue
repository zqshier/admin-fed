<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-button type="link" @click="handleView(record)">{{ record.name }}</a-button>
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport" :loading="exportLoading">导出</a-button>
        <a-button type="primary" @click="handleRecord">奖励记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" />
    <RecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup name="BusinessList">
  import { ref } from 'vue';
  import RecordDrawer from './components/RecordDrawer.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { cnyStoresExport as exportApi, cnyStoresList as listApi } from '/@/api/app/mms';
  import { ECnyStoreStatus } from '/@/api/app/model/mmsModel';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';

  const exportLoading = ref(false);
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerTable, { getForm }] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch(params) {
      params.status = ECnyStoreStatus.approved;
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  // 查看详情
  function handleView(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  // 奖励记录
  function handleRecord() {
    openRecordDrawer(true, {});
  }

  //导出
  async function handleExport() {
    exportLoading.value = true;
    const form = getForm();
    const value = await form.validate();
    value.status = ECnyStoreStatus.approved;
    exportApi({ ...value }).finally(() => {
      exportLoading.value = false;
    });
  }
</script>
