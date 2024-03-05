<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a-button class="btn-line-1" type="link" @click="handleCompile(record)">
            {{ record.name }}
          </a-button>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[{ label: '发放记录', onClick: handleDetail.bind(null, record) }]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <DetailDrawer @register="registerDetailDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import DetailDrawer from './components/DetailDrawer.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { birthdayGiftsList as listApi } from '/@/api/app/mms';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 },
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
  });

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  // 详情
  async function handleDetail(row: Recordable) {
    openDetailDrawer(true, { ...row });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }
</script>
