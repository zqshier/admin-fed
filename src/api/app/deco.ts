import { defHttp } from '/@/utils/http/axios';

import {
  BannersListParams,
  BannersListGetResultModel,
  BannersListItem,
  IGoodsRecommendListParams,
  GoodsRecommendListGetResultModel,
  IGoodsRecommendItem,
  IGoodsRecommendParams,
  IVideoChannelItem,
  IVideoChannelParams,
} from './model/decoModel';

enum Api {
  BANNERS = '/api/pt/app/deco/banners',
  Documents = '/api/pt/app/deco/documents',
  GoodsRecommend = '/api/pt/app/deco/goods-recommend',
  VideoChannel = '/api/pt/app/deco/video-channel',
}

// banners列表
export const bannersList = (params: BannersListParams) =>
  defHttp.get<BannersListGetResultModel>(
    { url: Api.BANNERS, params },
    { errorMessageMode: 'none' },
  );

// banners新建
export const bannersCreate = (data: BannersListItem) => defHttp.post({ url: Api.BANNERS, data });

// banners更新
export const bannersUpdate = (id: number, data: BannersListItem) =>
  defHttp.put({ url: `${Api.BANNERS}/${id}`, data });

// banners删除
export const bannersDelete = (id: number) => defHttp.delete({ url: `${Api.BANNERS}/${id}` });

// 文档列表
export const documentsList = (params: { page?: number; perPage?: number }) =>
  defHttp.get({ url: Api.Documents, params }, { errorMessageMode: 'none' });

// 文档新建或更新
export const documentsSave = (params: any) =>
  defHttp.post({ url: Api.Documents, params }, { errorMessageMode: 'none' });

export const documentsDel = (code: string) =>
  defHttp.delete({ url: Api.Documents + `/${code}` }, { errorMessageMode: 'none' });

export const documentsShow = (code: string) =>
  defHttp.get({ url: Api.Documents + `/${code}` }, { errorMessageMode: 'none' });

//文档:内容列表
export const contentsList = (params: { code: string; page?: number; perPage?: number }) =>
  defHttp.get(
    { url: Api.Documents + '/' + params.code + '/contents', params },
    { errorMessageMode: 'none' },
  );

//文档:内容创建&更新
export const contentsSave = (code: string, params: any) =>
  defHttp.post({ url: Api.Documents + '/' + code + '/contents', params });

//文档:内容创建&更新
export const contentsDelete = (code: string, id: number) =>
  defHttp.delete({ url: Api.Documents + '/' + code + '/contents/' + id });

//文档:猜你喜欢列表
export const goodsRecommendList = (params: IGoodsRecommendListParams) =>
  defHttp.get<GoodsRecommendListGetResultModel>({ url: `${Api.GoodsRecommend}/list`, params });

//文档:猜你喜欢详情
export const goodsRecommendDetail = (id: number) =>
  defHttp.get({ url: `${Api.GoodsRecommend}/info/${id}` });

//文档:猜你喜欢编辑
export const goodsRecommendUpdate = (data: IGoodsRecommendParams) =>
  defHttp.put<IGoodsRecommendItem>({ url: `${Api.GoodsRecommend}/edit`, data });

//视频号配置:详情
export const videoChannelDetail = () =>
  defHttp.get<IVideoChannelItem>({ url: `${Api.VideoChannel}/info` });

//视频号配置:编辑
export const videoChannelEdit = (params: IVideoChannelParams) =>
  defHttp.put<IVideoChannelItem>({ url: `${Api.VideoChannel}/edit`, params });
