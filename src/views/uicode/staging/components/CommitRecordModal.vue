<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="暂存区记录"
    :width="1200"
    @ok="onCommit"
  >
    <div class="p-8px">
      <BasicTable @register="registerTable" :title="title" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { IStagingItem } from '/@/api/app/model/uicodeModel';
  import { _IStagingItem } from '../index.vue';
  import { stagingCommit as commitApi } from '/@/api/app/uicode';

  const emit = defineEmits(['update']);

  const tableSchema: BasicColumn[] = [
    {
      title: '明码',
      dataIndex: 'sn',
      width: 200,
    },
    {
      title: '经销商名称',
      dataIndex: 'distributor.name',
      customRender: ({ record }: Recordable) => record.distributor?.name || '-',
    },
    {
      title: '商品69码',
      dataIndex: 'product.barcode',
      width: 200,
      customRender: ({ record }: Recordable) => record.product?.barcode || '-',
    },
    {
      title: '商品名称',
      dataIndex: 'product.name',
      customRender: ({ record }: Recordable) => record.product?.name || '-',
    },
    {
      title: '扫码时间',
      dataIndex: 'createdAt',
      customRender({ text }) {
        if (!text) return '-';
        return formatToDateTime(text);
      },
      width: 200,
    },
    {
      title: '操作人',
      dataIndex: 'creator',
    },
  ];

  const title = ref('');

  //商品选择表格
  const [registerTable, { setTableData, getDataSource }] = useTable({
    title: '',
    rowKey: 'id',
    columns: tableSchema,
    bordered: true,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: false,
  });

  const [registerModal, { closeModal }] = useModalInner(async (data: IStagingItem[]) => {
    setTableData(data);
  });

  const onCommit = async () => {
    const ids = getDataSource().map((item) => item.id);
    if (!ids?.length) return;

    try {
      await commitApi({ ids });
      emit('update');
      closeModal();
    } catch (e) {
      //TODO handle the exception
    }
  };
</script>
