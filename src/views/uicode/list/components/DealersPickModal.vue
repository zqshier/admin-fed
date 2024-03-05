<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择经销商"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerGoodsTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { IDistributorsListItem } from '/@/api/app/model/uicodeModel';
  export interface DistributorsPickData {
    ids?: number[] | string[];
    rows?: IDistributorsListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
  }
</script>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { distributorsList as listApi } from '/@/api/app/uicode';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    BasicColumn,
    BasicTable,
    FormSchema,
    TableRowSelection,
    useTable,
  } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const goodsTableSchema: BasicColumn[] = [
    {
      title: '经销商名称',
      dataIndex: 'name',
    },
    {
      title: '经销商编号',
      dataIndex: 'code',
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '经销商名称',
      component: 'Input',
    },
    {
      field: 'code',
      label: '经销商编号',
      component: 'Input',
      componentProps: { maxlength: 30 },
    },
  ];

  const tableDataCache = ref({});

  //商品选择表格
  const [registerGoodsTable, { getSelectRowKeys, setSelectedRowKeys, reload }] = useTable({
    title: '',
    rowKey: 'id',
    api: listApi,
    columns: goodsTableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: true,
    immediate: false,
    formConfig: { schemas: searchGoodsSchema, labelWidth: 100, baseColProps: { span: 8 } },
    afterFetch(data) {
      data.forEach((item: any) => {
        tableDataCache.value[item.id] = item;
      });
      return data;
    },
  });

  const [registerModal, { closeModal }] = useModalInner(async (data: DistributorsPickData) => {
    reload();
    if (data) {
      setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
      actions.callback = data.callback;
      if (data.type) {
        rowSelection.type = data.type === 'single' ? 'radio' : 'checkbox';
      }
    }
  });

  async function getDealersData(itemIds: number[] | string[]) {
    return itemIds.map((id: number | string) => tableDataCache.value[id] as IDistributorsListItem);
  }

  async function handleSubmit() {
    const ids = getSelectRowKeys();
    const data: DistributorsPickData = {
      ids: ids,
      rows: await getDealersData(ids),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
