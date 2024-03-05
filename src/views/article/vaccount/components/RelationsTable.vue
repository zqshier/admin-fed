<template>
  <div class="mt-3" v-if="detailDataList.length > 0">
    <BasicTable
      size="small"
      :columns="baseColumns"
      :data-source="detailDataList"
      :pagination="false"
      :showIndexColumn="false"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'image'">
          <ImageUpload
            @change="updateValue"
            size="small"
            v-model:value="record[column.dataIndex]"
          />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '删除',
                popConfirm: {
                  title: '是否删除？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import { UsersListGoodsItem } from '/@/api/app/model/articleModel';
  import { ImageUpload } from '/@/components/ImageUpload';
  import { BasicTable, BasicColumn, TableAction } from '/@/components/Table';

  const props = defineProps({
    value: {
      type: Array<UsersListGoodsItem>,
    },
  });

  const emit = defineEmits(['update:value', 'change', 'delete']);

  const baseColumns: BasicColumn[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      align: 'center',
      width: '80px',
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '商品展示图',
      dataIndex: 'image',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: '150px',
    },
  ];

  const detailDataList = ref<UsersListGoodsItem[]>([]);
  const isInitValue = ref(false);
  const isUpdateValue = ref(false);

  watch(
    () => props.value,
    () => {
      if (!isUpdateValue.value) {
        initValue();
      }
    },
    {
      deep: true,
    },
  );

  async function initValue() {
    isInitValue.value = true;

    if (props.value && props.value.length > 0) {
      await nextTick();
      detailDataList.value = props.value;
    } else {
      detailDataList.value = [];
    }
    nextTick(() => (isInitValue.value = false));
  }

  function updateValue() {
    isUpdateValue.value = true;
    let newList = [...detailDataList.value];
    emit('update:value', newList);
    emit('change', newList);
    nextTick(() => {
      isUpdateValue.value = false;
    });
  }

  function handleDelete(row: Recordable) {
    detailDataList.value = detailDataList.value.filter((item) => item.id != row.id);
    updateValue();
  }
</script>
<style scoped>
  .image-upload-wrap {
    justify-content: center;
  }
  .vben-basic-table-action.left {
    justify-content: center;
  }
</style>
