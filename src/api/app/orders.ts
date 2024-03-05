import { defHttp, downloadLink } from '/@/utils/http/axios';

import {
  OrdersListParams,
  OrdersListGetResultModel,
  AftersaleListParams,
  AftersaleStatusUpdateParams,
  IOrderCommentsListParams,
  IOrderCommentsListGetResultModel,
  IOrderConversionListParams,
  IOrderConversionListGetResultModel,
  IOrderConversionConfigParams,
  IOrderConversionConfigItem,
  IOrderConversionAuditParams,
  IOrderConversionParams,
  AftersaleRefundOrderParams,
  AftersaleRefundOrderListGetResultModel,
} from './model/ordersModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  ORDERS = '/api/pt/app/orders',
  ORDER_CANCEL = '/api/pt/app/orders/{orderNo}/cancel',
  ORDER_EXPORT = '/api/pt/app/orders/export',
  ORDER_SHIP = '/api/pt/app/order-parcel/ship',
  ORDER_DETAIL = '/api/pt/app/orders/{orderNo}/detail',
  MODIFY_AMOUNT = '/api/pt/app/orders/{orderNo}/orderAmount',
  ORDER_REMARK = '/api/pt/app/orders/{orderNo}/remark',
  ORDER_AFTERSALE_ITEMSTATUS = '/api/pt/app/aftersale/itemStatus',
  // 主动退款
  ORDER_AFTERSALE_CREATE_INITIATIVE = '/api/pt/app/aftersale/initiative',

  ORDER_AFTERSALE_LIST = '/api/pt/app/aftersale/list',
  ORDER_AFTERSALE_DETAIL = '/api/pt/app/aftersale/aftersaleNo/{aftersaleNo}',
  ORDER_AFTERSALE = '/api/pt/app/aftersale',
  ORDER_AFTERSALE_STATUS = '/api/pt/app/aftersale/status',
  ORDER_AFTERSALE_REFUND_RETRY = '/api/pt/app/aftersale/aftersaleNo/{aftersaleNo}/refund_retry',
  ORDER_AFTERSALE_REFUND_ORDER = '/api/pt/app/aftersale/refundOrder',

  ORDER_AFTERSALE_EXPORT = '/api/pt/app/aftersale/export',
  ORDER_COMMENTS = '/api/pt/app/order/comments',
  ORDER_CONVERSION = '/api/pt/app/conversion',
  MANUAL_PARCEL_ARRIVED = '/api/pt/app/order-parcel/manualParcelArrived',
}

// 订单列表
export const ordersList = (params: OrdersListParams & any) => {
  if (params.serveStatus === '') {
    delete params.serveStatus;
  }
  return defHttp.get<OrdersListGetResultModel>(
    { url: Api.ORDERS, params },
    { errorMessageMode: 'none' },
  );
};

export const exportOrders = async (params: OrdersListParams & any) => {
  // const data = await defHttp.get(
  //   { url: Api.ORDER_EXPORT, params, responseType: 'blob' },
  //   { errorMessageMode: 'none' },
  // );
  // downloadByData(data, '订单导出' + '.csv');
  const url = downloadLink(Api.ORDER_EXPORT, params);
  downloadByUrl({ url });
};

export const ordersCancel = (params: { userId: number; orderNo: string; cancelMemo: string }) =>
  defHttp.put({
    url: Api.ORDER_CANCEL.replace('{orderNo}', params.orderNo),
    data: { ...params },
  });

export const ordersDetail = (orderNo: string) =>
  defHttp.get({
    url: Api.ORDER_DETAIL.replace('{orderNo}', orderNo),
  });

export const ordersModifyAmount = (
  orderNo: string,
  changeAmount: number,
  changeCostFreight: number,
) =>
  defHttp.put({
    url: Api.MODIFY_AMOUNT.replace('{orderNo}', orderNo),
    data: {
      changeAmount: String(changeAmount),
      changeCostFreight: String(changeCostFreight),
      orderNo,
    },
  });

export const createInitiativeAfterSale = (data: {
  orderNo: string;
  refundGoodsAmount: string;
  skuId: string;
  userId: string;
  refundCostFreight: boolean;
}) => defHttp.post({ url: Api.ORDER_AFTERSALE_CREATE_INITIATIVE, data: data });

export const ordersShip = (data: {
  parcelNo: string | null; //包裹号, 整单发货传null
  orderNo: string; // 订单号
  logisticsNo: string; // 物流No
  logisticsCode: string;
}) => defHttp.put({ url: Api.ORDER_SHIP, data: data });

//通过订单No返回售后项可退状态
export const ordersAftersaleItemStatus = (orderNos: string) =>
  defHttp.get({
    url: Api.ORDER_AFTERSALE_ITEMSTATUS,
    params: { orderNos },
  });

// 售后列表
export const aftersaleList = (params: AftersaleListParams) =>
  defHttp.get<AftersaleRefundOrderListGetResultModel>(
    { url: Api.ORDER_AFTERSALE_LIST, params },
    { errorMessageMode: 'none' },
  );

// 售后详情
export const aftersaleDetail = (aftersaleNo: string) =>
  defHttp.get({ url: Api.ORDER_AFTERSALE_DETAIL.replace('{aftersaleNo}', aftersaleNo) });

// 售后状态修改，同意、拒绝
export const aftersaleStatusUpdate = (data: AftersaleStatusUpdateParams) =>
  defHttp.put({ url: Api.ORDER_AFTERSALE_STATUS, data });

export const orderRemark = (orderNo: string, remark: string) =>
  defHttp.put({ url: Api.ORDER_REMARK.replace('{orderNo}', orderNo), data: { orderNo, remark } });

// 重试退款请求
export const aftersaleRetryRefund = (aftersaleNo: string) =>
  defHttp.post({
    url: Api.ORDER_AFTERSALE_REFUND_RETRY.replace('{aftersaleNo}', aftersaleNo),
    data: {},
  });

export const exportAftersaleList = async (params: any) => {
  // const res = await defHttp.get(
  //   {
  //     url: Api.ORDER_AFTERSALE_EXPORT,
  //     responseType: 'blob',
  //     params: params,
  //   },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(Api.ORDER_AFTERSALE_EXPORT, params);
  downloadByUrl({ url });
};

// 主动退单
export const aftersaleRefundOrder = (params: AftersaleRefundOrderParams) =>
  defHttp.post(
    {
      url: Api.ORDER_AFTERSALE_REFUND_ORDER,
      data: params,
    },
    { errorMessageMode: 'none' },
  );

// 订单评论：列表
export const orderCommentsList = (params: IOrderCommentsListParams) =>
  defHttp.get<IOrderCommentsListGetResultModel>({ url: `${Api.ORDER_COMMENTS}/list`, params });

export const orderCommentsExport = async (params: IOrderCommentsListParams) => {
  // const res = await defHttp.get(
  //   { url: `${Api.ORDER_COMMENTS}/export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出订单评论.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.ORDER_COMMENTS}/export`, params);
  downloadByUrl({ url });
};

// 订单转化记录：列表
export const orderConversionList = (params: IOrderConversionListParams) =>
  defHttp.get<IOrderConversionListGetResultModel>({
    url: `${Api.ORDER_CONVERSION}/record-list`,
    params,
  });

// 订单转化记录：详情
export const orderConversionDetail = (id: number) =>
  defHttp.get({ url: `${Api.ORDER_CONVERSION}/record-info/${id}` });

// 订单转化配置：修改
export const orderConversionUpdate = (id: number, params: IOrderConversionParams) =>
  defHttp.put<IOrderConversionConfigItem>({
    url: `${Api.ORDER_CONVERSION}/update-record/${id}`,
    params,
  });

// 订单转化记录：审核
export const orderConversionAudit = (params: IOrderConversionAuditParams) =>
  defHttp.put({ url: `${Api.ORDER_CONVERSION}/record-audit`, params });

// 订单转化配置：保存
export const orderConversionConfigSave = (params: IOrderConversionConfigParams) =>
  defHttp.put<IOrderConversionConfigItem>({
    url: `${Api.ORDER_CONVERSION}/config`,
    params,
  });

// 订单转化配置：详情
export const orderConversionConfigDetail = () =>
  defHttp.get<IOrderConversionConfigItem>(
    { url: `${Api.ORDER_CONVERSION}/config` },
    { errorMessageMode: 'none' },
  );

// 订单转化记录：导出
export const orderConversionExport = async (params: IOrderConversionListParams) => {
  const url = downloadLink(`${Api.ORDER_CONVERSION}/record-export`, params);
  downloadByUrl({ url });
};

// 订单：取消特殊订单
export const orderCancelSpecial = (orderNo: string) =>
  defHttp.put<IOrderConversionConfigItem>(
    { url: `${Api.ORDERS}/${orderNo}/cancelSpecial` },
    { errorMessageMode: 'none' },
  );

// 手动完成订单物流回调
export const orderManualParcelArrived = (params: { parcelId: number; orderNo: string }) =>
  defHttp.put({ url: Api.MANUAL_PARCEL_ARRIVED, params });
