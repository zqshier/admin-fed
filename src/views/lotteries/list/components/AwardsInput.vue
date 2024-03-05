<template>
  <div class="py-1"><a-button type="primary" size="small" @click="handleAdd">添加</a-button></div>
  <a-table size="small" :columns="columns" :data-source="dataList" :pagination="false" bordered>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'action'">
        <a-popconfirm title="是否确认删除？" @confirm="handleDelete(index)" placement="left">
          <a-button type="link" size="small">删除</a-button>
        </a-popconfirm>
      </template>
      <template v-if="column.dataIndex === 'probability'">
        <a-input-number
          :class="{
            'no-require':
              record.probability !== '' &&
              record.probability !== undefined &&
              record.probability !== null,
          }"
          style="width: 100%"
          v-model:value="record.probability"
          :min="0"
          :max="100"
          @change="handleChange()"
        />
      </template>
      <template v-if="column.dataIndex === 'hitLimitPerUser'">
        <a-input-number
          :class="{
            'no-require':
              record.hitLimitPerUser !== '' &&
              record.hitLimitPerUser !== undefined &&
              record.hitLimitPerUser !== null,
          }"
          style="width: 100%"
          v-model:value="record.hitLimitPerUser"
          :min="0"
          :max="99"
          :precision="0"
          @change="
            (value) => {
              record.hitLimitPerUser = value || 0;
              handleChange();
            }
          "
        />
      </template>
      <template v-if="column.dataIndex === 'position'">
        <a-input-number
          class="no-require"
          style="width: 100%"
          v-model:value="record.position"
          @change="handleChange()"
        />
      </template>
      <template v-if="column.dataIndex === 'disabled'">
        <a-switch v-model:checked="record.disabled" @change="handleChange()" />
      </template>
      <template v-if="column.dataIndex === 'tips'">
        <a-input
          :class="{ 'no-require': !record.tips || record.tips.length < 100 }"
          style="width: 100%"
          v-model:value="record.tips"
          @change="handleChange()"
        />
      </template>
    </template>
  </a-table>
  <AwardsPickModal @register="registerAwardsPick" />
</template>

<script lang="ts" setup>
  import type { TableColumnType } from 'ant-design-vue';
  import {
    Input as AInput,
    InputNumber as AInputNumber,
    Popconfirm as APopconfirm,
    Switch as ASwitch,
    Table as ATable,
  } from 'ant-design-vue';
  import { pick } from 'lodash-es';
  import { h, ref, watch } from 'vue';
  import { AwardsTypeList } from '../../awards/data';
  import AwardsPickModal from './AwardsPickModal.vue';
  import { LotteriesAwardsModel } from '/@/api/app/model/lotteriesModel';
  import { useModal } from '/@/components/Modal';
  import ScaleImage from '/@/views/components/ScaleImage.vue';

  const columns = ref<TableColumnType[]>([
    { title: '奖品名称', dataIndex: 'name', align: 'center', width: 120 },
    {
      title: '奖品类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      customRender: ({ value }) => {
        const item = AwardsTypeList.find((i) => i.value === value);
        return item?.label;
      },
    },
    {
      title: '缩略图',
      dataIndex: 'image',
      align: 'center',
      width: 100,
      customRender: ({ value }) => {
        return h('div', { class: 'flex items-center justify-center' }, [
          h(ScaleImage, { size: 60, src: value, mode: 'cover' }),
        ]);
      },
    },
    {
      title: '剩余库存',
      width: 100,
      dataIndex: 'stock',
      align: 'center',
      customRender: ({ record }: Recordable) => record.stock - record.sent,
    },
    { title: '已发放数量', width: 100, dataIndex: 'sent', align: 'center' },
    { title: '概率', dataIndex: 'probability', align: 'center', width: 130 },
    { title: '风控', dataIndex: 'disabled', align: 'center', width: 100 },
    { title: '限制每人中奖次数', dataIndex: 'hitLimitPerUser', align: 'center', width: 130 },
    { title: '排序(降序)', dataIndex: 'position', align: 'center', width: 130 },
    { title: '中奖提示', width: 100, dataIndex: 'tips', align: 'center' },
    { title: '操作', width: 80, dataIndex: 'action', align: 'center' },
  ]);

  const dataList = ref<LotteriesAwardsModel[]>([]);

  const [registerAwardsPick, { openModal }] = useModal();

  interface Props {
    value?: LotteriesAwardsModel[] | undefined;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: () => [],
  });

  const emit = defineEmits(['update:value', 'change', 'deleteAward']);

  function initValue() {
    if (props.value) {
      dataList.value = props.value.map((item) => {
        return {
          ...item,
          ...pick(item.award, 'name', 'image', 'type'),
        };
      });
    } else {
      dataList.value = [];
    }
  }

  watch(
    () => props.value,
    () => {
      initValue();
    },
  );

  function handleAdd() {
    openModal(true, {
      cb: (data: LotteriesAwardsModel[]) => {
        data.forEach((item) => {
          if (!dataList.value.find((v) => v.awardId === item.awardId)) {
            dataList.value.push({
              ...item,
              position: 0,
              disabled: false,
              id: 0,
              hitLimitPerUser: 0,
            });
          }
        });
        handleChange();
      },
    });
  }

  function handleDelete(index: number) {
    const d = dataList.value.splice(index, 1);
    if (d[0].id) {
      emit('deleteAward', d[0].id);
    }
    handleChange();
  }

  function handleChange() {
    emit('update:value', dataList.value);
    emit('change', dataList.value);
  }
</script>

<style lang="less" scoped>
  .no-require {
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
  }
</style>
