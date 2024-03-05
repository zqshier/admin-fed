<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择商品"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { message } from 'ant-design-vue';
  import { IProductsListItem } from '/@/api/app/model/uicodeModel';
  import { productsList as listApi } from '/@/api/app/uicode';
  export interface GoodsPickData {
    ids?: number[] | string[];
    rows?: IProductsListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
    disabledIdsFun?: Function;
  }
</script>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    BasicColumn,
    BasicTable,
    FormSchema,
    TableRowSelection,
    useTable,
  } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'radio',
    preserveSelectedRowKeys: true,
  });

  const tableSchema: BasicColumn[] = [
    {
      title: '产品型号',
      dataIndex: 'code',
    },
    {
      title: '中文名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产品条形码',
      dataIndex: 'barcode',
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '中文名称',
      component: 'Input',
    },
    {
      field: 'barcode',
      label: '产品条形码',
      component: 'Input',
    },
  ];

  //商品选择表格
  const [
    registerTable,
    { getSelectRowKeys, setSelectedRowKeys, reload, getDataSource, getSelectRows },
  ] = useTable({
    title: '',
    rowKey: 'barcode',
    api: listApi,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    immediate: false,
    useSearchForm: true,
    formConfig: {
      schemas: searchGoodsSchema,
      labelWidth: 80,
      baseColProps: { span: 6 },
    },
  });

  const [registerModal, { closeModal, setModalProps }] = useModalInner(
    async (data: GoodsPickData) => {
      await reload();
      if (data) {
        setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
        actions.callback = data.callback;

        if (data.type) rowSelection.type = data.type === 'multiple' ? 'checkbox' : 'radio';

        if (data.disabled) {
          rowSelection.getCheckboxProps = () => ({
            disabled: data.disabled,
          });
          setModalProps({ showOkBtn: !data.disabled });
        }
        if (data.disabledIdsFun) {
          const ids = await data.disabledIdsFun(getDataSource().map((i) => i.id));
          if (!ids?.length) return;
          rowSelection.getCheckboxProps = (record) => {
            return { disabled: ids.includes(record.id) };
          };
        }
      }
    },
  );

  async function handleSubmit() {
    const ids = getSelectRowKeys();

    if (ids.length === 0) return message.info('请先选择商品');

    const data: GoodsPickData = {
      barCodes: ids,
      rows: await getSelectRows(),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
