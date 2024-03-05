<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
              {
                label: '新增',
                onClick: handleAddNum.bind(null, record),
              },
              {
                label: '导出',
                onClick: handleExport.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
        <a-button type="primary" @click="handleSearch">二维码查询</a-button>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
    <QrcodesNumModal @register="registerQrcodesNumModal" @success="handleSuccess" />
    <QrcodesSearchModal @register="registerQrcodesSearchModal" />
    <QrcodesExportModal @register="registerQrcodesExportModal" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Modal from './modal.vue';
  import { useModal } from '/@/components/Modal';
  import { qrcodesList as listApi } from '/@/api/app/qrcodes';
  import QrcodesNumModal from './components/QrcodesNumModal.vue';
  import QrcodesSearchModal from './components/QrcodesSearchModal.vue';
  import QrcodesExportModal from './components/QrcodesExportModal.vue';

  const [registerModal, { openModal }] = useModal();
  const [registerQrcodesNumModal, { openModal: openQrcodesNumModal }] = useModal();
  const [registerQrcodesSearchModal, { openModal: openQrcodesSearchModal }] = useModal();
  const [registerQrcodesExportModal, { openModal: openQrcodesExportModal }] = useModal();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        style: 'padding-left:10px;',
      },
      baseColProps: {
        span: 6,
      },
    },
  });

  //新增
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
    });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openModal(true, {
      isUpdate: true,
      record: row,
    });
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate && values?.[primaryKey]) {
      updateTableDataRecord(values[primaryKey], values);
    } else {
      reload();
    }
  }

  function handleAddNum(row: Recordable) {
    openQrcodesNumModal(true, {
      isUpdate: true,
      record: row,
    });
  }

  function handleSearch() {
    openQrcodesSearchModal(true);
  }

  function handleExport(row: Recordable) {
    openQrcodesExportModal(true, { record: row });
  }
</script>
