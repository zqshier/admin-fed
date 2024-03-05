<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[{ label: '编辑', onClick: handleCompile.bind(null, record) }]" />
        </template>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { columns, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import {
    goodsRecommendList as listApi,
    goodsRecommendUpdate as updateApi,
  } from '/@/api/app/deco';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '猜你喜欢',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showIndexColumn: false,
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right' },
    useSearchForm: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 8 },
    },
    beforeEditSubmit,
  });

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  // 字段编辑
  async function beforeEditSubmit({ key, rawRecord, value }) {
    if (key !== 'sort') return false;

    if (value === '') {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await updateApi({ itemId: rawRecord.itemId, sort: Number(value) });
      reload();
      return true;
    } catch {
      return false;
    }
  }
</script>
