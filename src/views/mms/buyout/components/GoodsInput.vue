<template>
  <div>
    <div><a-button @click="handleAdd">添加商品</a-button></div>
    <div class="mt-4">
      <a-table
        size="small"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'price'">
            <a-input v-model:value="record.price" @change="updateValue" />
          </template>
          <template v-if="column.dataIndex === 'quantity'">
            <a-input-number
              class="no-require"
              v-model:value="record.quantity"
              :precision="0"
              @change="updateValue"
            />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-popconfirm title="确认删除?" @confirm="handleDel(index)" placement="topRight">
              <DeleteOutlined />
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <GoodsSkuPickModal @register="registerSkuPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import {
    Input as AInput,
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Table as ATable,
  } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { skuList } from '/@/api/app/goods';
  import { useModal } from '/@/components/Modal';
  import GoodsSkuPickModal, { GoodsSkuPickData } from '/@/views/components/GoodsSkuPickModal.vue';

  interface IDataInfo {
    id?: number;
    goodsId: number;
    skuId: number;
    enableLimit: boolean;
    quantity?: number;
    price: string;
    goodsName?: string;
    goodsSku?: string;
    goodsPrice?: number;
  }

  const props = defineProps<{
    value?: IDataInfo[];
  }>();

  const emit = defineEmits(['update:value', 'change', 'remove']);

  const tableDataList = ref<IDataInfo[]>([]);

  const [registerSkuPickModal, { openModal: openSkuPick }] = useModal();

  const columns: TableColumnType[] = [
    {
      title: '商品Id',
      dataIndex: 'goodsId',
      align: 'center',
      width: '70px',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
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
      width: '100px',
    },
    {
      title: '活动价',
      dataIndex: 'price',
      align: 'center',
      width: '100px',
    },
    {
      title: '限购数',
      dataIndex: 'quantity',
      align: 'center',
      width: '100px',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '90px',
    },
  ];

  function updateValue() {
    emit('update:value', tableDataList.value);
    emit('change', tableDataList.value);
  }

  function handleAdd() {
    openSkuPick(true, {
      callback: ({ rows }: GoodsSkuPickData) => {
        console.log(rows);
        if (!rows) return;

        for (const row of rows) {
          const { item, id: skuId, price, name } = row;
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
            // quantity: '',
            price: String(price),
          });
        }
        updateValue();
      },
    });
  }

  function handleDel(index: number) {
    console.debug('handleDel', index);
    const rows = tableDataList.value.splice(index, 1);
    updateValue();
    emit('remove', rows);
  }

  async function updateGoodsInfo() {
    if (tableDataList.value.length === 0) return;
    if (tableDataList.value[0].goodsName) return;

    const skuIds = tableDataList.value.map((item) => item.skuId);
    // console.log(skuIds);

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
      updateGoodsInfo();
    },
    {
      immediate: true,
    },
  );
</script>

<style scoped></style>
