import {
  BuyoutPriceListGetResultModel,
  BuyoutPriceListParams,
  BuyoutPrice,
  IPointmallParams,
  IPointmallListParams,
  IPointmallItemGetResultModel,
  IPointmallItem,
  IPointmallConfigParams,
  IPointmallConfigItem,
} from './model/promotionsModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  BuyoutPrice = '/api/pt/app/promotions/buyoutPrice',
  PointMall = '/api/pt/app/promotions/point-mall',
}

// 一口价列表
export const buyoutPriceList = (params: BuyoutPriceListParams) =>
  defHttp.get<BuyoutPriceListGetResultModel>(
    {
      url: Api.BuyoutPrice + '/list',
      params,
    },
    { errorMessageMode: 'none' },
  );

// 一口价创建
export const buyoutPriceCreate = (data: BuyoutPrice) =>
  defHttp.post({
    url: Api.BuyoutPrice + '/create',
    data,
  });

// 一口价更新
export const buyoutPriceUpdate = (id: string, data: BuyoutPrice) =>
  defHttp.put({
    url: Api.BuyoutPrice + '/update/' + id,
    data,
  });

// 一口价详情
export const buyoutPriceDetail = (id: string) =>
  defHttp.get({
    url: Api.BuyoutPrice + '/' + id + '/show',
  });

// 积分商城：获得配置
export const pointMallConfigsList = () =>
  defHttp.get<{ groups: IPointmallConfigItem[] }>({ url: `${Api.PointMall}/configs` });

// 积分商城：修改配置
export const pointMallConfigsUpdate = (data: { groups: IPointmallConfigParams[] }) =>
  defHttp.put({ url: `${Api.PointMall}/configs`, data });

// 积分商城：列表
export const pointMallList = (params: IPointmallListParams) =>
  defHttp.get<IPointmallItemGetResultModel>({ url: `${Api.PointMall}/list`, params });

// 积分商城：创建
export const pointMallCreate = (data: IPointmallParams) =>
  defHttp.post<{ groups: string[] }>({ url: `${Api.PointMall}/create`, data });

// 积分商城：更新
export const pointMallUpdate = (promotionId: string, data: IPointmallParams) =>
  defHttp.put<IPointmallItemGetResultModel>({
    url: `${Api.PointMall}/${promotionId}/update`,
    data,
  });

// 积分商城：详情
export const pointMallDetail = (promotionId: string) =>
  defHttp.get<IPointmallItem>({ url: `${Api.PointMall}/${promotionId}/show` });
