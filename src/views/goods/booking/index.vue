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
                label: '复制',
                onClick: handleCopy.bind(null, record),
              },
            ]"
          />
        </template>
        <template v-if="column.key === 'bookedBaseNumbers'">
          <div class="num-wrap">
            <div class="num">{{ record.bookedNumbers + record.bookedBaseNumbers }}</div>
            <div class="edit" @click="handleNumEdit(record)"><EditFilled /></div>
          </div>
        </template>
      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="handleAdd">导出</a-button> -->
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <BaseNumModal @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { EditFilled } from '@ant-design/icons-vue';
  import BaseNumModal from './components/BaseNumModal.vue';
  import { columns, pageTitle, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { bookingList as listApi } from '/@/api/app/booking';
  import { goodsList } from '/@/api/app/goods';
  import { EBookingTarget } from '/@/api/app/model/bookingModel';
  import { pointMallList } from '/@/api/app/promotions';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload, setTableData, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
    },
    useSearchForm: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { style: 'padding-left:10px;' },
      baseColProps: { span: 6 },
    },
    beforeFetch(params) {
      return {
        ...params,
        targets: [EBookingTarget.goods, EBookingTarget.pointmall],
      };
    },
    afterFetch: async (data: Recordable[]) => {
      let gIds: number[] = [];
      let pIds: string[] = [];
      data.forEach((item: Recordable) => {
        if (item.target === EBookingTarget.goods) gIds.push(item.targetId);
        if (item.target === EBookingTarget.pointmall) pIds.push(item.targetId);
      });
      if (gIds.length) {
        const { list } = await goodsList({ ids: gIds, page: 1, perPage: gIds.length });
        data.forEach((item: Recordable) => {
          if (item.target === EBookingTarget.goods)
            item.goods = list.find((record: Recordable) => record.id == item.targetId);
        });
        setTableData(data);
      }
      if (pIds.length) {
        const promotionIds = pIds.join(',');
        const { list } = await pointMallList({ promotionIds, page: 1, perPage: pIds.length });
        data.forEach((item: Recordable) => {
          if (item.target === EBookingTarget.pointmall)
            item.goods = list.find((record: Recordable) => record.promotionId == item.targetId);
        });
        setTableData(data);
      }
      return data.map((item) => {
        if (!item?.goods) item.goods = {};
        return item;
      });
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

  // 复制
  function handleCopy(row: Recordable) {
    openDrawer(true, {
      isUpdate: false,
      record: row,
    });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }

  function handleNumEdit(row: Recordable) {
    openModal(true, {
      ...row,
      success: (res) => updateTableDataRecord(row.id, res),
    });
  }
</script>

<style lang="less" scoped>
  .num-wrap {
    display: flex;
    align-items: center;
    max-width: 100px;
    margin: 0 auto;
    .num {
      flex: 1;
      margin-right: 6px;
      text-align: center;
    }
    .edit {
      cursor: pointer;
    }
  }
</style>
