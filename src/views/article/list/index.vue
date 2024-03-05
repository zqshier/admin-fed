<template>
  <div class="p-4">
    <BasicTable
      @register="registerTable"
      @edit-end="onEditEnd"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operator'">
          <OperatorInfo type="user" :id="record.userId" />
        </template>
        <template v-if="column.dataIndex === 'relations'">
          <RelationsGoodsInfo :relations="record.relations" />
        </template>
        <template v-if="column.key === 'state'">
          <Tag :color="stateColors(record.state)">{{ stateNames[record.state] }}</Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleEditViewDetail.bind(null, record),
                ifShow: isAdmin(record) && record.state === AriticleState.pending,
              },
              {
                label: '发布',
                popConfirm: {
                  title: '是否确认发布？',
                  confirm: handleUpdate.bind(null, record, AriticleState.approve),
                },
                ifShow: isAdmin(record) && record.state !== AriticleState.approve,
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除？',
                  confirm: handleDelete.bind(null, record),
                },
                ifShow: isAdmin(record) && record.state === AriticleState.pending,
              },
              {
                label: '查看',
                onClick: handleViewDetail.bind(null, record),
                ifShow: isAdmin(record) && record.state !== AriticleState.pending,
              },
              {
                label: '下架',
                popConfirm: {
                  title: '是否确认下架？',
                  confirm: handleUpdate.bind(null, record, AriticleState.reject),
                },
                ifShow: isAdmin(record) && record.state === AriticleState.approve,
              },
              {
                label: '审核通过',
                popConfirm: {
                  title: '是否确认审核通过？',
                  confirm: handleUpdate.bind(null, record, AriticleState.approve),
                },
                ifShow:
                  isUser(record) &&
                  (record.state === AriticleState.reject || record.state === AriticleState.pending),
              },
              {
                label: '审核拒绝',
                popConfirm: {
                  title: '是否确认审核拒绝？',
                  confirm: handleUpdate.bind(null, record, AriticleState.reject),
                },
                ifShow:
                  isUser(record) &&
                  (record.state === AriticleState.approve ||
                    record.state === AriticleState.pending),
              },
              {
                label: '查看',
                onClick: handleViewDetail.bind(null, record),
                ifShow: isUser(record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <tabs-option :options="tabsOptionList" v-model="tabsActive" @change="reload()" />
        <a-button type="primary" @click="handleAdd">添加内容</a-button>
        <a-button v-if="false" type="primary" @click="handleExport">导出内容</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <ExportModal @register="registerExport" />
  </div>
</template>
<script lang="ts" setup name="Article">
  import { Tag, message } from 'ant-design-vue';
  import { ref, unref } from 'vue';
  import ExportModal from './components/ExportModal.vue';
  import {
    columns,
    primaryKey,
    searchFormSchema,
    stateColors,
    stateNames,
    tabsOptionList,
    tabsOptionListParams,
  } from './data';
  import Drawer from './drawer.vue';
  import {
    articleDelete,
    articleList,
    articleStateUpdate,
    articleUpdate,
  } from '/@/api/app/article';
  import { AriticlePublicType, AriticleState } from '/@/api/app/model/articleModel';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { TabsOption } from '/@/components/TabsOption';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';
  import RelationsGoodsInfo from '/@/views/components/RelationsGoodsInfo.vue';

  const [registerExport, { openModal: openExport }] = useModal();

  const [registerDrawer, { openDrawer }] = useDrawer();

  const tabsActive = ref<number>(0);

  const [registerTable, { reload, updateTableDataRecord, getForm }] = useTable({
    title: '内容社区',
    api: articleList,
    beforeFetch(params) {
      params.publicType = params.publicType || undefined;
      return {
        ...params,
        ...tabsOptionListParams[unref(tabsActive)],
      };
    },
    afterFetch(dataList) {
      dataList.forEach((item: Recordable) => {
        if (item.children && item.children.length == 0) {
          delete item.children;
        }
      });
      return dataList;
    },
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    showIndexColumn: false,
    actionColumn: { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
    useSearchForm: true,
    clickToRowSelect: false,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
    },
    beforeEditSubmit,
  });

  function isAdmin(row: Recordable) {
    return row.publicType === AriticlePublicType.admin;
  }

  function isUser(row: Recordable) {
    return row.publicType === AriticlePublicType.user;
  }

  // 查看详情
  function handleViewDetail(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      isReadonly: true,
      record: row,
    });
  }

  // 编辑详情
  function handleEditViewDetail(row: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      record: row,
    });
  }

  function onEditEnd() {}

  //新增
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
      isReadonly: false,
    });
  }

  // 删除
  async function handleDelete(row: Recordable) {
    return articleDelete({ id: row[primaryKey], userId: row.userId }).then(() => {
      message.success('删除成功');
      reload();
    });
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

  // 更改状态
  async function handleUpdate(row: Recordable, state) {
    return articleStateUpdate({ id: row[primaryKey], state }).then(() => {
      message.success(
        {
          [AriticleState.reject]: '下架',
          [AriticleState.approve]: isAdmin(row) ? '发布' : '审核通过',
        }[state] + '成功',
      );
      reload();
    });
  }

  // 字段编辑
  async function beforeEditSubmit({ key, rawRecord, value }) {
    if (key !== 'priority') {
      return false;
    }
    if (value === '') {
      message.info('请填写排序数字');
      return false;
    }
    try {
      await articleUpdate(rawRecord.id, { priority: Number(value) } as any);
      reload();
      return true;
    } catch {
      return false;
    }
  }

  //导出全部
  async function handleExport() {
    const form = getForm();
    const value = await form.validate();
    openExport(true, { orderFilterParams: value });
  }
</script>
