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
                label: '增减次数',
                onClick: handleNumModify.bind(null, record),
              },
              {
                label: '活动规则',
                onClick: handleRule.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd">添加{{ pageTitle }}</a-button>
        <a-button type="primary" @click="openRecordDrawer(true, {})">活动记录</a-button>
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <BaseNumModal ref="BaseNumModalRef" @register="registerBaseNumModify" />
    <RecordDrawer @register="registerRecordDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    columns,
    searchFormSchema,
    primaryKey,
    pageTitle,
    formSchemaModifyActiveNum,
  } from './data';
  import { friendPowerUpdateApi as updateApi } from '/@/api/app/friendPower';
  import Drawer from './drawer.vue';
  import RecordDrawer from './record.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { usePageStore } from '/@/store/modules/page';
  import { friendPowerListApi as listApi } from '/@/api/app/friendPower';
  import BaseNumModal, { ModifyInfo } from '../../components/BaseNumModal.vue';

  const router = useRouter();
  const BaseNumModalRef = ref();
  const { setPreData } = usePageStore();

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerRecordDrawer, { openDrawer: openRecordDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: pageTitle + '列表',
    api: listApi,
    rowKey: primaryKey,
    columns,
    bordered: true,
    showTableSetting: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      width: 200,
    },
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 150,
      schemas: searchFormSchema,
      resetButtonOptions: {
        text: '清空',
      },
      submitButtonOptions: {
        text: '筛选',
      },
      baseColProps: {
        span: 6,
      },
    },
  });

  const [registerBaseNumModify, { openModal: openBaseNumModify }] = useModal();

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
    setPreData({ title: `${row.name}规则`, code: `friend-power-rule-${row.id}` });
    router.push({
      name: 'Documents',
    });
  }

  //新增、编辑成功后
  function handleSuccess() {
    reload();
  }

  function handleNumModify(values) {
    const { circleTotalCount = 0, counter = {} } = values;
    const { cycleUsageCount = 0 } = counter;
    const remainCount = +circleTotalCount - +cycleUsageCount;
    const stateInfo: ModifyInfo = {
      values: { count: remainCount, addCount: '', baseCount: remainCount },
      title: '增减活动发起数量',
      schemas: formSchemaModifyActiveNum,
      ok: null,
      warnTips: '请输入',
      maxLen: 99999,
      minLen: -remainCount,
    };
    openBaseNumModify(true, {
      ...stateInfo,
      ok: async (row) => {
        try {
          const { addCount = 0 } = row;
          const result = await updateApi(values.id, { increaseCircleTotalCount: +addCount });
          message.success('操作成功');
          BaseNumModalRef.value?.closeModal();
          updateTableDataRecord(values.id, result);
        } finally {
          BaseNumModalRef.value?.setModalProps({ confirmLoading: false });
        }
      },
    } as ModifyInfo);
  }
</script>
