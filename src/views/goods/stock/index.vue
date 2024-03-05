<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'item.name'">
          <div
            v-if="!record.isChild"
            class="inline-flex items-center align-middle"
            :style="{ width: '100%' }"
          >
            <div class="w-60px">
              <TableImg :imgList="[record.image]" :size="60" />
            </div>
            <div
              class="text-left"
              :style="{ 'z-index': 99, width: '70%', 'white-space': 'pre-line' }"
              >{{ record.item.name }}</div
            >
          </div>
        </template>
        <template v-if="column.key === 'stock'">
          <div class="editable-cell">
            <div
              v-if="
                record.editable &&
                editableData.skuId === record.skuId &&
                editableData.storeCode === record.storeCode
              "
              class="editable-cell-input-wrapper"
            >
              <InputNumber
                :max="99999"
                :min="0"
                v-model:value="editableData.stock"
                @press-enter="save(editableData)"
                @press-esc="cancel"
              />
              <check-outlined
                :class="['editable-cell__icon', 'mx-2']"
                @click="save(editableData)"
              />
              <CloseOutlined class="editable-cell__icon" @click="cancel" />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ record.stock }}
              <edit-outlined
                class="editable-cell__icon"
                v-if="record.storeCode && record.editable"
                @click="edit(record)"
              />
            </div>
          </div>
        </template>
      </template>
      <template #toolbar>
        <a-button v-if="false" type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { message, InputNumber } from 'ant-design-vue';
  import { ref } from 'vue';
  import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableImg } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import { skuStockList as listApi, skuStockUpdate } from '/@/api/app/goods';
  import { giftCardList } from '/@/api/app/giftCard';

  const editableData = ref({} as Recordable);
  let stockOri = 0;

  const edit = (record: Recordable) => {
    editableData.value = record;
    stockOri = record.stock;
    console.log('edit', editableData);
  };
  const save = async (record: Recordable) => {
    console.log('save', record);
    // 礼品卡检查库存
    if (record.goodsType === 1) {
      const res = await giftCardList({ ids: record.meta.giftCardId, page: 1, perPage: 3 });
      const c = res.list[0]?.counter;
      const n = c?.totalCount - c?.salesCount;
      if (record.stock > n) {
        message.error(`礼品卡库存不足${record.stock}`);
        return;
      }
    }

    try {
      await skuStockUpdate(record.skuId, record.storeCode, record.stock);
    } catch (err) {
      message.error((err as any).message);
      return;
    }

    message.success('保存成功');
    editableData.value = {};
  };
  const cancel = () => {
    editableData.value.stock = stockOri;
    editableData.value = {};
  };

  const [registerTable] = useTable({
    title: pageTitle,
    api: listApi,
    afterFetch: (list: Recordable[], rowData: Recordable) => {
      console.log(list, rowData);
      return list.map((row) => {
        return {
          ...row,
          storeName: '所有门店',
          children: rowData.stores.map((s) => {
            const m = row.stores.find((n) => n.code === s.code);
            return {
              goodsType: row.item.type,
              skuId: row.id,
              stock: (m && m.stock) || 0,
              storeCode: s.code,
              storeName: s.name,
              item: {},
              image: '',
              editable: row.item.source !== 'sync',
              meta: row.meta,
            };
          }),
        };
      });
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    // childrenColumnName: 'stores',
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      actionColOptions: {
        span: 24,
      },
      baseColProps: {
        span: 8,
      },
    },
  });

  //导出
  function handleExport() {}
</script>
