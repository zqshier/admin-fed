<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="row-img-wrap">
            <div class="row-img">
              <TableImg v-if="record.image" :size="30" :imgList="[record.image]" />
              <span>{{ record.name }}</span>
            </div>
          </div>
        </template>
        <template v-if="column.key === 'position'">
          <div v-if="record.sys !== 1" class="flex items-center justify-start">
            <CellEdit
              v-model:value="record.position"
              :record="record"
              :beforeSubmit="beforeSubmitPosition"
            />
          </div>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '新增子分组',
                onClick: handleAddChildren.bind(null, record),
                ifShow: record.children !== null && record.sys !== 1,
              },
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
                ifShow: record.sys !== 1,
              },
              {
                label: '删除',
                ifShow: record.sys !== 1,
                popConfirm: {
                  title: '是否确认删除' + record.name + '？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加分组</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { columns, primaryKey } from './data';
  import Drawer from './drawer.vue';
  import { catalogsDelete, catalogsList, catalogsUpdate } from '/@/api/app/goods';
  import { useDrawer } from '/@/components/Drawer';
  import { BasicTable, TableAction, TableImg, useTable } from '/@/components/Table';
  import CellEdit from '/@/views/components/CellEdit.vue';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '商品分组',
    api: catalogsList,
    afterFetch: (data) => {
      return data.map((item: Recordable) => {
        if (item.children) {
          item.children.forEach((child: Recordable) => {
            child.children = null;
          });
        }
        return item;
      });
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    showHeader: true,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', align: 'left' },
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
    catalogsDelete(row[primaryKey]).then(() => {
      message.success('删除成功');
      reload();
    });
  }

  function handleAddChildren(row: Recordable) {
    openDrawer(true, {
      isAddChildren: true,
      record: row,
    });
  }

  //新增、编辑成功后
  // function handleSuccess({ isUpdate, values }) {
  //   if (isUpdate) {
  //     const result = updateTableDataRecord(values.id, values);
  //     console.log(result);
  //   } else {
  //     reload();
  //   }
  // }

  //修改排序
  async function beforeSubmitPosition({ record, value }) {
    await catalogsUpdate(record[primaryKey], { position: value } as any);
    message.success('修改成功');
    reload();
    return value;
  }
</script>

<style lang="less" scoped>
  .tabs-wrap {
    flex: 1;
    padding-left: 10px;
    display: flex;
    align-items: center;

    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }

    :deep(.ant-tabs-nav-operations) {
      display: none;
    }
  }

  .row-img-wrap {
    display: inline-block;
  }
  .row-img {
    display: flex;
    align-items: center;

    :deep(.vben-basic-table-img) {
      margin: 0;
      margin-right: 10px;
    }
  }
</style>
