<template>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择优惠券"
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
  import { couponsList } from '/@/api/app/mms';
  import { EGoodsType, GoodsListItem } from '/@/api/app/model/goodsModel';
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
  import { uniq } from 'lodash-es';
  import { reactive } from 'vue';
  import { skuList } from '/@/api/app/goods';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    BasicColumn,
    BasicTable,
    FormSchema,
    TableRowSelection,
    useTable,
  } from '/@/components/Table';
  import { formatToDateTime } from '/@/utils/dateUtil';

  const emit = defineEmits(['success', 'register']);

  const actions = reactive<{ callback: Function | undefined }>({
    callback: undefined,
  });

  const rowSelection = reactive<TableRowSelection>({
    type: 'radio',
    preserveSelectedRowKeys: true,
  });

  const searchSchema: FormSchema[] = [
    {
      field: 'name',
      label: '优惠券名称',
      component: 'Input',
    },
  ];

  const columns: BasicColumn[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      customRender: ({ record }: Recordable) => couponStatus(record),
    },
    {
      title: '面值',
      dataIndex: 'value',
      width: '50',
    },
    {
      title: '条件',
      dataIndex: 'condition',
      customRender: ({ text }) => (text === 'all' ? '全部商品' : '部分商品'),
    },
    {
      title: '有效期',
      dataIndex: 'expiration',
      customRender: ({ record }: Recordable) => couponExpiration(record),
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
  ];

  function couponStatus(record) {
    if (
      record.expiration &&
      record.expiration.end &&
      Date.now() > new Date(record.expiration.end).valueOf()
    ) {
      return '已过期';
    }
    if (record.disabled) return '未投放';
    return '进行中';
  }

  const couponExpiration = (record: Recordable) => {
    const { start, end, after, days } = record.expiration;
    if (start) {
      return `${formatToDateTime(new Date(start))} - ${formatToDateTime(new Date(end))}`;
    }
    if (after > 0) {
      return `领券${after}天后生效，有效期${days}天`;
    }
    return `领券后有效期${days}天`;
  };

  //商品选择表格
  const [
    registerGoodsTable,
    { getSelectRowKeys, setSelectedRowKeys, reload, getDataSource, getSelectRows },
  ] = useTable({
    title: '',
    rowKey: 'id',
    api: async ({ page, perPage, name }) => {
      const { list } = await skuList({
        itemName: name,
        itemTypes: EGoodsType.coupon + '',
        page,
        perPage,
      });
      const items = list
        .filter((o) => Boolean(o.meta?.couponCode))
        .map((o) => ({ ...o, couponCode: o.meta?.couponCode as string }));
      const codes = uniq(items.map((i) => i.couponCode));
      if (!codes?.length) return [];
      const coupons = (await couponsList({ page, perPage, codes: codes.join(',') })).list.filter(
        (item) => couponStatus(item) !== '已过期',
      );

      return items
        .map((g) => {
          const cc = coupons.find((j) => j.code === g.couponCode);
          if (!cc) return;
          return {
            ...cc,
            name: g.item.name,
            item: g.item,
            id: g.id,
            stock: g.stock,
          };
        })
        .filter(Boolean);
    },
    columns,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    immediate: false,
    useSearchForm: true,
    formConfig: {
      schemas: searchSchema,
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
          console.debug('ids', ids);
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

    if (ids.length === 0) return message.info('请先选择优惠券');

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
