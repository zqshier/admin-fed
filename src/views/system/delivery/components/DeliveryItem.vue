<template>
  <div class="delivery-item-wrap" v-if="value">
    <div class="title-wrap">
      <div class="title">{{ value.name }}</div>
      <div class="info">
        <span class="mr-3">订单实付满{{ value.threshold }}包邮</span>
        <span>最后编辑时间：</span>
        <span>{{ getTime(value.updatedAt) }}</span>
      </div>
    </div>
    <div class="table-wrap">
      <a-table
        size="small"
        :columns="tableColumns"
        :data-source="dataList"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'regions'">
            <div class="regions-wrap">
              <div class="text">{{ getRegionByCode(record[column.dataIndex]) }}</div>
            </div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DeliveryTemplates, DeliveryTemplatesRule } from '/@/api/app/system';
  import { columns, getRegionByCode } from '../data';
  import { onMounted, watch, ref } from 'vue';
  import type { TableColumnType } from 'ant-design-vue';
  import { Table as ATable } from 'ant-design-vue';
  import dayjs from 'dayjs';

  const props = defineProps({
    value: {
      type: Object as PropType<DeliveryTemplates>,
    },
  });

  const emit = defineEmits(['edit']);

  const tableColumns = ref<TableColumnType[]>([]);
  const dataList = ref<DeliveryTemplatesRule[]>([]);

  function handleEdit(record: DeliveryTemplates) {
    emit('edit', record);
  }

  function getTime(date?: string) {
    if (!date) return '-';
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
  }

  function initValue() {
    const list = props.value?.valuationRules || [];
    const newColumns = [...columns];
    newColumns.push({
      title: '操作',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      customCell: (_, rowIndex: number) => {
        if (rowIndex === 0) {
          return { rowSpan: list.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    });
    tableColumns.value = newColumns as TableColumnType[];
    setTimeout(() => (dataList.value = list), 100);
  }

  watch(
    () => props.value,
    () => initValue(),
    { deep: true },
  );

  onMounted(() => {
    initValue();
  });
</script>

<style lang="less" scoped>
  .delivery-item-wrap {
    margin-bottom: 20px;
    .title-wrap {
      border: 1px solid #f0f0f0;
      border-bottom: none;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .title {
        flex: 1;
        font-size: 20px;
      }
      .info {
        font-size: 14px;
      }
    }
    .table-wrap {
      margin-top: -1px;
      :deep(.ant-table-wrapper) {
        padding: 0;
      }
    }
  }
</style>
