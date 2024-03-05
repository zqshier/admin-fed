<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择商品"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable
        class="rating-goods-pick-table"
        @register="registerGoodsTable"
        :rowSelection="rowSelection"
      />
      <!-- :row-class-name="() => 'rating-goods-pick-table'" -->
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { GoodsListItem } from '/@/api/app/model/goodsModel';
  export interface GoodsPickData {
    ids?: number[] | string[];
    configId?: number;
    rows?: GoodsListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
  }
</script>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    FormSchema,
    TableRowSelection,
  } from '/@/components/Table';
  import { goodsList, relevanceItemList } from '/@/api/app/goods';

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
      title: '商品ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      width: 160,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 160,
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '商品名称',
      component: 'Input',
    },
  ];

  const isLoaded = ref(false);
  const configId = ref(0);

  //商品选择表格
  const [registerGoodsTable, { getSelectRowKeys, setSelectedRowKeys, reload }] = useTable({
    title: '',
    rowKey: 'id',
    api: goodsList,
    afterFetch: (dataList) => {
      const itemIds = dataList.map((item) => item.id);
      getRelevanceItemList(itemIds);
    },
    columns: goodsTableSchema,
    pagination: true,
    striped: false,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: true,
    formConfig: {
      schemas: searchGoodsSchema,
      labelWidth: 80,
      baseColProps: {
        span: 6,
      },
    },
  });

  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    async (data: GoodsPickData) => {
      if (data) {
        if (isLoaded.value) reload();
        isLoaded.value = true;

        configId.value = data.configId || 0;
        setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
        actions.callback = data.callback;
        if (data.type) {
          rowSelection.type = data.type === 'single' ? 'radio' : 'checkbox';
        }
        if (data.disabled) {
          rowSelection.getCheckboxProps = () => ({
            disabled: data.disabled,
          });
          setModalProps({ showOkBtn: !data.disabled });
        }
      }
    },
  );

  async function getGoodsData(itemIds: number[] | string[]) {
    const { list } = await goodsList({
      ids: itemIds as number[],
      perPage: Math.max(itemIds.length, 20),
      page: 1,
    });
    return list;
  }

  async function handleSubmit() {
    const ids = getSelectRowKeys();
    const data: GoodsPickData = {
      ids: ids,
      rows: await getGoodsData(ids),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }

  async function getRelevanceItemList(itemIds: number[] | string[]) {
    try {
      const { list } = await relevanceItemList({
        itemIds,
        configId: configId.value,
        page: 1,
        perPage: itemIds.length + 1,
      });

      // 过滤当前选中的ids
      const ids = list.map((i) => i.itemId);

      if (ids && ids.length) {
        rowSelection.getCheckboxProps = (record) => ({ disabled: ids.includes(record.id) });
      }
    } catch (e) {}
  }
</script>
<style scoped>
  .rating-goods-pick-table :deep(.ant-checkbox-disabled .ant-checkbox-inner) {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
