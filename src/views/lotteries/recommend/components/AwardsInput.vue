<template>
  <div class="label">
    <a-button
      style="padding: 0"
      v-if="pickAwards?.code"
      @click="showPickAwards"
      type="link"
      :disabled="disabled"
      >{{ pickAwards.name }}</a-button
    >
    <a-button @click="showPickAwards" v-else>选择奖池</a-button>
  </div>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择奖池"
    :width="1200"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" :rowSelection="rowSelection" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { format } from 'date-fns';
  import { BasicModal, useModal } from '/@/components/Modal';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    FormSchema,
    TableRowSelection,
  } from '/@/components/Table';
  import { lotteriesList as listApi } from '/@/api/app/lotteries';
  import { LotteriesListItem } from '/@/api/app/model/lotteriesModel';
  import { missionsGroupsList } from '/@/api/app/mission';
  import { GroupCode } from '/@/api/app/model/missionModel';

  interface IpickAwards {
    id?: number;
    code: string;
    name: string;
  }

  const props = defineProps({
    value: {
      type: Object,
      default: {} as IpickAwards,
    },
    disabled: { type: Boolean, default: false },
  });

  const emit = defineEmits(['update:value', 'change']);
  const pickAwards = ref<IpickAwards>({} as IpickAwards);
  const rowSelection = reactive<TableRowSelection>({
    type: 'radio',
    preserveSelectedRowKeys: true,
  });

  const searchSchema: FormSchema[] = [
    {
      field: 'name',
      label: '奖池名称',
      component: 'Input',
    },
  ];

  const tableSchema: BasicColumn[] = [
    {
      title: '奖池编码',
      dataIndex: 'code',
    },
    {
      title: '奖池名称',
      dataIndex: 'name',
    },
    {
      title: '活动开始时间',
      dataIndex: 'start',
      ellipsis: false,
      customRender({ text }) {
        if (!text) return '-';
        return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
      },
    },
    {
      title: '活动结束时间',
      dataIndex: 'end',
      ellipsis: false,
      customRender({ text }) {
        if (!text) return '-';
        return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
      },
    },
  ];

  async function initAwardsInfo() {
    console.debug('initAwardsInfo props.value', props.value);
    if (!props.value?.id) {
      pickAwards.value = {} as IpickAwards;
      return;
    }
    try {
      const result = await listApi({
        ids: props.value.id,
        page: 1,
        perPage: 10,
      } as unknown as LotteriesListItem);
      pickAwards.value = result.list.shift() as IpickAwards;
    } catch (e) {}
  }

  const [registerModal, { openModal, closeModal }] = useModal();

  const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'code',
    api: listApi,
    afterFetch: (dataList) => {
      const groupRelatedIds = dataList.map((item) => item.id);
      getMissionsGroupsList(groupRelatedIds);
    },
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    clickToRowSelect: false,
    useSearchForm: true,
    formConfig: {
      schemas: searchSchema,
      labelWidth: 80,
      baseColProps: {
        span: 14,
      },
      actionColOptions: {
        span: 6,
      },
    },
  });

  async function showPickAwards() {
    let codes: string[] = [];
    if (pickAwards.value?.code) {
      codes = [pickAwards.value.code];
    }
    openModal();
    nextTick(() => {
      setSelectedRowKeys(codes);
    });
  }

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      message.info('请选择奖池');
      return;
    }

    const row = rows.shift() as IpickAwards;
    pickAwards.value = row;
    emit('update:value', row);
    emit('change', row);

    closeModal();
  }

  async function getMissionsGroupsList(groupRelatedIds: string[]) {
    try {
      const { list } = await missionsGroupsList({
        groupCode: GroupCode.lottery,
        groupRelatedIds,
        page: 1,
        perPage: groupRelatedIds.length + 1,
      });

      const ids = list.map((i) => i.relatedId);

      if (ids && ids.length) {
        rowSelection.getCheckboxProps = (record) => ({ disabled: ids.includes(record.id) });
      }
    } catch (e) {}
  }

  defineExpose({
    initAwardsInfo,
  });
</script>
