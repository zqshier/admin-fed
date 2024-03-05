<template>
  <div class="p-4">
    <BasicTable @register="registerTable" :beforeEditSubmit="beforeEditSubmit">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[{ label: '编辑', onClick: handleCompile.bind(null, record) }]" />
        </template>
      </template>
      <template #toolbar>
        <tabs-option :options="tabsOptionList" v-model="tabsActive" @change="reload()" />
        <a-button type="primary" @click="handleAdd">新增商品</a-button>
        <a-button type="primary" @click="openGroupModal(true, {})">分组设置</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="reload" />
    <GroupModal @register="registerGroupModal" />
  </div>
</template>
<script lang="ts" setup name="Pointmall">
  import { message } from 'ant-design-vue';
  import { ref, unref } from 'vue';
  import GroupModal from './components/GroupModal.vue';
  import {
    columns,
    pageTitle,
    primaryKey,
    searchFormSchema,
    tabsOptionList,
    tabsOptionListParams,
  } from './data';
  import Drawer from './drawer.vue';
  import { IPointmallParams } from '/@/api/app/model/promotionsModel';
  import { pointMallList as listApi, pointMallUpdate as updateApi } from '/@/api/app/promotions';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { TabsOption } from '/@/components/TabsOption';

  const tabsActive = ref<number>(0);

  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerGroupModal, { openModal: openGroupModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: pageTitle,
    api: listApi,
    beforeFetch(params) {
      return {
        ...params,
        ...tabsOptionListParams[unref(tabsActive)],
      };
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 },
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
  });

  //新增
  function handleAdd() {
    openDrawer(true, { isUpdate: false });
  }

  // 编辑
  function handleCompile(row: Recordable) {
    openDrawer(true, { isUpdate: true, record: row });
  }

  // 字段编辑
  async function beforeEditSubmit({ key, value, rawRecord }) {
    if (key !== 'sort') return false;

    if (!value) {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await updateApi(rawRecord.promotionId, { sort: +value } as IPointmallParams);
      reload();
      return true;
    } catch {
      return false;
    }
  }
</script>
