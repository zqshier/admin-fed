<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mt-1">
    <a-radio-group v-if="options" v-model:value="type" :options="options" :disabled="disabled" />
    <div class="mt-3" v-show="type && type == EPointmallTargetType.goods">
      <a-button v-if="!disabled" @click="showGoodsPick" type="primary" ghost>选择商品</a-button>
      <div class="mt-4" v-if="goodsTableDataList?.length">
        <BasicTable
          @register="registerTable"
          :data-source="goodsTableDataList"
          :rowSelection="rowSelection"
          @selection-change="onSelectionChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cstock'">
              <InputNumber :min="0" :max="record.stock" v-model:value="record['cstock']" />
            </template>
            <template v-if="column.key === 'cprice'">
              <div class="flex items-center">
                <InputNumber
                  :min="1"
                  :max="99999"
                  :precision="0"
                  v-model:value="record['cpoint']"
                  addon-after="积分"
                />
                <span v-if="ctype === EPointmallType.pointAndPrice" class="ml-1 mr-1">+</span>
                <InputNumber
                  v-if="ctype === EPointmallType.pointAndPrice"
                  :min="0.01"
                  :max="99999"
                  :precision="2"
                  v-model:value="record['cprice']"
                  addon-after="元"
                />
              </div>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <div class="mt-3" v-show="type && type == EPointmallTargetType.coupon">
      <a-button v-if="!disabled" @click="showCouponPick" type="primary" ghost>选择优惠券</a-button>
      <div class="mt-4" v-if="couponTableDataList?.length">
        <BasicTable
          @register="registerCouponTable"
          :data-source="couponTableDataList"
          :rowSelection="rowSelection"
          @selection-change="onSelectionCouponChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'value'">
              <div>
                <Tag :key="'value1' + record.id" color="green">满{{ record.threshold }}</Tag>
              </div>
              <div>
                <Tag :key="'value2' + record.id" color="red">减{{ record.value }}</Tag>
              </div>
            </template>
            <template v-if="column.key === 'cstock'">
              <InputNumber :min="0" :max="record.stock" v-model:value="record['cstock']" />
            </template>
            <template v-if="column.key === 'cprice'">
              <div class="flex items-center">
                <InputNumber
                  :min="1"
                  :max="99999"
                  :precision="0"
                  v-model:value="record['cpoint']"
                  addon-after="积分"
                />
                <span v-if="ctype === EPointmallType.pointAndPrice" class="ml-1 mr-1">+</span>
                <InputNumber
                  v-if="ctype === EPointmallType.pointAndPrice"
                  :min="0.01"
                  :max="99999"
                  :precision="2"
                  v-model:value="record['cprice']"
                  addon-after="元"
                />
              </div>
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <GoodsPickModal @register="registerGoodsPick" />
    <CouponGoodsPickModal @register="registerCouponPick" />
  </div>
</template>

<script lang="ts">
  import { cloneDeep } from 'lodash-es';
  import { watchEffect } from 'vue';
  import { couponConditionList, couponTypeList } from '../../coupons/data';
  import { EGoodsType, SkuListItem, SkuListItemGoods } from '/@/api/app/model/goodsModel';
  import { CouponsListItem } from '/@/api/app/model/mmsModel';
  import { formatToDateTime } from '/@/utils/dateUtil';
  export interface ITableGoodsListItem extends SkuListItem {
    select?: boolean;
    cstock: number;
    cprice: number;
    cpoint: number;
  }

  export interface ITableCouponListItem extends CouponsListItem {
    item?: SkuListItemGoods;
    select?: boolean;
    cstock: number;
    cprice: number;
    cpoint: number;
  }

  export interface IPropsValue {
    type: EPointmallTargetType;
    goodsItems: ITableGoodsListItem[];
    couponItems: ITableCouponListItem[];
  }
</script>
<script lang="ts" setup>
  import { RadioGroup as ARadioGroup, InputNumber, Tag } from 'ant-design-vue';
  import { computed, nextTick, reactive, ref, unref } from 'vue';
  import { skuStockList } from '/@/api/app/goods';
  import { EPointmallTargetType, EPointmallType } from '/@/api/app/model/promotionsModel';
  import { pointMallList } from '/@/api/app/promotions';
  import { useModal } from '/@/components/Modal';
  import { BasicColumn, BasicTable, TableRowSelection, useTable } from '/@/components/Table';
  import CouponGoodsPickModal from '/@/views/components/CouponGoodsPickModal.vue';
  import GoodsPickModal from '/@/views/components/GoodsPickModal.vue';

  const props = defineProps({
    value: {
      type: Object as PropType<IPropsValue>,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
    },
    options: {
      type: Array as PropType<{ label: string; value: string | number }[]>,
    },
    ctype: { type: String as PropType<EPointmallType>, default: EPointmallType.pointAndPrice },
    disabled: { type: Boolean, default: false },
  });
  const emit = defineEmits(['update:value', 'change']);

  const goodsColumns: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'item.name',
      align: 'center',
      ellipsis: true,
      customRender: ({ record }: Recordable) => (record?.item && record?.item.name) || '',
    },
    {
      title: '规格',
      dataIndex: 'name',
      align: 'center',
      width: 80,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      align: 'center',
      width: 80,
    },
    {
      title: '原价',
      dataIndex: 'item.price',
      align: 'center',
      customRender: ({ record }: Recordable) => (record?.item && record?.item.price) || '0',
      width: 80,
    },
    {
      title: '可兑换数',
      dataIndex: 'cstock',
      align: 'center',
    },
    {
      title: '兑换价',
      dataIndex: 'cprice',
      align: 'center',
      width: 400,
    },
  ];

  const couponColumns: BasicColumn[] = [
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '优惠券类型',
      dataIndex: 'type',
      align: 'center',
      customRender: ({ value }: Recordable) =>
        couponTypeList.find((item) => item.value === value)?.label,
      width: 90,
    },
    {
      title: '券面值',
      dataIndex: 'value',
      key: 'value',
      width: 90,
    },
    {
      title: '优惠券有效期',
      dataIndex: 'expiration',
      customRender: ({ value }) => {
        if (value.start) {
          return formatToDateTime(value.start) + '至' + formatToDateTime(value.end);
        } else {
          return value.days + '天';
        }
      },
    },
    {
      title: '适用条件',
      dataIndex: 'condition',
      customRender: ({ value }) =>
        couponConditionList.find((item) => item.value == value.type)?.label,
      width: 90,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 90,
    },
    {
      title: '可兑换数',
      dataIndex: 'cstock',
      align: 'center',
    },
    {
      title: '兑换价',
      dataIndex: 'cprice',
      align: 'center',
      width: 400,
    },
  ];

  let flag = true;
  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    preserveSelectedRowKeys: true,
  });

  const goodsTableDataList = ref<ITableGoodsListItem[]>([]);
  const couponTableDataList = ref<ITableCouponListItem[]>([]);

  const [registerGoodsPick, { openModal: openGoodsPick }] = useModal();
  const [registerCouponPick, { openModal: openCouponPick }] = useModal();

  const [
    registerTable,
    { setSelectedRowKeys: setGoodsSelectedRowKeys, getSelectRows: getGoodsSelectedRows },
  ] = useTable({
    showIndexColumn: false,
    rowKey: 'id',
    columns: goodsColumns,
    pagination: false,
    bordered: true,
    clickToRowSelect: false,
    showTableSetting: false,
  });

  const [
    registerCouponTable,
    { setSelectedRowKeys: setCouponSelectedRowKeys, getSelectRows: getCouponSelectedRows },
  ] = useTable({
    showIndexColumn: false,
    rowKey: 'id',
    columns: couponColumns,
    pagination: false,
    bordered: true,
    clickToRowSelect: false,
    showTableSetting: false,
  });

  const defaultPicks = { goodsItems: [], couponItems: [] };

  const type = computed({
    get() {
      return props.value?.type;
    },
    set(v) {
      flag = true;
      updateValue({ ...defaultPicks, type: v });
    },
  });

  const updateValue = (value: Recordable) => {
    console.debug('updateValue value', value);
    const d = { ...unref(props.value), ...value };
    emit('update:value', d);
    emit('change', d);
  };

  // function pickSuccess(value: Recordable) {
  //   updateValue(value);
  // }

  function initData() {
    flag = true;
    goodsTableDataList.value = [];
    couponTableDataList.value = [];
  }

  function showGoodsPick() {
    openGoodsPick(true, {
      type: 'single',
      ids: (props.value?.goodsItems && props.value.goodsItems.map((i) => i.itemId)) || [],
      hidenFormField: 'types',
      defaultFormProps: { types: EGoodsType.goods },
      disabledIdsFun: async (targetIds: string[]) => {
        return (
          await pointMallList({ targetIds: targetIds.join(), page: 1, perPage: targetIds.length })
        ).list;
      },
      callback: async (data) => {
        console.debug('openGoodsPick callback data', data);
        const { ids = [] } = data;
        const list = await getGoodsSkuData(ids[0]);
        goodsTableDataList.value = list.map((i) => ({ ...i, cprice: 0, cpoint: 0, cstock: 0 }));
        updateValue({ goodsItems: goodsTableDataList.value });
        nextTick(() => {
          setGoodsSelectedRowKeys([...list.map((i) => i.id)]);
        });
      },
    });
  }

  function showCouponPick() {
    openCouponPick(true, {
      ids: (props.value?.couponItems && props.value.couponItems.map((i) => i.id)) || [],
      disabledIdsFun: async (targetIds: string[]) => {
        return (
          await pointMallList({ targetIds: targetIds.join(), page: 1, perPage: targetIds.length })
        ).list;
      },
      callback: async (data) => {
        console.debug('openCouponPick callback data', data);
        const { rows = [] } = data;
        couponTableDataList.value = rows.map((i) => ({ ...i, cprice: 0, cpoint: 0, cstock: 0 }));
        updateValue({ couponItems: couponTableDataList.value });
        nextTick(() => {
          setCouponSelectedRowKeys([...rows.map((i) => i.id)]);
        });
      },
    });
  }

  async function getGoodsSkuData(itemId: number) {
    const { list } = await skuStockList({ itemId, perPage: 10, page: 1 });
    return list;
  }

  function onSelectionChange({ rows }) {
    updateValue({ goodsItems: rows });
  }

  function onSelectionCouponChange({ rows }) {
    updateValue({ couponItems: rows });
  }

  watchEffect(() => {
    console.debug('props.value', props.value, flag);
    if (!flag) return;
    goodsTableDataList.value = props.value?.goodsItems ? cloneDeep(props.value.goodsItems) : [];
    couponTableDataList.value = props.value?.couponItems ? cloneDeep(props.value.couponItems) : [];
    nextTick(() => {
      if (goodsTableDataList.value?.length) {
        setGoodsSelectedRowKeys([
          ...goodsTableDataList.value.filter((i) => i.select).map((i) => i.id),
        ]);
      }

      if (couponTableDataList.value?.length) {
        setCouponSelectedRowKeys([
          ...couponTableDataList.value.filter((i) => i.select).map((i) => i.id),
        ]);
      }
      flag = false;
    });
  });

  defineExpose({ initData, getCouponSelectedRows, getGoodsSelectedRows });
</script>
