<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
              {
                label: '抽奖规则',
                onClick: handleRule.bind(null, record),
              },
              {
                label: '中奖记录',
                onClick: handleRecord.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <LotteriesRecordDrawer @register="registerRecordDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { lotteriesList as listApi } from '/@/api/app/lotteries';
  import LotteriesRecordDrawer from './components/LotteriesRecordDrawer.vue';
  import { useRouter } from 'vue-router';
  import { usePageStore } from '/@/store/modules/page';

  const { setPreData } = usePageStore();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const router = useRouter();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
    },
    useSearchForm: true,
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
        style: 'padding-left:10px;',
      },
      baseColProps: {
        span: 6,
      },
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

  // 抽奖规则
  function handleRule(row: Recordable) {
    setPreData({ title: `${row.name}规则`, code: `lottery-rule-${row.code}` });
    router.push({
      name: 'Documents',
    });
  }

  // 中奖记录
  function handleRecord(row: Recordable) {
    openRecordDrawer(true, {
      record: row,
    });
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate && values?.[primaryKey]) {
      const result = updateTableDataRecord(values[primaryKey], values);
      console.log(result);
    } else {
      reload();
    }
  }
</script>
