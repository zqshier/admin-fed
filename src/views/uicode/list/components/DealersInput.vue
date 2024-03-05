<template>
  <div>
    <div><a-button @click="handleAdd">添加经销商</a-button></div>
    <div class="mt-4">
      <a-table
        size="small"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'index'">{{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'num'">
            <a-input-number
              class="no-require"
              v-model:value="record.num"
              :precision="0"
              :min="1"
              :max="999999"
              @change="updateValue"
            />
          </template>
          <template v-if="column.dataIndex === 'type'">
            <ASelect
              v-model:value="record.type"
              :options="tasksTypeOptions"
              :style="{ width: '100px' }"
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
    <DealersPickModal @register="registerDealersPickModal" />
  </div>
</template>

<script setup lang="ts">
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import {
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Select as ASelect,
    Table as ATable,
  } from 'ant-design-vue';
  import { ref } from 'vue';
  import { tasksTypeOptions } from '../data';
  import DealersPickModal, { DistributorsPickData } from './DealersPickModal.vue';
  import { ETaskType } from '/@/api/app/model/uicodeModel';
  import { useModal } from '/@/components/Modal';

  interface IDataInfo {
    id?: number;
    name: string;
    code: string;
    num: number;
    type: ETaskType;
  }

  // const props = defineProps<{ value?: IDataInfo[] }>();

  const emit = defineEmits(['update:value', 'change', 'remove']);

  const tableDataList = ref<IDataInfo[]>([]);

  const [registerDealersPickModal, { openModal: openDealersPick }] = useModal();

  const columns: TableColumnType[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '经销商名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '经销商编码',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '二维码生成数量',
      dataIndex: 'num',
      align: 'center',
    },
    {
      title: '产品类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '50px',
    },
  ];

  function initData() {
    tableDataList.value = [];
  }

  function updateValue() {
    const data = tableDataList.value.map((item) => ({
      code: item.code,
      num: item.num,
      type: item.type,
    }));
    emit('update:value', data);
    emit('change', data);
  }

  function handleAdd() {
    openDealersPick(true, {
      // ids: tableDataList.value.map((i) => i.id),
      callback: ({ rows }: DistributorsPickData) => {
        // console.log(rows);
        if (!rows) return;

        for (const row of rows) {
          const { id, code, name } = row;
          // if (tableDataList.value.find((item) => item.id === id)) continue;
          tableDataList.value.push({ name, code, id, num: 0, type: ETaskType.lighter });
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

  defineExpose({ initData });
</script>

<style scoped></style>
