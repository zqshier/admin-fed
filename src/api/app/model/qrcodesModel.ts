import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type QrcodesListParams = BasicPageParams;

export interface QrcodesListItem {
  id: number;
  name: string; // 名称
  page: string; // 页面路径
  createdAt: string; // 创建时间
}

export type QrcodesListGetResultModel = BasicFetchResult<QrcodesListItem>;

export interface QrcodesModel {
  name: string; // 名称
  page: string; // 页面路径，可带参数比如 pages/index?a=1
}

export interface QrcodesBatchesModel {
  id: number;
  qrCodeId: number;
  count: number;
  createdAt: string;
}

export type QrcodesBatchesGetResultModel = BasicFetchResult<QrcodesBatchesModel>;

export interface QrcodesBatchesListParams extends BasicPageParams {
  id: number;
}
