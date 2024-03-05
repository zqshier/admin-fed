/**
 * 门店管理API
 */

import { defHttp } from '/@/utils/http/axios';
import { StoresListParams, StoresListGetResultModel, StoresListItem } from './model/storesModel';
import { GuidesListParams, GuidesListGetResultModel, GuidesListItem } from './model/storesModel';

enum Api {
  List = '/api/pt/app/stores',
  Guides = '/api/pt/app/stores/guides',
}

// 门店列表
export function storesListApi(params: StoresListParams) {
  return defHttp.get<StoresListGetResultModel>(
    { url: Api.List, params },
    { errorMessageMode: 'none' },
  );
}

// 创建门店
export const storesCreate = (data: StoresListItem) => defHttp.post({ url: Api.List, data });

// 更新门店
export const storesUpdate = (code: string, data: StoresListItem) =>
  defHttp.put({ url: `${Api.List}/${code}`, data });

// 导购列表
export const guidesList = (params: GuidesListParams) =>
  defHttp.get<GuidesListGetResultModel>({ url: Api.Guides, params }, { errorMessageMode: 'none' });

// 新建导购
export const guidesCreate = (data: GuidesListItem) => defHttp.post({ url: Api.Guides, data });

// 更新导购
export const guidesUpdate = (id: number, data: GuidesListItem) =>
  defHttp.put({ url: `${Api.Guides}/${id}`, data });

// 删除导购
export const guidesDelete = (id: number) => defHttp.delete({ url: `${Api.Guides}/${id}` });

/** 导购信息 */
export const guidesInfo = (id: number) => defHttp.get({ url: `${Api.Guides}/${id}` });
