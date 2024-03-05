<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择积分商品"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable @register="registerGoodsTable" :rowSelection="rowSelection" />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { message } from 'ant-design-vue';
  import { GoodsListItem } from '/@/api/app/model/goodsModel';
  export interface GoodsPickData {
    ids?: number[] | string[];
    rows?: GoodsListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
    disabledIdsFun?: Function;
  }
</script>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { pointMallList as listApi } from '/@/api/app/promotions';
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
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const goodsTableSchema: BasicColumn[] = [
    {
      title: '积分活动ID',
      dataIndex: 'promotionId',
    },
    {
      title: '积分活动名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'optionData',
      customRender: ({ record }: Recordable) => {
        const result = { point: 0, price: 0 };
        const [data, _] = record?.optionData?.items.sort((a, b) => a.point - b.point);
        result.point = data.point;
        result.price = data.price;
        return `${result.point}积分${result.price > 0 ? `+ ${result.price}元` : ''}`;
      },
    },

    {
      title: '库存',
      dataIndex: 'stock',
      customRender: ({ record }: Recordable) => {
        let remainStock = 0;
        record?.optionData?.items.forEach((item) => {
          remainStock += item.remainStock;
        });
        return remainStock;
      },
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'name',
      label: '名称搜索',
      component: 'Input',
    },
  ];

  //商品选择表格
  const [
    registerGoodsTable,
    { getSelectRowKeys, setSelectedRowKeys, reload, getDataSource, getSelectRows },
  ] = useTable({
    title: '',
    rowKey: 'promotionId',
    api: listApi,
    columns: goodsTableSchema,
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
        console.debug('cc', data);
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
      ids: ids,
      rows: await getSelectRows(),
    };
    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
