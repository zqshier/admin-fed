<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'sn'">
          <a-button type="link" @click="handleViewDetail(record)">{{ record.sn }}</a-button>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '启动任务',
                popConfirm: {
                  title: '是否确认启动任务？',
                  confirm: handleStart.bind(null, record),
                },
                ifShow: record.step === EBatchStep.pending,
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加任务</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <DetailDrawer @register="registerDetailDrawer" />
  </div>
</template>
<script lang="ts" setup name="UIcodeList">
  import { primaryKey, pageTitle, columns, searchFormSchema } from './data';
  import { batchesList as listApi, batchesStart } from '/@/api/app/uicode';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import Drawer from './drawer.vue';
  import DetailDrawer from './components/DetailDrawer.vue';
  import { EBatchStep } from '/@/api/app/model/uicodeModel';

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 100,
    },
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

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      reload();
    }
  }

  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  async function handleStart(row: Recordable) {
    const { id } = row;
    if (!id) return;
    try {
      const result = await batchesStart(id);
      handleSuccess({ isUpdate: true, values: { ...result } });
    } catch (e) {
      console.error('handleStart err=', e);
    }
  }

  function handleViewDetail(row: Recordable) {
    openDetailDrawer(true, { record: row });
  }
</script>
