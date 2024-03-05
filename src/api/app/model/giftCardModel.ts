import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface GiftCardListParams extends BasicPageParams {
  name?: string; // 礼品卡名称
  ids?: number;
}

interface GiftCardListItemCounter {
  // 计数
  id: number; // 主键ID
  appId: string; // appId
  cardConfigId: number; // 卡配置ID
  totalCount: number; // 卡号库存
  salesCount: number; // 实际销量
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

export interface GiftCardListItem {
  id: number; // 主键ID
  appId: string; // appId
  name: string; // 卡名
  value: string; // 面值
  expireBeforeBound: number; // 激活后多少天内可绑定
  expireAfterBound: number; // 绑定后多少天内可使用
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  counter: GiftCardListItemCounter;
}

export type GiftCardListResultModel = BasicFetchResult<GiftCardListItem>;

export interface GiftCardCreateParams {
  name: string; // 卡名
  value?: string; // 面值
  expireBeforeBound?: number; // 激活后多少天内可绑定
  expireAfterBound: number; // 绑定后多少天内可使用
}

/**
 * normal  正常
 * frozen 已冻结
 * refunded 已退款
 * closure 已注销
 * bound 已绑定
 * used 已用完
 * unactivated 未激活
 * activated 已激活
 * expired 已过期
 * invalid 已失效
 */
export enum GiftCardStates {
  normal = 'normal',
  frozen = 'frozen',
  refunded = 'refunded',
  closure = 'closure',
  bound = 'bound',
  used = 'used',
  unactivated = 'unactivated',
  activated = 'activated',
  expired = 'expired',
  invalid = 'invalid',
}

export interface GiftCardDetailParams {
  cardNos?: string; // 卡号 支持多个卡号
  states?: GiftCardStates; // 卡状态
  actived?: boolean; // 是否已激活
}

export interface GiftCardDetailItem {
  id: number;
  appId: string;
  batchNo: string; // 批次号
  cardConfigId: number; // 卡配置ID
  cardNo: string; // 卡号
  cardPwd: string; // 卡密
  state: GiftCardStates;
  value: string;
  balance: string;
  actived: false;
  activedAt: Date;
  userId: number;
  bindUserId: number;
  boundAt: Date;
  bindExpired: Date;
  useExpired: Date;
  channel: string;
  createdAt: Date;
  updatedAt: Date;
  ext: {
    // 附加标信息
    id: number;
    appId: string;
    cardId: number;
    identityNo: string;
    phone: string;
    name: string;
    bankCardNo: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
  };
  config: {
    // 卡配置
    id: number;
    appId: string;
    name: string;
    value: string;
    expireBeforeBound: 1;
    expireAfterBound: 1;
    createdAt: Date;
    updatedAt: Date;
    counter: GiftCardListItemCounter;
  };
}

export type GiftCardDetailResultModel = BasicFetchResult<GiftCardDetailItem>;

export type GiftCardsBatchListParams = BasicPageParams;

export interface GiftCardsListItem {
  id: number;
  appId: string;
  cardConfigId: number;
  batchNo: string;
  count: number;
  operatorId: number;
  createdAt: Date;
}

export type GiftCardsBatchListResultModel = BasicFetchResult<GiftCardsListItem>;

export enum GiftCardsBatchUpdateType {
  activate = 'activate',
  freeze = 'freeze',
  unfreeze = 'unfreeze',
  close = 'close',
}

export interface GiftCardsBatchUpdateCards {
  identityNo?: string; // 身份证
  phone?: string; // 电话号码
  name?: string; // 公司名称|姓名
  bankCardNo?: string; // 付款账号
  address?: string; // 地址
  cardNo: string; // 卡号, 支持多个卡号
  actived?: boolean; // 激活卡
  channel?: string; // 渠道
}

export interface GiftCardsBatchUpdateParams {
  cards: GiftCardsBatchUpdateCards[];
}

export interface GiftCardsBatchUpdateResultModel {
  successCount: number; // 更新成功的数量
  failCount: number; // 更新失败的数量
}

export interface GiftCardQueryListParams extends BasicPageParams {
  cardNos?: string;
  states?: GiftCardStates;
  boundAtStart?: Date;
  boundAtEnd?: Date;
  channel?: string;
  bindUserId?: string;
  userId?: string;
}

export type GiftCardBindListResultModel = BasicFetchResult<GiftCardListItem>;

export enum GiftCardConsumeType {
  consume = 'consume',
  refund = 'refund',
}

export enum GiftCardConsumeState {
  preAuthorization = 'pre-authorization',
  confirm = 'confirm',
  cancel = 'cancel',
}

export interface GiftCardConsumeListItem {
  id: number;
  appId: string;
  userId: number;
  tradeNo: string;
  cardNo: string;
  amount: string;
  balance: string;
  createdAt: Date;
  channel: string;
  source: string;
  transaction: {
    id: number;
    appId: string;
    userId: number;
    type: GiftCardConsumeType;
    state: GiftCardConsumeState;
    tradeNo: string;
    sn: string;
    amount: string;
    memo: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface GiftCardConsumeListParams extends BasicPageParams {
  cardNos?: string;
  sn?: string;
  startAt?: Date;
  endAt?: Date;
  userId?: string;
}

export type GiftCardConsumeListResultModel = BasicFetchResult<GiftCardListItem>;

export interface GiftCardOptParams {
  type: GiftCardsBatchUpdateType;
  cardNo: string;
  cardConfigId?: number;
}
