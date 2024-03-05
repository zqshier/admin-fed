<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              // { 标签创建后不需要修改
              //   label: '编辑',
              //   onClick: handleEdit.bind(null, record),
              // },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除？',
                  confirm: handleDel.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">新增标签</a-button>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, primaryKey, pageTitle } from './data';
  import Modal from './modal.vue';
  import { useModal } from '/@/components/Modal';
  import { userTagList as listApi } from '/@/api/app/users';

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle,
    api: listApi,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 8,
      },
    },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 130,
    },
  });

  //新增
  function handleAdd() {
    openModal(true, {
      isUpdate: false,
    });
  }

  // function handleEdit(row: Recordable) {
  //   openModal(true, {
  //     isUpdate: true,
  //     record: row,
  //   });
  // }

  function handleDel(row: Recordable) {
    console.log(row);
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
</script>

<style lang="less" scoped>
  .info-text {
    color: @primary-color;
  }
</style>
