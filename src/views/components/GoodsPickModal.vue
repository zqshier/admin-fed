<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择商品"
    :width="1000"
    @ok="handleSubmit"
  >
    <div class="p-8px">
      <BasicTable
        @register="registerGoodsTable"
        :rowSelection="rowSelection"
        @selection-change="onSelectionChange"
      />
    </div>
  </BasicModal>
</template>

<script lang="ts">
  import { message } from 'ant-design-vue';
  import { goodsTypeOptions } from '../goods/list/data';
  import { GoodsListItem } from '/@/api/app/model/goodsModel';
  export interface GoodsPickData {
    ids?: number[] | string[];
    rows?: GoodsListItem[];
    callback?: Function;
    type?: 'single' | 'multiple';
    disabled?: boolean;
    disabledIdsFun?: Function;
    defaultFormProps?: object;
    hidenFormField?: string;
    checkMaxLen?: number;
  }
</script>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { catalogsList, goodsList } from '/@/api/app/goods';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    BasicColumn,
    BasicTable,
    FormSchema,
    TableRowSelection,
    useTable,
  } from '/@/components/Table';

  const emit = defineEmits(['success', 'register']);

  const checkMaxLen = ref(0);
  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const goodsTableSchema: BasicColumn[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      width: 160,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 160,
    },
  ];

  const searchGoodsSchema: FormSchema[] = [
    {
      field: 'catalogId',
      label: '商品分组',
      component: 'ApiSelect',
      componentProps: {
        api: catalogsList,
        immediate: false,
        resultField: 'list',
        valueField: 'id',
        labelField: 'name',
      },
    },
    {
      field: 'name',
      label: '商品名称',
      component: 'Input',
    },
    {
      field: 'sn',
      label: '商品编码',
      component: 'Input',
    },
    {
      field: 'types',
      label: '商品类型',
      component: 'Select',
      componentProps: { options: goodsTypeOptions },
    },
  ];

  //商品选择表格
  const [
    registerGoodsTable,
    { getSelectRowKeys, setSelectedRowKeys, reload, getDataSource, setProps },
  ] = useTable({
    title: '',
    rowKey: 'id',
    api: goodsList,
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
        setTimeout(() => setSelectedRowKeys(data.ids || []), 100);
        actions.callback = data.callback;
        checkMaxLen.value = data.checkMaxLen || 0;

        if (data.hidenFormField) {
          setProps({
            formConfig: {
              schemas: searchGoodsSchema.filter(
                (o) => !data.hidenFormField?.split(',').filter((i) => i === o.field).length,
              ),
              labelWidth: 80,
              baseColProps: { span: 6 },
            },
          });
        }

        if (data.defaultFormProps) {
          setProps({
            beforeFetch: (params) => {
              return { ...params, ...data.defaultFormProps };
            },
          });
          await reload();
        }

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

  async function getGoodsData(itemIds: number[] | string[]) {
    const { list } = await goodsList({
      ids: itemIds as number[],
      perPage: Math.max(itemIds.length, 20),
      page: 1,
    });
    return list;
  }

  // 字段编辑
  async function onSelectionChange({ keys }) {
    if (!checkMaxLen.value) return;
    if (keys.length >= checkMaxLen.value) {
      rowSelection.getCheckboxProps = (record) => ({ disabled: !keys.includes(record.id) });
    } else {
      rowSelection.getCheckboxProps = () => ({ disabled: false });
    }
  }

  async function handleSubmit() {
    const ids = getSelectRowKeys();

    if (ids.length === 0) return message.info('请先选择商品');
    if (checkMaxLen.value && ids.length > checkMaxLen.value)
      return message.info(`当前选择商品数量大于${checkMaxLen.value}，请调整选择`);

    const data: GoodsPickData = {
      ids: ids,
      rows: await getGoodsData(ids),
    };

    emit('success', data);
    if (actions.callback) {
      actions.callback(data);
    }
    closeModal();
  }
</script>
