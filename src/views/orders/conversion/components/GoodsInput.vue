<template>
  <div>
    <div class="mb-2">
      <BasicTable @register="registerTable" :data-source="goodsDataSource" @edit-end="onEditEnd">
        <template #bodyCell="{ column, index }">
          <!-- <template v-if="column.key === 'specName'">
            <div class="flex flex-1 items-center justify-center">
              <span class="name flex-1" v-show="record.goodsName || record.specName">
                {{
                  record.specName ? `${record.goodsName} - ${record.specName}` : record.goodsName
                }}
              </span>
              <a-button type="link" @click="showGoodsPick(index)">选择商品</a-button>
            </div>
          </template> -->
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '删除',
                  popConfirm: { title: '是否删除？', confirm: () => handleDel(index) },
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <a-button class="ml-2" type="primary" size="small" @click="handleAdd">添加商品</a-button>

    <!-- <ProductPickModal @register="registerGoodsPick" /> -->
  </div>
</template>

<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { computed } from 'vue';
  import { IOrderConversionGoodsInfo } from '/@/api/app/model/ordersModel';
  // import { useModal } from '/@/components/Modal';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  // import ProductPickModal from '/@/views/components/ProductPickModal.vue';

  const props = defineProps({
    value: {
      type: Array<IOrderConversionGoodsInfo>,
      default: [],
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const goodsColumns: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: 200,
      edit: true,
      editComponent: 'Input',
      editComponentProps: { maxlength: 30, showCount: true },
    },
    {
      title: '商品条形码',
      dataIndex: 'goodsBarCode',
      align: 'center',
      edit: true,
      editComponent: 'Input',
      editComponentProps: { maxlength: 30, showCount: true },
    },
    {
      title: '商品数量',
      dataIndex: 'num',
      align: 'center',
      edit: true,
      editComponent: 'InputNumber',
      editComponentProps: { min: 1, max: 999999, controls: false },
    },
    {
      title: '商品实付金额',
      dataIndex: 'amount',
      align: 'center',
      edit: true,
      editComponent: 'InputNumber',
      editComponentProps: { min: 0.01, max: 999999, precision: 2, controls: false },
    },
    {
      title: '备注',
      dataIndex: 'notes',
      align: 'center',
      edit: true,
      editComponent: 'Input',
      editComponentProps: { maxlength: 50, showCount: true },
    },
  ];

  const goodsDataSource = computed(() => props.value || []);

  // const [registerGoodsPick, { openModal: openGoodsPick }] = useModal();

  const [registerTable, { getDataSource }] = useTable({
    // rowKey: 'goodsBarCode',
    showIndexColumn: false,
    columns: goodsColumns,
    pagination: false,
    bordered: true,
    clickToRowSelect: false,
    showTableSetting: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: undefined, width: 140 },
  });

  const updateValue = (value: Recordable) => {
    value = value.map((i) => ({
      goodsBarCode: i.goodsBarCode,
      goodsName: i.goodsName,
      notes: i.notes,
      num: i.num,
      skuBarCode: i.skuBarCode,
      specName: i.specName,
      amount: i.amount,
    }));
    console.debug('updateValue value', value);
    emit('update:value', value);
    emit('change', value);
  };

  // function showGoodsPick(index: number) {
  //   openGoodsPick(true, {
  //     ids: (goodsDataSource.value && goodsDataSource.value.map((i) => i.goodsBarCode)) || [],
  //     callback: async (data: { barCodes: string[]; rows: IProductsListItem[] }) => {
  //       console.debug('openGoodsPick callback data', data);
  //       const { rows = [] } = data;
  //       const values = cloneDeep(goodsDataSource.value);
  //       const item = rows[0];
  //       values[index] = {
  //         goodsName: item.name,
  //         specName: '',
  //         goodsBarCode: item.barcode,
  //         skuBarCode: item.barcode,
  //         num: 1,
  //         notes: '',
  //         amount: '',
  //       };
  //       updateValue(values);
  //     },
  //   });
  // }

  function handleAdd() {
    const values = goodsDataSource.value;
    values.push({
      goodsName: '',
      specName: '',
      goodsBarCode: '',
      skuBarCode: '',
      num: 0,
      notes: '',
      amount: '',
    });
    updateValue(values);
  }

  function handleDel(index: number) {
    const values = cloneDeep(goodsDataSource.value);
    values.splice(index, 1);
    updateValue(values);
  }

  function onEditEnd() {
    updateValue(getDataSource());
  }
</script>

<style lang="less" scoped>
  .name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
</style>
