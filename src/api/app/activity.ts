import { defHttp, downloadLink } from '/@/utils/http/axios';
import {
  IActiviyListParams,
  IActiviyListItem,
  IActiviyListResultModel,
  IActiviyParams,
  IActiviyReocrdListParams,
  IActiviyReocrdListResultModel,
} from './model/activityModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  ACTIVITY = '/api/pt/app/activity',
}

// 活动：列表
export const activityList = (params: IActiviyListParams) =>
  defHttp.get<IActiviyListResultModel>({ url: `${Api.ACTIVITY}/list`, params });

// 活动：详情
export const activityDetail = (id: number) =>
  defHttp.get<IActiviyListItem>({ url: `${Api.ACTIVITY}/info/${id}` });

// 活动：创建
export const activityCreate = (params: IActiviyParams) =>
  defHttp.post<IActiviyListItem>({ url: `${Api.ACTIVITY}/info`, params });

// 活动：更新
export const activityUpdate = (id: number, params: IActiviyParams) =>
  defHttp.put<IActiviyListItem>({ url: `${Api.ACTIVITY}/info/${id}`, params });

// 活动：记录列表
export const activityRecordList = (params: IActiviyReocrdListParams) =>
  defHttp.get<IActiviyReocrdListResultModel>({ url: `${Api.ACTIVITY}/record-list`, params });

// 活动：记录列表导出
export const activityRecordExport = async (params: IActiviyReocrdListParams) => {
  // const res = await defHttp.get(
  //   { url: `${Api.ACTIVITY}/record-export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出报名记录.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.ACTIVITY}/record-export`, params);
  downloadByUrl({ url });
};
