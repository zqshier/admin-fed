<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择商品"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerGoodsTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { SkuListItem } from '/@/api/app/model/goodsModel';
  export interface GoodsSkuPickData {
    ids?: number[] | string[];
    rows?: SkuListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
  }
</script>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { skuStockList as listApi } from '/@/api/app/goods';
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
      title: '商品名称',
      dataIndex: 'item.name',
      customRender({ record }: Recordable) {
        return record.item.name;
      },
    },
    {
      title: '规格',
      dataIndex: 'name',
    },
    {
      title: '商品价格',
      dataIndex: 'item.price',
      width: 160,
      customRender({ record }: Recordable) {
        return record.item.price;
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 160,
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'itemName',
      label: '商品名称',
      component: 'Input',
    },
    {
      field: 'itemSn',
      label: '商品编码',
      component: 'Input',
    },
  ];

  const tableDataCache = ref({});

  //商品选择表格
  const [registerGoodsTable, { reload, getSelectRowKeys, getSelectRows, setSelectedRowKeys }] =
    useTable({
      title: '',
      rowKey: 'id',
      api: listApi,
      columns: goodsTableSchema,
      pagination: true,
      showIndexColumn: false,
      size: 'small',
      useSearchForm: true,
      immediate: false,
      formConfig: {
        schemas: searchGoodsSchema,
        labelWidth: 80,
        baseColProps: {
          span: 6,
        },
      },
      afterFetch(data) {
        data.forEach((item: any) => {
          tableDataCache.value[item.id] = item;
        });
        return data;
      },
    });

  const [registerModal, { closeModal }] = useModalInner(async (data: GoodsSkuPickData) => {
    reload();
    if (data) {
      setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
      actions.callback = data.callback;
      if (data.type) {
        rowSelection.type = data.type === 'single' ? 'radio' : 'checkbox';
      }
    }
  });

  // async function getGoodsData(itemIds: number[] | string[]) {
  //   return itemIds.map((id: number | string) => tableDataCache.value[id] as SkuListItem);

  //   //todo: 改成从接口获取详情

  //   // const { list } = await listApi({
  //   //   ids: itemIds as number[],
  //   //   perPage: Math.max(itemIds.length, 20),
  //   //   page: 1,
  //   // });
  //   // return list;
  // }

  async function handleSubmit() {
    const ids = getSelectRowKeys();
    const data: GoodsSkuPickData = {
      ids: ids,
      rows: await getSelectRows(),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
