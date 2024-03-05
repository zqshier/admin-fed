import { defHttp } from '/@/utils/http/axios';

import {
  BookingListItem,
  BookingListParams,
  BookingListResultModel,
  WxTemplateListItem,
} from './model/bookingModel';

enum Api {
  BOOKING = '/api/pt/app/bookings',
  TEMPLATES = '/api/pt/app/tpms/wx/templates',
}

// 预约列表
export const bookingList = (params: BookingListParams) =>
  defHttp.get<BookingListResultModel>({
    url: Api.BOOKING,
    params: { ...params, targets: params.targets?.join(',') },
  });

// 预约新增
export const bookingCreate = (data: BookingListItem) => defHttp.post({ url: Api.BOOKING, data });

// 预约更新
export const bookingUpdate = (id: number, data: BookingListItem) =>
  defHttp.put({ url: `${Api.BOOKING}/${id}`, data });

// 微信订阅模板
export const wxTemplatesList = () => defHttp.get<WxTemplateListItem[]>({ url: Api.TEMPLATES });
