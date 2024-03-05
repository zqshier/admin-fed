import { defHttp } from '/@/utils/http/axios';
import {
  IDistributorsParams,
  IDistributorsListParams,
  IDistributorsListResultModel,
  IBatchesParams,
  IBatchesListParams,
  IBatchesListItemResultModel,
  IBatchesDetailParams,
  IBatchesDetailItem,
  IDcodesQueryItem,
  IProductsParams,
  IProductsListParams,
  IProductsListResultModel,
  IRecordsListParams,
  IStagingParams,
  IStagingItem,
  IStagingListParams,
  IStagingListResultModel,
  IStagingStatus,
  IRecordsListResultModel,
  ICodesListParams,
  IBindDailyListParams,
  IBindDailyListResultModel,
} from './model/uicodeModel';
import type { ErrorMessageMode } from '/#/axios';

enum Api {
  UICODE = '/api/pt/app/uicode',
  UICODE_BATCHES = '/api/pt/app/uicode/batches',
  UICODE_DISTRIBUTORS = '/api/pt/app/uicode/distributors',
  UICODE_CODESQUERY = '/api/pt/app/uicode/codes/query',
  UICODE_PRODUCTIS = '/api/pt/app/uicode/products',
  UICODE_RECORDS = '/api/pt/app/uicode/records',
  UICODE_STAGING = '/api/pt/app/uicode/staging',
}

// 任务：列表
export const batchesList = (params: IBatchesListParams) =>
  defHttp.get<IBatchesListItemResultModel>({ url: Api.UICODE_BATCHES, params });

// 任务: 新建
export const batchesCreate = (data: IBatchesParams) =>
  defHttp.post({ url: Api.UICODE_BATCHES, data });

// 任务: 启动任务
export const batchesStart = (id: number) =>
  defHttp.post({ url: `${Api.UICODE_BATCHES}/${id}/start` });

// 任务: 详情
export const batchesDetail = (id: number, params: IBatchesDetailParams) =>
  defHttp.get<IBatchesDetailItem>({ url: `${Api.UICODE_BATCHES}/${id}`, params });

// 任务: 子任务下载链接
export const batchesTasksLinks = (id: number, taskId: number) =>
  defHttp.get<{ link: string; zipPassword: string }>({
    url: `${Api.UICODE_BATCHES}/${id}/tasks/${taskId}/links`,
  });

// 任务: 子任务出库
export const batchesTasksSetPublished = (id: number, taskId: number) =>
  defHttp.put<{ link: string; zipPassword: string }>({
    url: `${Api.UICODE_BATCHES}/${id}/tasks/${taskId}/set-published`,
  });

// 经销商：列表
export const distributorsList = (params: IDistributorsListParams) =>
  defHttp.get<IDistributorsListResultModel>({ url: Api.UICODE_DISTRIBUTORS, params });

// 经销商：新建
export const distributorsCreate = (data: IDistributorsParams) =>
  defHttp.post({ url: Api.UICODE_DISTRIBUTORS, data });

// 经销商：更新
export const distributorsUpdate = (id: number, data: IDistributorsParams) =>
  defHttp.put({ url: `${Api.UICODE_DISTRIBUTORS}/${id}`, data });

// 明码查询
export const codesQuery = (
  params: { sn: string },
  errorMessageMode: ErrorMessageMode = 'message',
) => defHttp.get<IDcodesQueryItem>({ url: Api.UICODE_CODESQUERY, params }, { errorMessageMode });

// 获取太阳码
export const wxacode = (sn: string) =>
  defHttp.get<ArrayBuffer>({
    url: `${Api.UICODE}/codes/${sn}/wxacode`,
    responseType: 'arraybuffer',
  });

// 产品库：列表
export const productsList = (params: IProductsListParams) =>
  defHttp.get<IProductsListResultModel>(
    { url: Api.UICODE_PRODUCTIS, params },
    { errorMessageMode: 'message' },
  );

// 产品库：新建
export const productsCreate = (data: IProductsParams) =>
  defHttp.post({ url: Api.UICODE_PRODUCTIS, data });

// 产品库：更新
export const productsUpdate = (id: number, data: IProductsParams) =>
  defHttp.put({ url: `${Api.UICODE_PRODUCTIS}/${id}`, data });

// 扫码记录：列表
export const recordsList = (params: IRecordsListParams) =>
  defHttp.get<IRecordsListResultModel>({ url: Api.UICODE_RECORDS, params });

// 暂存区：列表
export const stagingList = (params: IStagingListParams) =>
  defHttp.get<IStagingListResultModel>({ url: Api.UICODE_STAGING, params });

// 暂存区：新建绑定
export const stagingCreate = (data: IStagingParams) =>
  defHttp.post<IStagingItem>({ url: Api.UICODE_STAGING, data }, { errorMessageMode: 'none' });

// 暂存区：更新暂存记录
export const stagingUpdate = (id: number | string, data: { status: IStagingStatus }) =>
  defHttp.put({ url: `${Api.UICODE_STAGING}/${id}`, data });

// 暂存区：批量更新暂存记录
export const stagingBatchUpdate = (data: { status: IStagingStatus; ids: number[] }) =>
  defHttp.post({ url: `${Api.UICODE_STAGING}/batch-update`, data });

// 暂存区：提交绑定
export const stagingCommit = (data: { ids: number[] }) =>
  defHttp.post({ url: `${Api.UICODE_STAGING}/commit`, data });

// 暂存区：日志列表
export const stagingLogList = () => defHttp.get({ url: `${Api.UICODE_STAGING}/logs` });

// 防伪验真真码追溯：列表
export const codesList = (params: ICodesListParams) =>
  defHttp.get({ url: `${Api.UICODE}/codes`, params });

// 绑定记录：列表
export const bindDailyList = (params: IBindDailyListParams) =>
  defHttp.get<IBindDailyListResultModel>({ url: `${Api.UICODE}/data/bind-daily`, params });
