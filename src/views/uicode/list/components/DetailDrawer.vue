<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="查看详情" :isDetail="true">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '查看链接',
                color: 'success',
                ifShow:
                  record.step === EBatchStep.waitPublish || record.step === EBatchStep.completed,
                onClick: handleCheckLink.bind(null, record),
              },
              {
                label: '出库',
                color: 'success',
                ifShow: record.step === EBatchStep.waitPublish,
                popConfirm: {
                  title: '是否确认将该批二维码进行出库？',
                  confirm: handleSetPublished.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <!-- <template #toolbar> </template> -->
    </BasicTable>
    <DownloadZipModal @register="registerDownloadZipModal" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    batchesTasksLinks as linkApi,
    batchesDetail as listApi,
    batchesTasksSetPublished as setPublishedApi,
  } from '/@/api/app/uicode';
  import { EBatchStep } from '/@/api/app/model/uicodeModel';
  import {
    detaillSearchFormSchema as searchFormSchema,
    primaryKey,
    detailColumns as columns,
  } from '../data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { IBatchesDetailParams } from '/@/api/app/model/uicodeModel';
  import { useModal } from '/@/components/Modal';
  import DownloadZipModal from './DownloadZipModal.vue';

  const batchesId = ref<number>(0);
  const searchInfo = ref<IBatchesDetailParams>({});
  //弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    try {
      setDrawerProps({
        loading: true,
        onClose: async () => {},
      });
      batchesId.value = data.record.id;
      reload();
    } finally {
      setDrawerProps({ loading: false });
    }
  });

  const [registerTable, { reload }] = useTable({
    api: getListApi,
    beforeFetch(params) {
      searchInfo.value = params;
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    useSearchForm: true,
    pagination: false,
    immediate: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 150,
    },
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
  });

  const [registerDownloadZipModal, { openModal: openDownloadZipPick }] = useModal();

  async function getListApi() {
    try {
      const result = await listApi(batchesId.value, { ...searchInfo.value });
      return { list: result.tasks.map((task) => ({ ...task, qrcodeType: result.type })) };
    } catch (e) {
      console.error('uicode DetailDrawer getListApi err=', e);
      return { list: [] };
    }
  }

  // 出库
  async function handleSetPublished(row: Recordable) {
    const { id: taskId, batchId: id } = row;
    try {
      await setPublishedApi(id, taskId);
      reload();
    } catch (e) {
      //TODO handle the exception
    }
  }

  async function handleCheckLink(row: Recordable) {
    const { id: taskId, batchId: id } = row;
    try {
      const result = await linkApi(id, taskId);
      openDownloadZipPick(true, { ...result });
    } catch (e) {
      //TODO handle the exception
    }
  }

  //新增、编辑成功后
  // function handleSuccess({ isUpdate, values }) {
  //   if (isUpdate) {
  //     updateTableDataRecord(values.id, values);
  //   } else {
  //     reload();
  //   }
  // }
</script>

<style lang="less" scoped>
  .batch_wrap {
    flex: 1;
    :deep(.ant-btn) {
      margin-right: 10px;
    }
  }
</style>
