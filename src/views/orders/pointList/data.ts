import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';
import { DELIVERY_LIST } from '/@/api/delivery-list';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { OrderStatus, OrderStatusColors, OrderStatusNames } from '../list/data';
// import { goodsTypeList } from '../../mms/pointmall/data';
import { Tag } from 'ant-design-vue';
import { goodsTypeOptions } from '../../goods/list/data';
export const primaryKey = 'id';
export const pageTitle = '积分订单列表';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 200,
  },
  {
    title: '商品类型',
    dataIndex: 'goodsType',
    key: 'goodsType',
  },
  {
    title: '商品信息',
    dataIndex: 'name',
    key: 'items',
    ellipsis: false,
    width: 500,
  },
  {
    title: '兑换价',
    dataIndex: 'payablePoint',
    customRender: ({ record }: Recordable) => payableAmountText(record),
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
    customRender({ text }) {
      if (!text) return '-';
      return h(Tag, { color: OrderStatusColors(text) }, OrderStatusNames[text]);
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
  },
  {
    field: 'itemTypes',
    label: '商品类型',
    component: 'Select',
    componentProps: { options: goodsTypeOptions },
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
    field: '[startTime, endTime]',
    label: '下单时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
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
    field: 'payTime',
    label: '付款时间',
    render: (val) => (val ? formatToDateTime(val) : '-'),
  },
  {
    field: 'payableAmount',
    label: '兑换价',
    render: (_, data) => payableAmountText(data),
  },
  {
    field: 'itemType',
    label: '商品类型',
    render(_, data) {
      let text = '';
      data.orderItems.forEach((item) => {
        text +=
          (item.itemType && goodsTypeOptions.find((i) => i.value === +item.itemType)?.label) || '';
      });
      return text;
    },
  },
  {
    field: 'guide.name',
    label: '销售导购',
  },
  {
    field: 'guide.store.name',
    label: '销售门店',
  },
];

//详情买家信息
export const buyerSchema: DescItem[] = [
  {
    field: 'user.id',
    label: '购买用户',
    render(record) {
      if (record)
        return h(OperatorInfo, {
          type: 'user',
          id: record,
          showId: true,
          showType: false,
          block: true,
        });
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

export const goodsTableSchema: BasicColumn[] = [
  {
    title: '商品信息',
    dataIndex: 'goodsInfo.name',
    key: 'name',
    width: 500,
    customRender({ record }: Recordable) {
      return record?.goodsInfo?.name || '';
    },
  },
  {
    title: '兑换价',
    dataIndex: 'mkt',
    children: [
      {
        title: '商品单价',
        dataIndex: 'payableAmount',
      },
      {
        title: '商品所需积分',
        dataIndex: 'payablePoint',
      },
    ],
  },
  {
    title: '数量',
    dataIndex: 'count',
  },
  {
    title: '商品实付',
    dataIndex: 'payable',
    children: [
      {
        title: '商品单价',
        dataIndex: 'payableAmount',
      },
      {
        title: '商品所需积分',
        dataIndex: 'payablePoint',
      },
    ],
  },
];

function payableAmountText(data: Recordable) {
  if (data.payableAmount > 0 && data.payablePoint <= 0) {
    // 纯金额
    return `${data.payableAmount}元`;
  } else if (data.payableAmount > 0 && data.payablePoint > 0) {
    // 积分加钱
    return `${data.payableAmount}元+${data.payablePoint}积分`;
  } else {
    // 积分
    return `${data.payablePoint}积分`;
  }
  return '';
}
