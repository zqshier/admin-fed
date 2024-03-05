<template>
  <div class="label">
    <a-button
      style="padding: 0"
      v-if="pickCoupons?.code"
      @click="showPickCoupon"
      type="link"
      :disabled="disabled"
      >{{ pickCoupons.name }}</a-button
    >
    <a-button @click="showPickCoupon" v-else>选择优惠券</a-button>
  </div>
  <BasicModal
    @register="registerModal"
    :canFullscreen="false"
    title="选择优惠券"
    :width="1200"
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'condition'">
          {{ record.condition.type === 'all' ? '全部商品' : '部分商品' }}
        </template>
        <template v-if="column.key === 'status'">
          {{ couponStatus(record) }}
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, FormSchema } from '/@/components/Table';
  import { CouponsListParams } from '/@/api/app/model/mmsModel';

  import { couponsList } from '/@/api/app/mms';
  import { message } from 'ant-design-vue';
  import { format } from 'date-fns';
  import { nextTick, ref } from 'vue';

  interface IPickCoupons {
    id?: number;
    code: string;
    name: string;
  }

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    disabled: { type: Boolean, default: false },
  });
  const emit = defineEmits(['update:value', 'change']);
  const pickCoupons = ref<IPickCoupons>({} as IPickCoupons);

  const searchSchema: FormSchema[] = [
    {
      field: 'name',
      label: '优惠券名称',
      component: 'Input',
    },
  ];

  const tableSchema: BasicColumn[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '面值',
      dataIndex: 'value',
    },
    {
      title: '条件',
      dataIndex: 'condition',
    },
    {
      title: '有效期',
      dataIndex: 'expiration',
      ellipsis: false,
      customRender: ({ record }: Recordable) => {
        return couponExpiration(record);
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
  ];

  async function initCouponInfo() {
    console.warn('props.value', props.value);
    if (!props.value) return;
    try {
      const result = await couponsList({
        codes: props.value,
        page: 1,
        perPage: 10,
      } as CouponsListParams);
      pickCoupons.value = result.list.shift() as IPickCoupons;
    } catch (e) {
      console.error('e', e);
    }
  }

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
      return `${format(new Date(start), 'yyyy/MM/dd HH:mm:ss')} - ${format(
        new Date(end),
        'yyyy/MM/dd HH:mm:ss',
      )}`;
    }
    if (after > 0) {
      return `领券${after}天后生效，有效期${days}天`;
    }
    return `领券后有效期${days}天`;
  };

  const [registerModal, { openModal, closeModal }] = useModal();

  const [registerTable, { getSelectRows, setSelectedRowKeys }] = useTable({
    title: '',
    rowKey: 'code',
    api: couponsList,
    columns: tableSchema,
    pagination: true,
    showIndexColumn: false,
    size: 'small',
    rowSelection: { type: 'radio' },
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

  function showPickCoupon() {
    let codes: string[] = [];
    if (pickCoupons.value?.code) {
      codes = [pickCoupons.value.code];
    }
    openModal();
    nextTick(() => {
      setSelectedRowKeys(codes);
    });
  }

  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      message.info('请选择优惠券');
      return;
    }

    const row = rows.shift() as IPickCoupons;
    pickCoupons.value = row;
    emit('update:value', row.code);
    emit('change', row.code);

    closeModal();
  }

  defineExpose({
    initCouponInfo,
  });
</script>
