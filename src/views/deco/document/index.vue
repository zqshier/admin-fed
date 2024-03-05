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
                label: '删除',
                popConfirm: {
                  title: '是否确认删除？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新建</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, primaryKey } from './data';
  import Drawer from './drawer.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { documentsList as listApi, documentsDel as delApi } from '/@/api/app/deco';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  import { usePageStore } from '/@/store/modules/page';

  const { getPreData } = usePageStore();

  const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord, deleteTableDataRecord }] = useTable({
    title: '文档列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: false,
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

  function handleDelete(row: Recordable) {
    delApi(row.code).then(() => deleteTableDataRecord(row.id));
  }

  //新增、编辑成功后
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
    } else {
      reload();
    }
  }

  const route = useRoute();

  onMounted(() => {
    if (route.name === 'Documents') {
      closeDrawer();
      const query = getPreData();
      if (query && query.title && query.code) {
        openDrawer(true, {
          isUpdate: true,
          record: { ...query },
        });
      }
    }
  });
</script>
