import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: Request list interface parameters
 */
export type StoresListParams = BasicPageParams;

export enum EMedalsConfigsGroup {
  /** 商品品类下单 */
  goodskindorder = 'goodskindorder',
  /** 商品评分 */
  goodsrate = 'goodsrate',
  /** 收藏商品 */
  goodsfavorite = 'goodsfavorite',
  /** 商品分享 */
  goodsshare = 'goodsshare',
  /** 连续签到 */
  signin = 'signin',
  /** 扫码验真 */
  scancode = 'scancode',
  /** 积分兑换 */
  pointorder = 'pointorder',
  /** 好友邀请 */
  invitemember = 'invitemember',
  /** 活动参与 */
  joinactivity = 'joinactivity',
  /** 调查问卷 */
  questionanswer = 'questionanswer',
  /** 年度挚友 */
  annualmember = 'annualmember',
}

export interface IMedalsConfigsMedals {
  id?: number;
  name: string;
  description: string;
  greetings: string;
  image1: string;
  image2: string;
  condition: {
    __type: EMedalsConfigsGroup;
    count: number;
    year?: string; //年份
    level?: string;
    kindId?: number;
  };
  value?: number;
  subgroup?: string;
  link?: string;
  grantTips?: string;
}

export interface IMedalsConfigsParams {
  /**  勋章主题名 */
  topic: string;
  /**  勋章分组 */
  group: EMedalsConfigsGroup | null;
  medals: IMedalsConfigsMedals[];
  /** 跳转链接 */
  link: string;
  /** 未完成按钮展示文案 */
  grantTips: string;
}

export interface IMedalsConfigsList {
  /**  勋章主题名 */
  topic: string;
  /**  勋章主题标识 */
  group: EMedalsConfigsGroup;
  /**  勋章数量 */
  total: number;
  /**  是否下架 */
  disabled: boolean;
  /**  排序值 */
  sort: number;
}

export type IMedalsConfigsListGetResultModel = BasicFetchResult<IMedalsConfigsList>;

export interface IMedalsGroupParams {
  group: EMedalsConfigsGroup;
  subgroup: string;
  disabled?: boolean;
  sort?: number;
}

export interface IMedalsRecordsParams {
  userId: number;
}

export type IMedalsRecordsListGetResultModel = BasicFetchResult<IMedalsRecordsParams>;

export enum EMedalsSettingsFedorder {
  /** 按照后台勋章排序展示 */
  sort = 'sort',
  /** 按照点亮、勋章名称排序 */
  create = 'create',
}

export interface IMedalsSettingsParams {
  fedorder?: EMedalsSettingsFedorder;
  rulesimages?: string[];
}
