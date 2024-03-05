import { GoodsDetailItemInfo, GoodsDetailParams } from './goodsModel';
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { TypeEnum } from '/@/views/components/AwardInput.vue';

export enum FriendPowerListItemRewardsTo {
  initiator = 'initiator',
  friend = 'friend',
}

export interface FriendPowerListItemRewards {
  type: TypeEnum;
  value: string;
  to: FriendPowerListItemRewardsTo | string;
  displayName: string;
}

export interface FriendPowerListItem {
  id: number; //主键ID
  name: string; //活动名
  image: string; //活动头图
  start: Date | null; //开始时间
  end: Date | null; //结束时间
  rewardImage: string; //奖品展示图
  expireTime: number; //活动发起后过期时间(小时)
  condition: number; //邀请n人完成任务
  times: number; //每人可发起n次
  friendIdentity: number; //被邀请人身份限制，0 无限制，1 仅新用户
  friendPowerPerDay: number; //被邀请人每天助力限制
  friendPowerTotal: number; //被邀请人总助力限制
  disabled: boolean; //是否下架
  createdAt?: Date; //创建时间
  updatedAt?: Date; //更新时间
  rewards: FriendPowerListItemRewards[]; //奖励配置
  friendRewardImage: string; //好友助力奖励图
  circleTotalCount: number; //奖励预设数量
  sendMustAddContact: boolean; //发送奖品必须添加微信
  orginDetails?: GoodsDetailParams; //活动详情原始值
  details: GoodsDetailItemInfo[]; //活动详情
  contactUrl: string; //企微联系人url
  initiatorAward?: { type: string; value: string }[];
  friendAward?: { type: string; value: string }[];
  shareTitle: string;
  shareImage: string;
  sharePosterImage: string;
  useInvitationCode: boolean; // 是否使用活动发起码
  invitationCode: number | string; // 活动发起码
}

export type FriendPowerListResultModel = BasicFetchResult<FriendPowerListItem>;

export interface FriendPowerListParams extends BasicPageParams {
  name?: string;
}

export interface FriendPowerUpdateData {
  name?: string; //活动名
  image?: string; //活动头图
  rewardImage?: string; //奖品展示图
  friendRewardImage?: string; //好友助力奖励图
  disabled?: boolean; //是否下架
  shareTitle?: string;
  shareImage?: string;
  sendMustAddContact?: boolean;
  contactUrl?: string;
  sharePosterImage?: string;
  details?: GoodsDetailItemInfo[];
  increaseCircleTotalCount?: number; //增长奖励预设数量
  useInvitationCode?: boolean; // 是否使用活动发起码
  invitationCode?: number | string; // 活动发起码
}

export enum EFriendPowerConfigCycleStatus {
  underway = 'underway',
  complete = 'complete',
  failed = 'failed',
}

export enum EFriendPowerConfigCycleRewardStatus {
  pending = 0,
  done = 1,
  failed = 2,
}

export interface IFriendPowerConfigCycleListParams extends BasicPageParams {
  initiatorUserId?: number; //发起人用户id
  friendUserId?: number; //助力人用户id
  rewardStatus?: number; //奖励发放状态
  circleStatus?: EFriendPowerConfigCycleStatus; //活动状态
  startAt?: Date; //开始时间
  endAt?: Date; //结束时间
  name?: string; //名称
}

export interface IFriendPowerConfigCycleListItem {
  id: number;
  configId: number;
  code: string;
  userId: number;
  expireTime: Date;
  power: number;
  completed: boolean;
  showRewards: boolean;
  createdAt: Date;
  updatedAt: Date;
  isReturnUsage: boolean;
  config: FriendPowerUpdateData;
}

export type IFriendPowerConfigCycleListResultModel =
  BasicFetchResult<IFriendPowerConfigCycleListItem>;
