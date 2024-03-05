<template>
  <div style="width: 400px">
    <div class="mb-2"
      ><a-checkbox v-model:checked="checked">指定日期</a-checkbox>
      <a-button @click="addDate">添加日期</a-button></div
    >
    <a-table
      size="small"
      :columns="columns"
      :data-source="tableDataList"
      :pagination="false"
      bordered
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'date'">
          <date-picker-ex
            v-model:value="record.date"
            format="YYYY-MM-DD"
            :show-time="false"
            :use-format="true"
          />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="deleteRecord(index)">
            <DeleteOutlined />
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { Table as ATable, Checkbox as ACheckbox } from 'ant-design-vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { reactive, ref, watch } from 'vue';
  import DatePickerEx from '/@/components/DatePickerEx/src/DatePickerEx.vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    value: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  interface IState {
    meta: { date?: string[] };
    flag: 'daily' | 'doc';
  }

  const state = reactive<IState>({
    flag: 'doc',
    meta: {},
  });

  const lockUpdate = ref(false);
  const lockChange = ref(false);

  const columns: TableColumnType[] = [
    {
      title: '年月日',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '90px',
    },
  ];

  interface IDataInfo {
    date: string;
  }

  const tableDataList = ref<IDataInfo[]>([]);

  const checked = ref(false);

  function addDate() {
    tableDataList.value.push({
      date: '',
    });
  }

  function deleteRecord(index: number) {
    tableDataList.value.splice(index, 1);
  }

  function updateValue() {
    if (lockChange.value) return;
    state.flag = 'daily';
    const dates = tableDataList.value.map((item) => item.date).filter((item) => !!item);
    state.meta = checked.value && dates.length ? { date: dates } : {};
    lockUpdate.value = true;
    console.log('updateValue', [state.flag, state.meta]);
    emit('update:value', [state.flag, state.meta]);
    emit('change', [state.flag, state.meta]);
    setTimeout(() => {
      lockUpdate.value = false;
    }, 100);
  }

  watch(
    () => tableDataList.value,
    () => {
      updateValue();
    },
    { deep: true },
  );

  watch(
    () => checked.value,
    () => {
      updateValue();
    },
  );

  watch(
    () => props.value,
    (val) => {
      if (lockUpdate.value) return;
      lockChange.value = true;
      setTimeout(() => {
        lockChange.value = false;
      }, 100);
      if (val && val.length === 2) {
        state.flag = val[0] || 'doc';
        state.meta = val[1] || {};
        if (state.flag === 'daily') {
          tableDataList.value = (state.meta?.date || []).map((item) => ({ date: item }));
          checked.value = tableDataList.value.length > 0;
        } else {
          checked.value = false;
          tableDataList.value = [];
        }
      } else {
        tableDataList.value = [];
        checked.value = false;
      }
    },
    { immediate: true, deep: true },
  );
</script>

<style scoped></style>
