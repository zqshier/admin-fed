import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface MissionsGroupsParams extends BasicPageParams {
  groupCode: string;
  groupRelatedIds: string[];
}

export enum MissionEnum {
  daily = 'daily',
  lifetime = 'lifetime',
}

export enum MissionCodeEnum {
  /** 每日签到 */
  signin = 'signin',
  /** 分享 */
  share = 'share',
  /** 保存日签 */
  saveimage = 'saveimage',
  /** 邀请新会员 */
  invitemember = 'invitemember',
  /** 关注公众号 */
  subwxoa = 'subwxoa',
  /** 完善个人信息 */
  userinfo = 'userinfo',
  /** 浏览指定页面 */
  pageview = 'pageview',
  /** 完成问答 */
  question = 'question',
  /** 商品评分 */
  goodsrate = 'goodsrate',
  /** 收藏商品 */
  goodsfav = 'goodsfav',
  /** 上传订单截图获得小火苗 */
  uploadorder = 'uploadorder',
  /** 添加企微好友 */
  wxwkcontact = 'wxwkcontact',
}

export enum RewardType {
  point = 'point',
  lotteryTicket = 'lotteryTicket',
}

export enum GroupCode {
  lottery = 'lottery',
  mission = 'mission',
}

export interface IMission {
  type: MissionEnum;
  code: MissionCodeEnum;
  name: string;
  image?: string;
  desc?: string;
  condition?: number;
  times?: number;
  timesTotal?: number;
  // points: number;
  action?: string;
  disabled: boolean;
  isClient?: boolean;
  position?: number;
  rewardType: RewardType;
  rewardId: string;
  rewardValue: string;
  startDate?: Date | null;
  endDate?: Date | null;
  meta: {
    inviteeRewardValue?: number;
  };
  link?: string;
  groupCode: string;
  groupRelatedId: number;
  groupName: string;
  jumpLink?: string;
}

export interface MissionsGroupsList {
  code: GroupCode;
  createdAt: Date;
  disabled: true;
  id: number;
  name: string;
  relatedId: number;
  updatedAt: Date;
}

export interface MissionsGroupsListItem {
  list: IMission[];
  groupCode: GroupCode;
  groupRelatedId: number;
  groupName: string;
}

export type MissionsGroupsListResultModel = BasicFetchResult<MissionsGroupsList>;
