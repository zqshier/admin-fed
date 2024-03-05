<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="问卷统计" :isDetail="true">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userId'">
          <OperatorInfo :id="record.userId" value, type="user" :showId="true" :block="true" />
        </template>
        <template v-if="column.dataIndex === 'createdAt'">
          {{ formatToDateTime(record.createdAt) }}
        </template>
        <div v-for="item in record.content" :key="item.id">
          <template v-if="column.dataIndex === `content-${item.questionId}`">
            {{ item.answer }}
          </template>
        </div>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleExport">导出</a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { nextTick, ref } from 'vue';
  import {
    recordColumns as columns,
    primaryKey,
    recordSearchFormSchema as searchFormSchema,
  } from './data';
  import {
    questionnaireRecordExport as exportApi,
    questionnaireRecordList as listApi,
  } from '/@/api/app/article';
  import { IQuestionnaireRecordListParams } from '/@/api/app/model/articleModel';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTable, useTable } from '/@/components/Table';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import OperatorInfo from '/@/views/components/OperatorInfo.vue';

  let searchParams = { perPage: 10, page: 1 };

  const recordId = ref(0);

  //弹窗
  const [registerDrawer] = useDrawerInner(async (data) => {
    recordId.value = data?.record.id || 0;
    nextTick(() => {
      reload();
    });
  });

  const [registerTable, { reload, setColumns }] = useTable({
    api: listApi,
    beforeFetch: (params) => {
      searchParams = { questionnaireId: recordId.value, ...params };
      return searchParams;
    },
    afterFetch: async (dataList) => {
      const newColumns = cloneDeep(columns);
      for (const item of dataList) {
        for (const itm of item.content) {
          if (newColumns.some((i) => i.dataIndex === `content-${itm.questionId}`)) break;
          const obj = {
            title: itm.questionTitle || '',
            dataIndex: `content-${itm.questionId}`,
            ellipsis: false,
            width: itm.questionTitle.length * 14 + 30,
          };
          newColumns.push(obj);
        }
      }
      setColumns(newColumns);

      return dataList;
    },
    showIndexColumn: false,
    rowKey: primaryKey,
    columns: columns,
    bordered: true,
    showTableSetting: true,
    clickToRowSelect: false,
    immediate: false,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      resetButtonOptions: { text: '清空' },
      submitButtonOptions: { text: '筛选' },
      actionColOptions: { span: 24 },
      baseColProps: { span: 10 },
    },
  });

  function handleExport() {
    exportApi({ ...searchParams } as IQuestionnaireRecordListParams);
  }
</script>

<style lang="less" scoped></style>
