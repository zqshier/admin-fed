import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export enum EActiviyState {
  notStarted,
  processing,
  finished,
}

export interface IActiviyParams {
  title: string; //活动名称
  start?: Date;
  end?: Date;
  mainImage?: string[];
  image: string;
  detailImage: string[];
  shareImage: string;
}

export interface IActiviyListParams extends BasicPageParams {
  title: string; //活动名称
  state: EActiviyState; //活动状态
}

export interface IActiviyListItem {
  id?: number;
  title: string;
  start: Date | null;
  end: Date | null;
  image: string;
  mainImage: string[];
  detailImage: string[];
  shareImage: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  state: number;
  sign_up_num: number;
}

export type IActiviyListResultModel = BasicFetchResult<IActiviyListItem>;

export interface IActiviyReocrdListParams extends BasicPageParams {
  title: string; //活动名称
  activityId: number;
  startTime: Date;
  endTime: Date;
  userId: number;
}

export interface IActiviyReocrdListItem {
  id: number;
  activityId: number;
  userId: number;
  name: string;
  gender: number;
  province: string;
  city: string;
  district: string;
  address: string;
  createdAt: Date;
  activity: IActiviyListItem;
  phone: string;
}

export type IActiviyReocrdListResultModel = BasicFetchResult<IActiviyReocrdListItem>;
