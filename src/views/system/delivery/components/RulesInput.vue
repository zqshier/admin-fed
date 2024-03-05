<template>
  <div class="rules-input-wrap">
    <div class="mb-2" v-show="dataList.length > 0">
      <a-table :dataSource="dataList" :pagination="false" bordered :columns="columns" size="small">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'regions'">
            <div class="regions-wrap">
              <div class="text">{{ getRegionByCode(record[column.dataIndex]) }}</div>
              <a-button class="btn" type="link" size="small" @click="handleEditRegion(index)"
                >编辑</a-button
              >
              <a-popconfirm @confirm="handleDel(index)" title="确认删除？">
                <a-button class="btn" type="link" size="small">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
          <template v-else>
            <a-input-number
              @change="updateValue"
              size="small"
              v-model:value="record[column.dataIndex]"
            />
          </template>
        </template>
      </a-table>
    </div>
    <div><a-button @click="handleAddRegion">指定可配送区域和运费</a-button></div>
    <RegionModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import { columns, getRegionByCode } from '../data';
  import { ref, watch } from 'vue';
  import { deliveryTemplatesList, DeliveryTemplatesRule } from '/@/api/app/system';
  import {
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Table as ATable,
  } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import RegionModal from './RegionModal.vue';

  const props = defineProps({
    value: {
      type: Array as PropType<DeliveryTemplatesRule[]>,
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  const dataList = ref<DeliveryTemplatesRule[]>([]);
  const excludeRegions = ref<string[]>([]);

  const [registerModal, { openModal }] = useModal();

  function getExcludeRegion(editRegions?: string[]) {
    const arr: string[] = [];
    for (const r of excludeRegions.value) {
      if (editRegions?.includes(r)) continue;
      arr.push(r);
    }
    const list = dataList.value;

    for (const l of list) {
      if (l.regions) {
        for (const r of l.regions) {
          if (editRegions?.includes(r)) continue;
          arr.push(r);
        }
      }
    }
    return arr;
  }

  function handleAddRegion() {
    openModal(true, {
      cb: (list: string[]) => {
        dataList.value.push({
          key: Date.now() + '',
          regions: list,
        });
        updateValue();
      },
      exclude: getExcludeRegion(),
    });
  }

  function handleEditRegion(idx: number) {
    const record = dataList.value[idx];
    openModal(true, {
      cb: (list: string[]) => {
        record.regions = list;
        updateValue();
      },
      exclude: getExcludeRegion(record.regions),
      selected: record.regions,
    });
  }

  function handleDel(index: number) {
    dataList.value.splice(index, 1);
  }

  async function initValue() {
    dataList.value = props.value || [];
    const remoteList = await deliveryTemplatesList();
    const arr: string[] = [];
    for (const tpl of remoteList.list) {
      for (const rule of tpl.valuationRules) {
        if (rule.regions) arr.push(...rule.regions);
      }
    }
    excludeRegions.value = arr;
  }

  function updateValue() {
    emit('update:value', dataList.value);
    emit('change', dataList.value);
  }

  watch(
    () => props.value,
    () => initValue(),
    { deep: true },
  );
</script>

<style lang="less" scoped>
  .rules-input-wrap {
    :deep(.ant-table-wrapper) {
      padding: 0;
    }
  }
  .regions-wrap {
    display: flex;
    .text {
      flex: 1;
      text-align: left;
      white-space: break-spaces;
    }
    .btn {
      flex-shrink: 0;
      padding-left: 2px;
      padding-right: 2px;
    }
  }
</style>
