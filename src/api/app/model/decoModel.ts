import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type BannersListParams = BasicPageParams;

export interface BannersListItem {
  src: string; //媒体地址

  srcType: 'image' | 'video'; // 媒体类型, image|video ⤵

  link: string; //跳转地址

  linkType: 'none' | 'path' | 'weapp' | 'h5'; //跳转地址类型 ⤵

  position: number; // 排序值

  start: string; //展示开始时间

  end: string; //展示结束时间

  createdAt: string; // 创建时间

  updatedAt: string; //修改时间

  id: number;
}

export type BannersListGetResultModel = BasicFetchResult<BannersListItem>;

export interface IGoodsRecommendListParams extends BasicPageParams {
  itemIds: string;
  name?: string;
  isShow?: number;
}

export interface IGoodsRecommendParams {
  itemId: number;
  isShow?: boolean;
  sort?: number;
  relationItems?: {
    itemId: number;
    sort: number;
  }[];
}

export interface IGoodsRecommendItem {
  id: number;
  itemId: number;
  isShow: boolean;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
  relationItems: {
    itemId: number;
    sort: number;
    name: string;
    image: string;
    price: string;
  }[];
}

export type GoodsRecommendListGetResultModel = BasicFetchResult<IGoodsRecommendItem>;

export interface IVideoChannelItem {
  id: number;
  start: Date; // 展示开始时间
  end: Date; // 展示结束时间
  reservationImage: string; // 预约图片
  liveImage: string; // 直播图片
  position: string[]; // 展示位置
  status: boolean; // 是否上架
  createdAt: Date; // 创建时间
  updatedAt: Date; // 修改时间
}

export interface IVideoChannelParams {
  start: Date; // 展示开始时间
  end: Date; // 展示结束时间
  reservationImage: string; // 预约图片
  liveImage: string; // 直播图片
  position: string[]; // 展示位置
  status: boolean; // 是否上架
}
