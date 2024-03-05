<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择发布者"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerUsersTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { UsersType, UsersState, UsersListItem } from '/@/api/app/model/articleModel';
  export interface UsersPickData {
    ids?: number[] | string[];
    rows?: UsersListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
  }
</script>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    FormSchema,
    TableRowSelection,
  } from '/@/components/Table';
  import { usersList } from '/@/api/app/article';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const goodsTableSchema: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '账号名称',
      dataIndex: 'nickname',
    },
    {
      title: '账号类型',
      dataIndex: 'type',
      customRender({ text }) {
        return (
          {
            [UsersType.official]: '官方账号',
            [UsersType.personal]: '个人账号',
          }[text] || '-'
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      customRender({ text }) {
        return (
          {
            [UsersState.disabled]: '禁止',
            [UsersState.enabled]: '启用',
          }[text] || '-'
        );
      },
    },
  ];

  //搜索表单配置
  const searchFormSchema: FormSchema[] = [
    {
      field: 'nickname',
      label: '账号名称',
      component: 'Input',
    },
    {
      field: 'type',
      label: '账号类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '全部', value: '' },
          { label: '官方账号', value: UsersType.official },
          { label: '个人账号', value: UsersType.personal },
        ],
      },
    },
  ];

  //商品选择表格
  const [registerUsersTable, { getSelectRowKeys, setSelectedRowKeys, getSelectRows }] = useTable({
    title: '',
    rowKey: 'id',
    api: usersList,
    beforeFetch(params) {
      params.state = UsersState.enabled;
      if (!params.type) delete params.type;
      return { ...params };
    },
    columns: goodsTableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    useSearchForm: true,
    formConfig: {
      schemas: searchFormSchema,
      labelWidth: 80,
      baseColProps: {
        span: 6,
      },
    },
  });

  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    async (data: UsersPickData) => {
      if (data) {
        setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
        actions.callback = data.callback;
        if (data.type) {
          rowSelection.type = data.type === 'single' ? 'radio' : 'checkbox';
        }
        if (data.disabled) {
          rowSelection.getCheckboxProps = () => ({
            disabled: data.disabled,
          });
          setModalProps({ showOkBtn: !data.disabled });
        }
      }
    },
  );

  async function handleSubmit() {
    const ids = getSelectRowKeys();
    const data: UsersPickData = {
      ids: ids,
      rows: getSelectRows(),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
