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
          <template v-if="column.dataIndex === 'sort'">
            <a-input-number
              class="no-require"
              :value="record.sort"
              :precision="0"
              default-value="0"
              @change="
                (value) => {
                  record.sort = value || 0;
                  updateValue();
                }
              "
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
    <GoodsPickModal @register="registerSkuPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import {
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Table as ATable,
  } from 'ant-design-vue';
  import { h, ref, watch } from 'vue';
  import { goodsList } from '/@/api/app/goods';
  import { EGoodsType } from '/@/api/app/model/goodsModel';
  import { useModal } from '/@/components/Modal';
  import GoodsPickModal, { GoodsPickData } from '/@/views/components/GoodsPickModal.vue';
  import ScaleImage from '/@/views/components/ScaleImage.vue';

  interface IDataInfo {
    id: number; //商品ID
    name: string; //商品名称
    image: string; //商品图
    sort: number;
  }

  const props = defineProps<{
    value?: { itemId: number; sort: number }[];
  }>();

  const emit = defineEmits(['update:value', 'change', 'remove']);

  const tableDataList = ref<IDataInfo[]>([]);

  const [registerSkuPickModal, { openModal: openGoodsPick }] = useModal();

  const columns: TableColumnType[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      customRender: ({ record }: Recordable) => {
        return h('div', { class: 'flex items-center text-left' }, [
          h(ScaleImage, { size: 60, src: record.image, mode: 'cover', class: 'mr-2' }),
          h('div', record.name),
        ]);
      },
    },
    { title: '排序(倒序)', dataIndex: 'sort' },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '90px',
    },
  ];

  function updateValue() {
    const values = tableDataList.value.map((i) => ({ itemId: i.id, sort: i.sort }));
    emit('update:value', values);
    emit('change', values);
  }

  function handleAdd() {
    openGoodsPick(true, {
      ids: tableDataList.value.map((i) => i.id),
      checkMaxLen: 10,
      hidenFormField: 'types',
      defaultFormProps: { types: EGoodsType.goods },
      callback: ({ rows }: GoodsPickData) => {
        console.log(rows);
        if (!rows) return;
        let list: IDataInfo[] = [];
        for (const row of rows) {
          const { id, image, name } = row;
          const s = tableDataList.value.find((item) => item.id === id);
          list.push({ id, image, name, sort: 0, ...s });
        }
        tableDataList.value = list;
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

    const ids = tableDataList.value.map((item) => item.id);

    const { list } = await goodsList({ ids, perPage: ids.length, page: 1 });
    for (const o of tableDataList.value) {
      const s = list.find((a) => a.id === o.id);
      if (s) {
        o.image = s.image;
        o.name = s.name;
      }
    }
  }

  watch(
    () => props.value,
    (val) => {
      tableDataList.value =
        (val?.length &&
          val.map((i) => {
            const s = tableDataList.value.find((a) => a.id === i.itemId);
            return { id: i.itemId, sort: i.sort, image: '', name: '', ...s };
          })) ||
        [];
      updateGoodsInfo();
    },
    { immediate: true },
  );
</script>

<style scoped></style>
