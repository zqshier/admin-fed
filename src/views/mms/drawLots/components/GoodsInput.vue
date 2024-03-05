<template>
  <div>
    <div><a-button @click="handleAdd">添加商品</a-button></div>
    <div class="mt-4">
      <BasicTable size="small" @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '删除',
                  icon: 'ic:outline-delete-outline',
                  popConfirm: {
                    title: '是否删除？',
                    confirm: handleDel.bind(null, record),
                  },
                  disabled: disabled,
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <GoodsSkuPickModal @register="registerSkuPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue';
  import { IGoodsInputDataInfo } from '../data';
  import { skuList } from '/@/api/app/goods';
  import { useModal } from '/@/components/Modal';
  import GoodsSkuPickModal, { GoodsSkuPickData } from '/@/views/components/GoodsSkuPickModal.vue';
  import { BasicTable, BasicColumn, useTable, TableAction } from '/@/components/Table';

  const props = defineProps<{
    value?: IGoodsInputDataInfo[];
    disabled?: boolean;
  }>();

  const emit = defineEmits(['update:value', 'change', 'remove']);

  const tableDataList = ref<IGoodsInputDataInfo[]>([]);

  const columns: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      ellipsis: false,
    },
    {
      title: '规格',
      dataIndex: 'goodsSku',
      align: 'center',
    },
    {
      title: '商品价格',
      dataIndex: 'goodsPrice',
      align: 'center',
      width: '80px',
    },
    {
      title: '库存',
      dataIndex: 'goodsStock',
      align: 'center',
      width: '80px',
    },
    {
      title: '抽选数量',
      dataIndex: 'quantity',
      edit: true,
      editRule: async (text, record) => {
        if (+text === 0) return '抽选数量不能为0';
        if (text > record.goodsStock) {
          return '抽选数量不能大于库存';
        }
        return '';
      },
      editComponent: 'InputNumber',
      align: 'center',
      width: '150px',
      editComponentProps: {
        min: 1,
        onchange: () => {
          updateValue();
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '150px',
    },
  ];

  const [registerSkuPickModal, { openModal: openSkuPick }] = useModal();
  const [registerTable, { deleteTableDataRecord, setProps }] = useTable({
    columns,
    pagination: false,
    bordered: true,
    showIndexColumn: false,
    rowKey: 'skuId',
  });

  function updateValue() {
    emit('update:value', tableDataList.value);
    emit('change', tableDataList.value);
  }

  function handleAdd() {
    const ids = tableDataList.value.map((item) => item.skuId);
    openSkuPick(true, {
      callback: ({ rows }: GoodsSkuPickData) => {
        console.debug('handleAdd', rows);
        if (!rows) return;
        deleteTableDataRecord(ids);
        for (const row of rows) {
          const { item, id: skuId, price, name, stock } = row;
          if (tableDataList.value.find((item) => item.skuId === skuId)) {
            continue;
          }
          tableDataList.value.push({
            goodsId: item.id,
            skuId,
            enableLimit: true,
            goodsName: item.name,
            goodsSku: name,
            goodsPrice: price,
            goodsStock: stock,
            quantity: 0,
            price: String(price),
          });
        }
        updateValue();
      },
      type: 'single',
      ids,
    });
  }

  function handleDel(row: Recordable) {
    console.debug('handleDel', row);
    deleteTableDataRecord(row.skuId);
    updateValue();
    emit('remove', row);
  }

  async function updateGoodsInfo() {
    if (tableDataList.value.length === 0) return;
    if (tableDataList.value[0].goodsName) return;

    const skuIds = tableDataList.value.map((item) => item.skuId);
    console.log(skuIds);

    const { list } = await skuList({ skuIds, perPage: skuIds.length, page: 1 });
    for (const o of tableDataList.value) {
      const s = list.find((a) => a.id === o.skuId);
      if (s) {
        o.goodsName = s.item.name;
        o.goodsPrice = s.price;
        o.goodsSku = s.comb.map((a) => a.v).join(' ');
      }
    }
  }

  watch(
    () => props.value,
    (val) => {
      tableDataList.value = val || [];
      nextTick(() => {
        setProps({ dataSource: tableDataList.value });
      });
      updateGoodsInfo();
    },
    {
      immediate: true,
    },
  );
  watch(
    () => props.disabled,
    (val) => {
      for (const column of columns) {
        column['dataIndex'] === 'quantity' ? (column['edit'] = !val) : '';
      }
      nextTick(() => {
        setProps({ columns });
      });
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped></style>
