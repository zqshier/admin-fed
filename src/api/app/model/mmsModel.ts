import { GoodsListItem } from './goodsModel';
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface CouponsListParams extends BasicPageParams {
  codes?: string;
}
export interface CouponsCondition {
  type: 'all' | 'include' | 'exclude'; //类型: all 所有商品, include 仅包含, exclude 排除
  catalogIds: number[]; //分类 IDs

  itemIds: number[]; //商品 IDs

  skuIds: number[]; //SKU IDs
}

/**
有效期限配置，支持两种配置
固定的有效期 { "__type": "exact", "start": "2022-01-01T00:00:00Z", "end": "2022-01-30T15:59:59Z" }
延时生效 { "__type": "delay", "after": 3, "days": 30 }
 */
export interface CouponsExpiration {
  __type: 'exact' | 'delay';
  start?: string;
  end?: string;
  after?: number | string;
  days?: number | string;
}

export interface CouponsListItem {
  id: number;
  code: string; //券编码，如果有第三方系统，需要对应
  name: string; // 券名
  type: string; //类型: 1 满减券

  value: number; //面值

  threshold: number; //使用门槛(总金额)

  condition: CouponsCondition; //适用条件
  stock: number; //库存数

  itemId: number; //跳转商品ID

  expiration: CouponsExpiration;

  rules: string; // 规则

  disabled?: boolean; // true 禁用, false 投放

  userCanGet?: boolean; //是否可领取
}

export type CouponsListGetResultModel = BasicFetchResult<CouponsListItem>;

export interface CouponsCenterCoupon {
  id?: number; //ID, 新增无需ID

  couponId?: number | string; //关联票券ID

  start: string; //展示开始时间

  end: string; //展示结束时间

  position?: number; //排序值

  couponConfig?: CouponsListItem;

  validateStatus?: '' | 'error';
}

export interface CouponsCenterListItem {
  id?: number;
  name: string;
  code: string;
  list: CouponsCenterCoupon[];
}

export type CouponsCenterListGetResultModel = BasicFetchResult<CouponsCenterListItem>;

export interface ITagsItem {
  id?: number;
  itemId: number;
  itemType: 'goods' | 'link';
  name: string;
  image: string;
  link: string;
}

export interface TopicsTagsItem {
  name: string; //标签名称
  items: ITagsItem[]; // 标签项目
}

export interface TopicsListItem {
  id?: number; //ID, 新增不填

  code?: string; // 新建必填，后续不能再修改

  name: string; // 专题名

  start?: string; // 展示开始时间

  end?: string; //展示结束时间

  updatedAt?: string; //修改时间

  tags: TopicsTagsItem[]; //标签组
}

export type TopicsListGetResultModel = BasicFetchResult<TopicsListItem>;

export interface TopicsGroupsListItem {
  id?: number; //ID

  code: string; //编号

  name: string; //名称

  topicIds: number[]; //专题IDs

  topics?: TopicsListItem[]; //专题基础信息
  start: string; //展示开始时间

  end: string; //展示结束时间
}

export type TopicsGroupsListGetResultModel = BasicFetchResult<TopicsGroupsListItem>;

export enum envVersion {
  RELEASE = 'release',
  TRIAL = 'trial',
  DEVELOP = 'develop',
}
export interface LinksItem {
  path: string;
  query?: string;
  platformId?: string;
  envVersion?: envVersion;
}

export interface NewcomerGiftsItem {
  id?: number; //主键ID
  name: string; //活动名
  type: 'coupon' | 'point'; //类型
  value: string; //奖励值
  start: string; //开始时间
  end: string; //结束时间
  state: 'enabled' | 'disabled'; //状态
  createdAt?: string; //创建时间
  updatedAt?: string; //更新时间
  appId?: string;
}

export type NewcomerGiftsGetResultModel = BasicFetchResult<NewcomerGiftsItem>;

export interface NewcomerGiftsListParams extends BasicPageParams {
  name?: string;
  available?: string;
}

export interface NewcomerGiftsSendRecordParams extends BasicPageParams {
  id: number;
}

export interface CouponRecordItem {
  id?: number;
}

export type CouponsRecordsListGetResultModel = BasicFetchResult<CouponRecordItem>;

export interface CouponsRecordsListParams extends BasicPageParams {
  userId?: number;
  code?: string; //指定票券编码
  status?: number; //筛选票券状态: 1 未使用, 2 已使用, 3 已过期
  couponIds?: number[];
}

export interface DrawLotsParamsTargetData {
  //目标奖励数据
  goodsId: number;
  skuId: number;
}

export enum DrawLotsParamsTarget {
  skuId = 'skuId',
}

interface DrawLotsItemsGoods extends GoodsListItem {
  quantity: string | number;
  skuId: number;
  goodsId: number;
}
export interface DrawLotsItems {
  id?: number;
  name: string; //活动名
  drawCount: number; //抽签数量
  startAt: Date | string; //参与抽签时间
  endAt: Date | string; //参与抽签截止时间
  finishAt: Date | string; //结果公布时间
  bookingTemplateId: string; //预约模板Id
  bookingTemplateData: string[]; //预约模板内容
  pickOnTemplateId: string; //中签通知模版Id
  pickOnTemplateData: string[]; //中签通知模版配置数据
  waitingPaymentTemplateId: string; //等待支付模板Id
  waitingPaymentTemplateData: string[]; //等待支付通知模版配置数据
  targetData: DrawLotsParamsTargetData;
  target: DrawLotsParamsTarget;
  goods?: DrawLotsItemsGoods[]; // 商品信息
  bookingBase: number;
  participantBase: number;
}

export enum DrawLotsParamsStatus {
  inactive = 'inactive',
  active = 'active',
}

export interface DrawLotsParams extends BasicPageParams {
  status: DrawLotsParamsStatus;
}

export type DrawLotsGetResultModel = BasicFetchResult<DrawLotsItems>;

export interface DrawLotsCodeParams extends BasicPageParams {
  id?: number;
  userId: number;
  isPickOn: number;
  crStartAt: Date;
  crEndAt: Date;
}

export interface DrawLotsCodeItems {
  drawLotsId: number; //抽签活动Id
  code: string; //签码
  userId: number; //用户id
  isPickOn: boolean; //是否中签
  createdAt: Date; //获取签码时间
}

export type DrawLotsCodeGetResultModel = BasicFetchResult<DrawLotsCodeItems>;

export type IDailySigninItem = {
  dailyPoints: number;
  rules: string[];
  continuousRewards: {
    days: number;
    points: number;
  }[];
};

export enum ECnyStoreStatus {
  pending = 'pending',
  approved = 'approved',
  disapproved = 'disapproved',
}
export interface ICnyStoreListParams extends BasicPageParams {
  userId: number;
  status: ECnyStoreStatus;
  address: string;
  area: string;
  submitOver24Hours: boolean;
}

export interface ICnyStoreItem {
  userId: number; //用户ID
  name: string; //店铺名称
  image: string; //店铺图片
  certImage: string; //店铺证件图
  area: string; //销售区域
  province: string; //店铺所在省
  city: string; //店铺所在市
  district: string; //店铺所在区
  address: string; //店铺地址
  userName: string; //用户姓名
  userJob: string; //用户身份
  status: ECnyStoreStatus; //审核状态
  disapproveReason: string; //拒绝原因
  counter: {
    // 店铺数据计数
    userId: number; //用户ID
    totalCodes: number; //扫码总个数
    totalAmount: string; //扫码总金额
    monthCodes: number; //本月扫码总个数
    monthAmount: string; //本月扫码总金额
  };
}

export type ICnyStoreListGetResultModel = BasicFetchResult<ICnyStoreItem>;

export enum ECnyStoreRetryStatus {
  pending = 'pending',
  ok = 'ok',
  fail = 'fail',
}
export interface ICnyStoresRetryItem {
  userId: number; //用户ID
  storeId: number; //关联店铺记录ID
  code: string; //唯一码
  status: ECnyStoreRetryStatus; //处理状态
  money: string; //奖励金额，单位: 元
  openId: string; //扫码人OpenId
  platformId: string; //微信AppId
  ip: string; //扫码IP
}

export interface ICnyStoreRecordsItem {
  id: number;
  userId: number;
  storeId: number;
  code: string;
  status: ECnyStoreRetryStatus;
  money: string;
  openId: string;
  platformId: string;
  ip: string;
  createdAt: Date;
  updatedAt: Date;
  store: ICnyStoreItem;
}

export type ICnyStoreRecordsListGetResultModel = BasicFetchResult<ICnyStoreRecordsItem>;
