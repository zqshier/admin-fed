<template>
  <div class="p-4">
    <BasicTable
      @register="registerTable"
      @edit-end="onEditEnd"
      :beforeEditSubmit="beforeEditSubmit"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '推广',
                onClick: handleCompile.bind(null, record),
                ifShow: false,
              },
              {
                label: '编辑',
                onClick: handleCompile.bind(null, record),
              },
              {
                label: '复制',
                popConfirm: {
                  title: '是否确认复制？',
                  confirm: handleCopy.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <div class="tabs-wrap">
          <a-tabs
            v-model:activeKey="typeActiveTab"
            type="card"
            size="small"
            @change="typeTabChange"
          >
            <a-tab-pane v-for="item in typeList" :key="item.key" :tab="item.tab" />
          </a-tabs>
        </div>
        <a-checkbox v-model:checked="selectAllList" v-if="false">筛选全选</a-checkbox>
        <a-button type="primary" @click="handleAdd">添加商品</a-button>
        <a-button type="primary" @click="handleStatus(1)">上架</a-button>
        <a-button type="primary" @click="handleStatus(2)">下架</a-button>
        <!-- <a-button type="primary" @click="handleDel">删除</a-button> -->
        <a-button type="primary" @click="handleChangeCatalog">改分组</a-button>
        <a-button type="primary" @click="handleChangeKinds">改品类</a-button>
        <!-- <a-button type="primary" @click="handleExport">同步商品</a-button> -->
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <BatModifyModal @register="registerBatModify" />
  </div>
</template>
<script lang="ts" setup name="GoodsList">
  import {
    Checkbox as ACheckbox,
    TabPane as ATabPane,
    Tabs as ATabs,
    message,
  } from 'ant-design-vue';
  import { ref, unref } from 'vue';
  import BatModifyModal, { ModifyInfo, ModifyTypes } from './components/BatModifyModal.vue';
  import { columns, primaryKey, searchFormSchema } from './data';
  import Drawer from './drawer.vue';
  import { goodsList, goodsPositionUpdate } from '/@/api/app/goods';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerBatModify, { openModal: openBatModify }] = useModal();

  const [registerTable, { reload, getSelectRowKeys, clearSelectedRowKeys }] = useTable({
    title: '商品列表',
    api: goodsList,
    beforeFetch(params) {
      let ext: { [key: string]: any } = {};
      switch (unref(typeActiveTab)) {
        case 2:
          ext['saleStatus'] = 1;
          break;
        case 3:
          ext['outOfStock'] = 1;
          break;
        case 4:
          ext['saleStatus'] = 2;
          break;
        case 5:
          ext['hidden'] = 1;
          break;
      }
      return {
        ...params,
        ...ext,
      };
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 200 },
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      baseColProps: { span: 6 },
    },
  });

  const selectAllList = ref<boolean>(false);

  const typeActiveTab = ref<number>(0);

  const typeList: { key: number; tab: string }[] = [
    { key: 0, tab: '全部' },
    { key: 2, tab: '销售中' },
    { key: 3, tab: '已售罄' },
    { key: 4, tab: '未上架' },
    { key: 5, tab: '隐藏' },
  ];

  function typeTabChange() {
    reload();
  }

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
      isCopy: true,
      record: row,
    });
  }

  // 导出全部
  // function handleExport() {}

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }

  function onEditEnd() {}

  // 字段编辑
  async function beforeEditSubmit({ record, key, value }) {
    if (key !== 'position') {
      return false;
    }
    if (!value) {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await goodsPositionUpdate(record.id, value);
      reload();
      return true;
    } catch {
      return false;
    }
  }

  function handleStatus(status: number) {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选商品');
    }

    openBatModify(true, {
      type: ModifyTypes.status,
      callback: () => {
        reload();
      },
      values: {
        itemIds: ids,
        saleStatus: status,
      },
    } as ModifyInfo);
  }

  // function handleDel() {}

  function handleChangeCatalog() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return message.info('请先勾选商品');
    }

    openBatModify(true, {
      type: ModifyTypes.catalog,
      callback: () => {
        reload();
      },
      values: {
        itemIds: ids,
      },
    } as ModifyInfo);
  }

  function handleChangeKinds() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) return message.info('请先勾选商品');

    openBatModify(true, {
      type: ModifyTypes.kinds,
      callback: () => {
        message.success('操作更改品类成功');
        clearSelectedRowKeys();
        reload();
      },
      values: { itemIds: ids },
    } as ModifyInfo);
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
</style>
