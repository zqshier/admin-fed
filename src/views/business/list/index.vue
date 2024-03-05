<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            v-if="isFilterArea"
            :actions="[
              {
                label: '审核通过',
                popConfirm: {
                  title: '是否确认审核通过？',
                  confirm: handleUpdate.bind(null, record, ECnyStoreStatus.approved),
                },
                ifShow: record.status === ECnyStoreStatus.pending,
              },
              {
                label: '审核拒绝',
                color: 'error',
                popConfirm: {
                  title: '是否确认审核拒绝？',
                  confirm: handleUpdate.bind(null, record, ECnyStoreStatus.disapproved),
                },
                ifShow: record.status === ECnyStoreStatus.pending,
              },
            ]"
          />
          <div v-else style="overflow: initial; white-space: normal"
            >请筛选"区域分布"后再进行审核操作</div
          >
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport" :loading="exportLoading">导出</a-button>
      </template>
    </BasicTable>
    <RejectModal @register="registerRejectModal" />
  </div>
</template>
<script lang="ts" setup name="BusinessList">
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import RejectModal from './components/RejectModal.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import {
    cnyStoresAudit as auditApi,
    cnyStoresExport as exportApi,
    cnyStoresList as listApi,
  } from '/@/api/app/mms';
  import { ECnyStoreStatus } from '/@/api/app/model/mmsModel';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const exportLoading = ref(false);
  const isFilterArea = ref(false);

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const [registerTable, { getForm, reload }] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch(params) {
      isFilterArea.value = !!params.area;
      return { ...params };
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  // 更改状态
  async function handleUpdate(row: Recordable, status: ECnyStoreStatus) {
    if (status === ECnyStoreStatus.disapproved)
      return openRejectModal(true, {
        id: row[primaryKey],
        success: async () => {
          message.success('审核拒绝操作成功');
          await reload();
        },
      });

    return auditApi(row[primaryKey], { status }).then(() => {
      message.success('审核通过操作成功');
      reload();
    });
  }

  //导出
  async function handleExport() {
    exportLoading.value = true;
    const form = getForm();
    const value = await form.validate();
    exportApi({ ...value }).finally(() => {
      exportLoading.value = false;
    });
  }
</script>
