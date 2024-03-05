import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';
import { format } from 'date-fns';
import { storesListApi } from '/@/api/app/stores';
import { TabsOptionItem } from '/@/components/TabsOption';
import { DELIVERY_LIST } from '/@/api/delivery-list';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const primaryKey = 'id';

export const tabsOptionList: TabsOptionItem[] = [
  { key: 0, tab: '全部' },
  { key: 1, tab: '待付款' },
  { key: 2, tab: '待发货' },
  { key: 3, tab: '已发货' },
  { key: 4, tab: '已完成' },
  { key: 5, tab: '已关闭' },
  { key: 6, tab: '退款中' },
];

export const tabsOptionListParams = [
  {},
  { orderStatus: 'pending_paid' },
  { orderStatus: 'pending_shipment' },
  { orderStatus: 'pending_receipt' },
  { orderStatus: 'completed' },
  { orderStatus: 'closed' },
  { serveStatus: 'serving' },
];

export const OrderStatus = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending_paid' },
  { label: '待发货', value: 'pending_shipment' },
  { label: '已发货', value: 'pending_receipt' },
  { label: '已完成', value: 'completed' },
  { label: '已关闭', value: 'closed' },
  { label: '已取消', value: 'canceled' },
  { label: '无效订单', value: 'invalid' },
  { label: '部分付款', value: 'partial_paid' },
];

export enum OrderStatusEnum {
  // 待付款
  PENDING_PAID = 'pending_paid',
  // 待发货
  PENDING_SHIPMENT = 'pending_shipment',
  // 待收货
  PENDING_RECEIPT = 'pending_receipt',
  // 已完成
  COMPLETED = 'completed',
  // 取消 用户取消或者超时取消
  CANCELED = 'canceled',
  // 交易关闭 全部退款情况
  CLOSED = 'closed',
  // 无效订单
  INVALID = 'invalid',
  // 部分付款(针对预购)
  PARTIAL_PAID = 'partial_paid',
}

export const OrderStatusNames = {
  pending_paid: '待付款',
  pending_shipment: '已付款',
  pending_receipt: '待收货',
  completed: '已完成',
  canceled: '已取消',
  // 交易关闭 全部退款情况
  closed: '交易关闭',
};

export const goodsServeStatusNames = {
  // 售后中
  serving: '退款中',
  // 退款完成
  close: '退款完成',
  // 不存在
  noserving: '无退款',
};

export enum OrderType {
  default = 'default', // 正常订单
  giftCard = 'giftCard', // 礼品卡
  point = 'point', // 积分订单
  adopt = 'adopt', // 认养订单
}

export const bizCodesOptions = [
  { label: '普通订单', value: OrderType.default },
  { label: '兑换卡', value: OrderType.giftCard },
  { label: '认养订单', value: OrderType.adopt },
];

export const OrderStatusColors = (status: string) => {
  switch (status) {
    case 'pending_paid':
      return '#666666';
    case 'pending_shipment':
      return 'blue';
    case 'pending_receipt':
      return 'purple';
    case 'completed':
      return 'green';
    case 'canceled':
      return '';
    case 'closed':
      return 'red';
  }
  return 'default';
};

export const ServeStatusNames = {
  default: '',
  serving: '售后中',
  close: '退款完成',
  cancel: '已取消',
};

export const ServeStatusColors = (status: string) => {
  switch (status) {
    case 'serving':
      return 'blue';
    case 'close':
      return 'green';
    case 'cancel':
      return '';
  }
  return '';
};

export enum OrderServeStatus {
  DEFAULT = 'default',
  // 售后中
  SERVING = 'serving',
  // 退款完成
  CLOSE = 'close',
  // 已取消
  CANCEL = 'cancel',
}

export const AfterSaleStatus = [
  { label: '全部', value: '' },
  { label: '退款中', value: OrderServeStatus.SERVING },
  { label: '退款完成', value: OrderServeStatus.CLOSE },
];

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 200,
  },
  {
    title: '订单类型',
    dataIndex: 'bizCode',
    customRender: ({ text }) => bizCodesOptions.find((i) => i.value === text)?.label || '-',
  },
  {
    title: '商品信息',
    dataIndex: 'name',
    key: 'items',
    ellipsis: false,
    width: 500,
  },
  {
    title: '订单金额（元）',
    dataIndex: 'payableAmount',
  },
  {
    title: '买家',
    dataIndex: 'userId',
    customRender: ({ text }: Recordable) => {
      if (!text) return '';
      return h(OperatorInfo, { type: 'user', id: text, showType: true, showId: true, block: true });
    },
  },
  {
    title: '收货人',
    dataIndex: 'deliverAddr',
    key: 'deliverAddr',
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '售后状态',
    dataIndex: 'serveStatus',
    key: 'serveStatus',
    customRender({ text }) {
      return (
        {
          close: '关闭',
          refund_success: '退款成功',
          refund_pending: '退款进行中',
          pending_shipment: '物流寄回',
          pending_fill_up_logistic: '等待寄回',
          refuse: '拒绝',
          pending: '等待处理',
        }[text] || '-'
      );
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
  },
  {
    field: 'itemName',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'nickName',
    label: '买家昵称',
    component: 'Input',
  },
  {
    field: 'userPhone',
    label: '买家手机号',
    component: 'Input',
  },
  {
    field: 'name',
    label: '收货人姓名',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '收货人手机号',
    component: 'Input',
  },
  {
    field: 'bizCodes',
    label: '订单类型',
    component: 'Select',
    componentProps: { options: bizCodesOptions },
  },
  {
    field: 'orderStatus',
    label: '订单状态',
    component: 'Select',
    componentProps: {
      options: OrderStatus,
    },
  },
  {
    field: 'serveStatus',
    label: '售后状态',
    component: 'Select',
    componentProps: {
      options: AfterSaleStatus,
    },
  },
  {
    field: 'saleStore',
    label: '销售门店',
    component: 'ApiSelect',
    componentProps: {
      api: storesListApi,
      immediate: false,
      resultField: 'list',
      valueField: 'code',
      labelField: 'name',
    },
  },
  {
    field: 'sendStore',
    label: '发货门店',
    component: 'ApiSelect',
    componentProps: {
      api: storesListApi,
      immediate: false,
      resultField: 'list',
      valueField: 'code',
      labelField: 'name',
    },
  },
  {
    field: '[startTime, endTime]',
    label: '下单时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'useGiftCard',
    label: '是否使用兑换卡',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
];

// 详情订单信息
export const orderSchema: DescItem[] = [
  {
    field: 'orderNo',
    label: '订单编号',
  },
  {
    field: 'createTime',
    label: '下单时间',
    render(val) {
      if (!val) return h('div', '-');
      return h('div', format(new Date(val), 'yyyy/MM/dd HH:mm:ss'));
    },
  },
  {
    field: 'payTime',
    label: '付款时间',
    render(val) {
      return val ? format(new Date(val), 'yyyy/MM/dd HH:mm:ss') : '-';
    },
  },
  {
    field: 'payableAmount',
    label: '付款金额',
  },
  {
    field: 'bizCode',
    label: '订单类型',
    render: (val) => bizCodesOptions.find((i) => i.value === val)?.label || '-',
  },
  {
    field: 'guide.name',
    label: '销售导购',
  },
  {
    field: 'guide.store.name',
    label: '销售门店',
  },
  {
    field: 'completeTime',
    label: '订单完成时间',
    render: (val) => (val ? formatToDateTime(val) : ''),
  },
  // {
  //   field: 'orderNo',
  //   label: '发货导购',
  // },
  // {
  //   field: 'orderNo',
  //   label: '发货门店',
  // },
];

//详情买家信息
export const buyerSchema: DescItem[] = [
  {
    field: 'user.id',
    label: '购买用户',
    render(record) {
      if (record) {
        return h(OperatorInfo, {
          type: 'user',
          id: record,
          showType: false,
          showId: true,
          block: true,
        });
      }
    },
  },
  {
    field: 'user.nickname',
    label: '买家昵称',
  },
  {
    field: 'user.phone.phone',
    label: '买家手机号',
  },
  {
    field: 'memo',
    label: '买家留言',
  },
];

//详情收货人信息
export const userSchema: DescItem[] = [
  {
    field: 'deliverAddr.name',
    label: '收货人姓名',
  },
  {
    field: 'deliverAddr.phone',
    label: '收货人手机号',
  },
  {
    field: 'deliverAddr',
    label: '收货地址',
    render(value, data) {
      value = data.deliverAddr;
      if (!value) return '';
      return `${value.provinceName} ${value.cityName}  ${value.districtName} ${value.address}`;
    },
  },
];

//详情物流信息
export const logisticSchema: DescItem[] = [
  {
    field: 'logisticNo',
    label: '运单号',
  },
  {
    field: 'logisticCode',
    label: '物流公司名称',
    render(value) {
      const c = DELIVERY_LIST.find((o) => o.code === value);
      return c?.name || '未知';
    },
  },
  // {
  //   field: 'f1',
  //   label: '发货导购',
  // },
  // {
  //   field: 'f2',
  //   label: '发货门店',
  // },
];

//订单金额表格
export const priceTableSchema: BasicColumn[] = [
  {
    title: '商品总价',
    dataIndex: 'goodsAmount',
  },
  {
    title: '运费',
    dataIndex: 'costFreight',
  },
  {
    title: '运费修改',
    dataIndex: 'changeCostFreight',
  },
  {
    title: '优惠',
    dataIndex: 'orderDiscountAmount',
  },
  {
    title: '应收金额',
    dataIndex: 'payableAmount',
  },
  {
    title: '实收金额',
    dataIndex: 'receivableAmount',
  },
];

//优惠明细表格
export const dicountTableSchema: BasicColumn[] = [
  {
    title: '优惠类型',
    dataIndex: 'type',
    customRender({ value }: Recordable) {
      return (
        {
          coupon: '优惠券',
          point: '积分抵扣',
          change: '改价',
          promotion: '促销活动',
          cost_freight: '运费改价',
        }[value] || '-'
      );
    },
  },
  {
    title: '优惠名称',
    dataIndex: 'name',
    customRender({ value, record }: Recordable) {
      let name = value;
      const type = record.type;
      if (type === 'point') {
        name = `${record.value}积分`;
      }
      if (type === 'change') {
        name = `${record.operator.nickname}`;
      }
      if (type === 'cost_freight') {
        name = `修改邮费`;
      }
      return name || '-';
    },
  },
  {
    title: '优惠商品',
    dataIndex: 'items',
    customRender({ record }: Recordable) {
      if (record.scope === 'all_goods') {
        return '整单';
      } else {
        return record.items.map((item) => item.orderItem?.goodsInfo.name || '').join('、');
      }
    },
  },
  {
    title: '优惠金额',
    dataIndex: 'discountAmount',
  },
];

export const goodsTableSchema: BasicColumn[] = [
  {
    title: '商品信息',
    dataIndex: 'goodsInfo.name',
    key: 'name',
    customRender({ record }: Recordable) {
      return record?.goodsInfo?.name || '';
    },
  },
  {
    title: '状态',
    dataIndex: 'serveStatus',
    customRender({ value }: Recordable) {
      //售后中 serving 退款完成 close 不存在状态 noserving
      return { servin: '售后中', close: '退款完成', noserving: '-' }[value] || '-';
    },
  },
  {
    title: '单价',
    dataIndex: 'mktPrice',
  },
  {
    title: '数量',
    dataIndex: 'count',
  },
  {
    title: '优惠金额（元）',
    dataIndex: 'orderItemDiscountAmount',
  },
  {
    title: '商品应支付价',
    dataIndex: 'payableAmount',
  },
];

export const payChannelTableSchema: BasicColumn[] = [
  {
    title: '支付渠道',
    dataIndex: 'channel',
  },
  {
    title: '支付金额',
    dataIndex: 'price',
  },
];

/** 支持发货的物流公司列表 */
export const deliveryList = DELIVERY_LIST.filter((o) =>
  ['SF', 'JD', 'YTO', 'STO', 'ZTO', 'BTWL', 'YZPY', 'DBL', 'DBLKY', 'YD', 'JTSD'].includes(o.code),
);
// [
//   { code: 'SF', name: '顺丰速运' },
//   { code: 'JD', name: '京东快递' },
//   { code: 'YTO', name: '圆通速递' },
//   { code: 'STO', name: '申通快递' },
//   { code: 'ZTO', name: '中通快递' },
//   { code: 'BTWL', name: '百世快运' },
//   { code: 'YZPY', name: '邮政快递包裹' },
//   { code: 'DBL', name: '德邦快递' },
//   { code: 'DBLKY', name: '德邦快运' },
//   { code: 'YD', name: '韵达速递' },
//   { code: 'JTSD', name: '极兔速递' },
// ];
