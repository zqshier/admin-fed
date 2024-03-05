import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AwardsListParams = BasicPageParams;

export interface AwardsListItem {
  id: number; // 奖品ID
  name: string; // 奖品名
  type: string; // 奖品类型
  value: string; // 奖品值
  image: string; // 奖品图
  createdAt: string; // 奖品创建时间
  updatedAt: string; // 奖品更新时间
  stock: number; // 库存
  sent: number; // 发放数
}

export type AwardsListGetResultModel = BasicFetchResult<AwardsListItem>;

export interface AwardsCreateModel {
  name: string; // 奖品名称
  type: string; // 奖品类型
  value: string; // 奖品值 红包: 金额, 优惠券: 券码
  image: string; // 奖品图片
  stock: number; // 库存
}

export interface AwardsUpdateModel {
  name: string; // 奖品名称
  value: string; // 奖品值，红包: 金额, 优惠券: 券码
  image: string; // 奖品图片
  adjustments: number; // 库存调整，正负10万以内
}

export type LotteriesListParams = BasicPageParams;

export interface LotteriesListItem {
  id: number; // 主键ID
  code: string; // 奖池唯一编码
  name: string; // 奖池名称
  image: string; // 奖池图片
  start: string; // 开始时间
  end: string; // 结束时间
  disabled: boolean; // 是否下架
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

export type LotteriesListGetResultModel = BasicFetchResult<LotteriesListItem>;

export interface LotteriesAwardsModel extends AwardsListItem {
  id: number; // 主键ID
  awardId: number; // 奖品id
  probability: number; // 奖品概率
  position: number; // 奖品排序值
  disabled: boolean; // true 风控, false 无需风控
  award?: AwardsListItem; // 奖品信息
  hitLimitPerUser?: number;
}

export interface LotteriesModel {
  code?: string; // 奖池唯一编码
  name: string; // 奖池名称
  image: string; // 奖池图片
  start: string; // 上架时间
  end: string; // 下架时间
  awards: LotteriesAwardsModel[]; // 奖池奖品
  disabled: boolean; // 是否下架
  deleteAwardIds?: number[]; // 删除的奖品ID
  cardImages?: string[];
  limitPerDay: number;
  limitTotal: number;
  shareTitle: string;
  shareImage: string;
  serviceImage?: string;
}

export interface LotteriesRecordListParams extends BasicPageParams {
  lotteryCode: string; // 奖池唯一编码
}

export interface AddressListItem {
  id: number; // 主键ID
  name: string; // 收货人
  phone: string; // 手机
  address: string; // 地址
  province: string; // 省
  city: string; // 市
  district: string; // 区
  appId: string; // 小程序ID
  userId: number; // 用户ID
  recordId: number; // 抽奖记录ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

export interface LotteriesRecordListItem {
  id: number; // 主键ID
  userId: number; // 用户ID
  lotteryId: number; // 奖池ID
  awardId: number; // 奖品ID
  state: string; // 发奖状态
  createdAt: string; // 中奖时间
  award: AwardsListItem; // 奖品信息
  address: AddressListItem; // 收货信息
}

export type LotteriesRecordListGetResultModel = BasicFetchResult<LotteriesRecordListItem>;
