import { defHttp, downloadLink } from '/@/utils/http/axios';

import {
  AwardsListParams,
  AwardsListGetResultModel,
  AwardsCreateModel,
  AwardsUpdateModel,
  LotteriesListItem,
  LotteriesListGetResultModel,
  LotteriesModel,
  LotteriesRecordListParams,
  LotteriesRecordListGetResultModel,
} from './model/lotteriesModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  LOTTERIES_AWARDS = '/api/pt/app/lotteries/awards',
  LOTTERIES = '/api/pt/app/lotteries',
}

// 奖品列表
export const awardsList = (params: AwardsListParams) =>
  defHttp.get<AwardsListGetResultModel>(
    { url: Api.LOTTERIES_AWARDS, params },
    { errorMessageMode: 'none' },
  );

// 新建奖品
export const awardsCreate = (data: AwardsCreateModel) =>
  defHttp.post({ url: Api.LOTTERIES_AWARDS, data });

// 更新奖品
export const awardsUpdate = (id: number, data: AwardsUpdateModel) =>
  defHttp.put({ url: `${Api.LOTTERIES_AWARDS}/${id}`, data });

// 删除奖品
export const awardsDelete = (id: number) =>
  defHttp.delete({ url: `${Api.LOTTERIES_AWARDS}/${id}` });

// 奖池列表
export const lotteriesList = (params: LotteriesListItem) =>
  defHttp.get<LotteriesListGetResultModel>(
    { url: Api.LOTTERIES, params },
    { errorMessageMode: 'none' },
  );

// 新建奖池
export const lotteriesCreate = (data: LotteriesModel) => defHttp.post({ url: Api.LOTTERIES, data });

// 更新奖池
export const lotteriesUpdate = (code: string, data: LotteriesModel) =>
  defHttp.put({ url: `${Api.LOTTERIES}/${code}`, data });

// 奖池信息
export const lotteriesDetail = (code: string) =>
  defHttp.get<LotteriesModel>({ url: `${Api.LOTTERIES}/${code}` });

// 中奖记录
export const lotteriesRecords = (params: LotteriesRecordListParams) =>
  defHttp.get<LotteriesRecordListGetResultModel>({ url: `${Api.LOTTERIES}/records`, params });

export const lotteriesRecordsExport = async (
  fileName: string,
  params: LotteriesRecordListParams,
) => {
  // return fileExport(`${Api.LOTTERIES}/records/export`, params, filename);
  const url = downloadLink(`${Api.LOTTERIES}/records/export`, params);
  downloadByUrl({ url, fileName });
};
