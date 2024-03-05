import { Dayjs } from 'dayjs';
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface BuyoutPrice {
  id?: number;
  name: string; // 活动名称
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  disable: boolean; // 上下架状态 true下架, false 上架Default: false
  priceAlias: string; // 价格名称 如活动价,折扣价
  allowCouponUse: boolean; // 是否允许使用卡券Default: false
  groupOption: {
    // 活动用户分群
    type: 'all' | 'include' | 'exclude'; // 分群类型 all 所有 include 包含 exclude 排除Allowed: all┃include┃exclude
    tagIds: number[]; // tags 来自API: 用户标签管理-用户标签列表
  };
  goods: {
    // 配置商品
    id?: number; // ID, 新增无需ID
    goodsId: number; // goodsId
    skuId: number; // skuId
    enableLimit: boolean; // 是否开启限购
    quantity: number; // 限购数量Constraints: Min 0
    price: string; // 价格
  }[];

  // 删除的商品项主键ID
  deleteSkuIds?: number[];
}

export type BuyoutPriceListGetResultModel = BasicFetchResult<BuyoutPrice>;
export type BuyoutPriceListParams = BasicPageParams;

export interface IPointmallItemsOptionData {
  items: {
    code?: string;
    skuId: number;
    price: string;
    point: number;
    stock: number; //库存
  }[];
  type: EPointmallTargetType;
}

export enum EPointmallTargetType {
  goods = 'goods',
  coupon = 'coupon',
}

export enum EPointmallType {
  point = 'point',
  pointAndPrice = 'pointAndPrice',
}

export interface IPointmallListParams extends BasicPageParams {
  name?: string;
  targetType?: EPointmallTargetType;
  targetIds?: string;
  promotionIds?: string;
}

export enum ETagOptionType {
  'all' = 'all',
  'include' = 'include',
  'exclude' = 'exclude',
}

export interface IPointmallParams {
  // promotionId: string; //活动名
  name: string; //活动名
  startTime: Date | null | Dayjs; //活动开始时间
  endTime: Date | null | Dayjs; //活动结束时间
  displayStartTime: Date | null; //活动开始展示时间
  limitCount: number | string; //限制兑换数
  isLimit: boolean; //是否开启限购
  targetId: string; //兑换物品Id 字符串
  targetType: EPointmallTargetType; //兑换的类型 goods 或 coupon
  oriPriceBy: boolean; //是否允许原价购买,默认false
  jumpToDetail: boolean; //当为实物商品时是否跳转销售业
  type: EPointmallType; //兑换类型积分 或者 积分+钱 默认point
  disable: boolean; //是否不可用 Default: true
  image: string; //图片
  optionData: IPointmallItemsOptionData | null; //兑换物品设置
  expireTime: number; //订单有效期分钟
  group: string | string[]; //分组
  sort: number; //排序
  tagOptionType: ETagOptionType;
  tagOptionData: number[];
}

export interface IPointmallItem extends IPointmallParams {
  strategy: {
    exclusive: boolean; //是否独占
    strategyName: string; //name
    mustHaveDeliveryAddress: boolean; //必须有地址
    checkSaleStatus: boolean; //检查上下架状态
    enableUseCoupon: boolean; //允许使用卡券
    enableUsePromotion: boolean; //允许使用活动
    enableUsePoint: boolean; //允许使用积分
    enableUseGiftCard: boolean; //允许使用礼品卡
    enableCustomExpireTime: boolean; //允许使用礼品卡
  };
}

export type IPointmallItemGetResultModel = BasicFetchResult<IPointmallItem>;

export interface IPointmallConfigItem {
  sort: number;
  name: string;
  id?: number;
  isDelete?: boolean;
}

export type IPointmallConfigParams = IPointmallConfigItem;
