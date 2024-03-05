<template>
  <div class="topics-input-wrap">
    <div><a-button @click="handleAdd">添加tab组</a-button></div>
    <div class="list-wrap">
      <div class="item" v-for="(id, index) in dataInfo.topicIds" :key="id">
        <div class="name">{{ topicsAllMap[id]?.name }}</div>
        <a-popconfirm title="确认删除此专区？" @confirm="delItem(index)">
          <div class="close"><CloseCircleOutlined /></div>
        </a-popconfirm>
      </div>
    </div>
    <BasicModal
      @register="registerModal"
      :canFullscreen="false"
      title="添加tab组"
      :width="800"
      @ok="handleSubmit"
      wrapClassName="common-modal-wrap"
    >
      <div class="p-8px">
        <BasicTable @register="registerTable" />
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModal } from '/@/components/Modal';
  import { onMounted, reactive, watch } from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { TopicsListItem, topicsList } from '/@/api/app/mms';
  import dayjs from 'dayjs';
  import { CloseCircleOutlined } from '@ant-design/icons-vue';
  import { Popconfirm as APopconfirm } from 'ant-design-vue';

  const props = defineProps({
    value: {
      type: Object as PropType<{ topicIds: number[] | string[]; topics: TopicsListItem[] }>,
    },
  });

  const emit = defineEmits(['update:value', 'change', 'update:topics']);

  const dataInfo = reactive<{ topicIds: number[] | string[]; topics: TopicsListItem[] }>({
    topicIds: [],
    topics: [],
  });

  const columns: BasicColumn[] = [
    {
      title: '组名称',
      dataIndex: 'name',
    },
    {
      title: '场景数',
      dataIndex: 'tags',
      customRender: ({ value }) => value.length,
    },
    {
      title: '最近修改时间',
      dataIndex: 'updatedAt',
      customRender: ({ value }) => dayjs(value).format('YYYY/MM/DD HH:mm:ss'),
    },
  ];

  const topicsAllMap: { [key: string]: TopicsListItem } = {};
  const [registerTable, { getSelectRowKeys, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'id',
    api: topicsList,
    afterFetch(data) {
      data.forEach((item: TopicsListItem) => {
        if (item.id) {
          topicsAllMap[item.id] = item;
        }
      });
    },
    columns,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'checkbox', preserveSelectedRowKeys: true },
    useSearchForm: false,
  });

  const [registerModal, { closeModal, openModal }] = useModal();

  function handleAdd() {
    openModal();
    setTimeout(() => setSelectedRowKeys(dataInfo.topicIds), 100);
  }

  function handleSubmit() {
    dataInfo.topicIds = getSelectRowKeys();
    dataInfo.topics = dataInfo.topicIds.map((id) => topicsAllMap[id]);
    updateValue();
    closeModal();
  }

  function delItem(index: number) {
    dataInfo.topicIds.splice(index, 1);
    updateValue();
  }

  function updateValue() {
    emit('update:value', { ...dataInfo });
    emit('change', { ...dataInfo });
  }

  function initValue() {
    if (props.value?.topicIds) {
      dataInfo.topicIds = [...props.value.topicIds] as number[];
    }
    if (props.value?.topics) {
      dataInfo.topics = [...props.value.topics];
      dataInfo.topics.forEach((item) => {
        if (item.id) {
          topicsAllMap[item.id] = item;
        }
      });
    }
  }

  watch(
    () => props.value,
    () => initValue(),
    // { deep: true },
  );

  onMounted(() => {
    initValue();
  });
</script>

<style lang="less" scoped>
  .topics-input-wrap {
    .list-wrap {
      .item {
        display: flex;
        align-items: center;
        width: 300px;
        padding: 4px 10px;
        border: 1px solid @border-color-base;
        border-radius: 2px;
        margin-top: 20px;
        .name {
          flex: 1;
        }
        .close {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }
</style>
