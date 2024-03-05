import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';
import { DescItem } from '/@/components/Description';
import { Tag } from 'ant-design-vue';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { AfterSaleType } from '/@/api/app/model/ordersModel';
import { DELIVERY_LIST } from '/@/api/delivery-list';

export const primaryKey = 'id';

export function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

export const ServiceStatusOptions = [
  { label: '退款申请待处理', value: 'pending', color: 'gray' },
  { label: '拒绝退款申请', value: 'refuse', color: 'red' },
  // { label: '同意退款申请待买家退货', value: 'approve', color: 'green' },
  { label: '同意退款申请待买家退货', value: 'pending_fill_up_logistic', color: 'green' },
  { label: '买家已退货待确认收货', value: 'pending_shipment', color: 'red' },
  { label: '退款处理中', value: 'refund_pending', color: 'gray' },
  { label: '退款成功', value: 'refund_success', color: 'green' },
  { label: '退款关闭', value: 'close', color: 'gray' },
];

//仅退款 money_only  退货退款 money_goods 小额补差 initiative
export const ServiceTypeOptions = [
  { label: '仅退款', value: AfterSaleType.MONEY_ONLY },
  { label: '退货退款', value: AfterSaleType.MONEY_GOODS },
  { label: '小额补差', value: AfterSaleType.INITIATIVE },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '退款单号',
    dataIndex: 'afterSaleNo',
    width: 170,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 170,
  },
  {
    title: '退款商品',
    dataIndex: 'goodsInfo.name',
    customRender({ record }: Recordable) {
      return h('div', [
        h('div', record?.goodsInfo?.name || ''),
        h('div', record?.goodsInfo?.skuSn || ''),
      ]);
    },
  },
  {
    title: '发货状态',
    dataIndex: 'isDelivery',
    customRender({ value }: Recordable) {
      return value ? '已发货' : '未发货';
    },
    width: 100,
  },
  {
    title: '订单金额',
    dataIndex: 'price',
    customRender({ record }: Recordable) {
      return record.order?.payableAmount;
    },
    width: 100,
  },
  {
    title: '退款金额',
    dataIndex: 'totalRefundAmount',
    width: 100,
  },
  {
    title: '申请时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
    width: 100,
  },
  {
    title: '申请人',
    dataIndex: 'operator',
    width: 130,
  },
  // {
  //   title: '申请人门店',
  //   dataIndex: 'guide.store',
  //   customRender({ record }: Recordable) {
  //     return record.guide?.store?.name;
  //   },
  // },
  {
    title: '退款状态',
    dataIndex: 'status',
    customRender({ value }: Recordable) {
      const tag = ServiceStatusOptions.find((item) => item.value === value);
      return h(Tag, { color: tag?.color }, () => tag?.label);
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
    field: 'afterSaleNo',
    label: '退款单号',
    component: 'Input',
  },
  {
    field: 'goodsName',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '退款方式',
    component: 'Select',
    componentProps: {
      options: ServiceTypeOptions,
    },
  },
  {
    field: 'status',
    label: '退款状态',
    component: 'Select',
    componentProps: {
      options: ServiceStatusOptions,
    },
  },
  {
    field: '[startTime, endTime]',
    label: '申请时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];

// 详情基本信息
export const detailBaseSchema: DescItem[] = [
  {
    field: 'operatorType',
    label: '申请人',
    render(operatorType, record) {
      return h(OperatorInfo, { type: operatorType, id: record.operator, showType: false });
    },
  },
  {
    field: 'guide.store.name',
    label: '申请人门店',
  },
  {
    field: 'createdAt',
    label: '申请时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'totalRefundAmount',
    label: '退款金额',
  },
  {
    field: 'afterSaleNo',
    label: '退款单号',
  },
  {
    field: 'orderNo',
    label: '订单号',
  },
  {
    field: 'type',
    label: '售后类型',
    render(value) {
      return {
        [AfterSaleType.MONEY_ONLY]: '仅退款',
        [AfterSaleType.MONEY_GOODS]: '退货退款',
        [AfterSaleType.INITIATIVE]: '小额补差',
      }[value];
    },
  },
];

//详情退款信息
export const detailRefundSchema: DescItem[] = [
  {
    field: 'totalRefundAmount',
    label: '退款金额',
    render(val, data) {
      if (data?.refundGiftCardAmount && +data.refundGiftCardAmount) {
        const refundDetails =
          data?.refundDetails &&
          data?.refundDetails.map((item) => `${item.identifier}兑换卡：${item.discountAmount}`);
        const str = refundDetails ? refundDetails.join('\n') : '';
        const refundGoodsAmount = +data.refundGoodsAmount + +data.refundCostFright;
        return h(
          'div',
          { style: { 'white-space': 'pre-wrap' } },
          `${val}\n微信支付: ${refundGoodsAmount || 0}\n${str}`,
        );
      }
      return val;
    },
  },
  {
    field: 'buyerPhone',
    label: '联系方式',
  },
  {
    field: 'logs',
    label: '退款历史',
    render(val) {
      return val.length;
    },
  },
];
// 退款备注
export const detailRefundExtendInfoSchema: DescItem[] = [
  {
    field: 'extendInfo.description',
    label: '退款描述',
    render(val) {
      if (val === '') {
        return '无';
      }
      return val;
    },
  },
];

//详情退款申请信息
export const detailApplySchema: DescItem[] = [
  {
    field: 'shopInfo.name',
    label: '销售门店',
  },
  {
    field: 'guideInfo.name',
    label: '销售导购',
  },
  {
    field: 'shipGuideInfo.name',
    label: '发货导购',
  },
  {
    field: 'shipShopInfo.name',
    label: '发货门店',
  },
  {
    field: 'refundAmount',
    label: '退款金额',
  },
  {
    field: 'buyerPhone',
    label: '用户联系方式',
  },
];

//详情退款物流信息
export const detailRefundLogisticSchema: DescItem[] = [
  {
    field: 'logisticCode',
    label: '物流公司',
    render(value) {
      const c = DELIVERY_LIST.find((o) => o.code === value);
      return c?.name || '未知';
    },
  },
  {
    field: 'logisticNo',
    label: '物流单号',
  },
  {
    field: 'logs',
    label: '填写时间',
    render(logs) {
      let time: any = '';
      for (const log of logs) {
        if (log.action === 'fill_shipment') {
          time = log.createdAt;
        }
      }
      return time && dayjs(time).format('YYYY/MM/DD HH:mm:ss');
    },
  },
];
