<template>
  <div>
    <a-button @click="handleAdd">+新增连签奖励</a-button>
    <BasicTable class="w-700px" @register="registerTable" :dataSource="dataSource">
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除？',
                  confirm: handleDelete.bind(null, index),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <p>每个月结束后连续签到天数重新计算</p>
  </div>
</template>

<script setup lang="ts">
  import { InputNumber } from 'ant-design-vue';
  import { h, ref, watchEffect } from 'vue';
  import { BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';

  interface IRow {
    days: number | string;
    points: number | string;
  }

  const props = defineProps({
    value: {
      type: Array as PropType<IRow[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:value', 'change', 'validate']);

  const columns: BasicColumn[] = [
    {
      title: '连签天数',
      dataIndex: 'days',
      customRender: ({ record, value }: Recordable) => {
        return h(InputNumber, {
          min: 2,
          max: 99,
          addonAfter: '天',
          controls: false,
          value,
          onChange: (value) => {
            record.days = value;
            emit('validate');
          },
        });
      },
    },
    {
      title: '连签奖励',
      dataIndex: 'points',
      customRender: ({ record, value }: Recordable) => {
        return h(InputNumber, {
          min: 1,
          max: 99999,
          addonAfter: '积分',
          controls: false,
          value,
          onChange: (value) => {
            record.points = value;
            emit('validate');
          },
        });
      },
    },
  ];

  const dataSource = ref<IRow[]>([]);

  watchEffect(() => {
    dataSource.value = props.value;
  });

  const [registerTable] = useTable({
    rowKey: 'id',
    columns: columns,
    bordered: true,
    showTableSetting: false,
    pagination: false,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: undefined },
    useSearchForm: false,
  });

  function handleAdd() {
    const add = { days: '', points: '' };
    dataSource.value.push(add);
    emit('update:value', dataSource.value);
  }

  function handleDelete(idx) {
    dataSource.value.splice(idx, 1);
  }
</script>

<style scoped></style>
