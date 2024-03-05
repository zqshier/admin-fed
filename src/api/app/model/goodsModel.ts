import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type CatalogParams = BasicPageParams;

export interface GoodsParams extends BasicPageParams {
  ids?: number[];
  types?: string;
}

export interface GoodsListItem {
  id: number; //商品ID

  name: string; //商品名称

  image: string; //商品图

  price: number; //商品价格

  saleMode: number; //销售模式, 1 现货 | 2 预售 ⤵

  saleStatus: number; //上下架状态, 1 上架 | 2 上架 ⤵

  stock: number; //库存
  code?: string;
}

/**
 * @description: Request list return value
 */
export type GoodsListGetResultModel = BasicFetchResult<GoodsListItem>;

export interface CatalogsListItem {
  id?: number; //类目ID

  code: string; //类目编码

  name: string; //类目名称

  style: string; //类目前端展示样式

  image: string; //类目图片

  children?: [CatalogsListItem]; //类目子项

  sys?: number; // 是否系统分组，系统分组不能被编辑

  feature?: string; //系统分组功能标识

  hidden?: boolean; //是否隐藏

  num?: number; //商品数量
}

export type CatalogsListGetResultModel = BasicFetchResult<CatalogsListItem>;

export interface SkuItem {
  id: number;
  name: string;
  values: SkuValueItem[];
}

export interface SkuValueItem {
  id: number;
  name: string;
}

export interface SaleModeConfig {
  payment: number; //0 全款, 1 比例, 3 定金 ⤵

  value: number; //按比例或者按定金支付的值, 比例: 1-99, 定金: 不超过商品价格

  prepayTimeEnd: Date; //预付结束时间

  finalPayTimeStart: Date; //尾款开始时间

  finalPayTimeEnd: Date; //尾款结束时间

  deliveryType: number; //发货时间类型, 0 固定时间 | 1 尾款X天后 ⤵

  deliveryValue: number; //发货时间, 时间戳(秒)或天数
}

export interface MediaInfo {
  id: number; // 新增资源无id

  url: string; //资源地址

  thumb: string; //缩略图
}

export interface CombItem {
  k: Nullable<string>;
  kId: Nullable<number>;
  v: Nullable<string>;
  vId: Nullable<number>;
}

export interface SkuDetail {
  id?: Nullable<number>;
  extra_0: string;
  extra_1: string;
  extra_2: string;
  price: Nullable<number>;
  cost: Nullable<number>;
  stock: Nullable<number>;
  weight: Nullable<number>;
  guidePrice: Nullable<number>;
  sn: string;
  barcode: string;
  image: string;
  comb: CombItem[];
}

export interface GoodsInfo {
  type: number; // 商品类型, 0 实物, 1 优惠券 ⤵

  name: string; //商品名称

  guidePrice: number; //划线价 ⤵

  sn: string; //商品编码 ⤵

  barcode: string; //商品条码 ⤵

  skuConfigs: SkuItem[]; //规格配置

  keywords: string; // 商品关键词, 半角 , 分隔 ⤵

  saleMode: number; // 1 现货模式, 2 预售模式, 仅商品类型为实物商品时可配置 ⤵

  saleModeConfig: SaleModeConfig; // 销售模式配置，针对预售

  saleStatus: number; //上下架状态, 1 上架, 2 下架 ⤵

  onSaleAt: Date; //开售时间, 默认为立即开售

  saleTime: {
    //上下架时间配置
    saleTime: Date; //上架时间
    closeTime: Date; //下架时间
  };
  paymentExpiration: number; //订单支付有效时间，分钟，可调整为1-1440之间的整数 ⤵

  deliveryTemplateId: number; //快递模板ID

  images: MediaInfo[]; //商品图片

  video: MediaInfo; //商品视频

  shareImage: MediaInfo; //商品分享图

  skus: SkuDetail[]; //商品SKU, 无SKU配置时, 也需要传一份默认的SKU默认, comb: [{ k: "", kId: 0, v: "", vId: 0 }]

  catalogIds: number[]; //商品所属分组
}

export type GoodsDetailItemType = 'image' | 'video' | 'text';

export interface GoodsDetailItemInfo {
  id: Nullable<number>;
  type: GoodsDetailItemType;
  content: string;
  meta?: any;
}

export interface GoodsDetailParams {
  rows: GoodsDetailItemInfo[];
  deleteIds: number[];
}

export interface SkuListItemGoods {
  id: number; // 商品ID

  name: string; //商品名

  sn: string; //商品编码

  barcode: string; //商品条码
}

export interface SkuListItem {
  id: number; //SKU ID

  price: number; //价格

  guidePrice: number; //划线价

  cost: number; //成本价

  stock: number; //可销售库存数

  weight: number; //重量, 千克

  sn: string; //规格编码

  barcode: string; //规格条码

  comb: CombItem[]; //规格组合

  image: string; // 规格图片

  item: SkuListItemGoods; //商品信息

  itemId?: number;

  name?: string; //规格名称
  meta?: { couponCode?: string; giftCardId?: number }; //附加属性
}

export type SkuListGetResultModel = BasicFetchResult<SkuListItem>;

export interface SkuListParams extends BasicPageParams {
  sn?: string; //SKU 编码
  skuId?: number; //SKU ID
  skuIds?: number[];
  itemId?: number; //商品 ID
  itemSn?: string; //商品编码
  itemName?: string; //商品名
  priceStart?: number; //销售区间开始
  priceEnd?: number; //销售区间结束
  guidePriceStart?: number; //划线价区间开始
  guidePriceEnd?: number; //划线价区间结束
  itemTypes?: string; //商品类型
}

export interface SkuUpdateParams {
  price?: number; //价格

  guidePrice?: number; // 划线价

  cost?: number; // 成本价

  weight?: number; // 重量, 千克

  sn?: string; // 规格编码

  barcode?: string; // 规格条码

  image?: string; // 规格图片
}

export interface GoodsStatusBatchParams {
  itemIds: number[];
  saleStatus: number;
}

export interface GoodsCatalogBatchParams {
  itemIds: number[];
  catalogIds: number[];
}

export interface PropertiesListParams extends BasicPageParams {
  name: string; // 参数名称查询
  catalogIds?: string; // 指定分组ID查询 number[]
}

interface PropertiesListCatalogs {
  id: number;
  code: string;
  name: string;
  pathNames: string[];
}

export interface PropertiesListItem {
  id: number; //主键ID
  name: string; //参数名
  values: string[]; //参数枚举值
  display: boolean; //是否展示到前端
  createdAt: Date; //创建时间
  updatedAt: Date; //更新时间
  catalogRelation: string[]; //多个分类关系
  catalogs: PropertiesListCatalogs[]; //关联分类
}

export type PropertiesListItemGetResultModel = BasicFetchResult<PropertiesListItem>;

export interface PropertiesParams {
  name: string; //参数名
  values: string[]; //参数枚举值
  display: boolean; //是否展示到前端
  catalogIds: number[]; //关联分类IDs
}

export interface RatingListParams extends BasicPageParams {
  title: string; // 评分名称
}

export type RatingListItemGetResultModel = BasicFetchResult<RatingListParams>;

export interface RatingParams {
  title?: string; //评分名称
  disable?: boolean; //是否下架
  tags?: string[]; //评分标签
  itemIds?: number[]; //关联商品IDs
}

export interface RelevanceItemParams extends BasicPageParams {
  itemIds: number[] | string[];
  configId: number;
}

export interface RelevanceItem {
  id: number;
  appId: string;
  configId: number;
  itemId: number;
  createdAt: Date;
}

export type RelevanceItemParamsGetResultModel = BasicFetchResult<RelevanceItem>;

export interface RatingRecordParams extends BasicPageParams {
  title: string; // 评分名称
  itemName: string; // 商品名称
  userId: string; // 用户id
  startTime: Date;
  endTime: Date;
}

export interface RatingRecordItem {
  id: number;
  appId: string;
  configId: number;
  itemId: number;
  skuId: number;
  userId: number;
  star: number;
  chooseTags: string[];
  createdAt: Date;
  updatedAt: Date;
  title: string;
  itemName: string;
  skuComb: [
    {
      k: string;
      kId: number;
      v: string;
      vId: number;
    },
  ];
}

export type RatingRecordListItemGetResultModel = BasicFetchResult<RatingRecordItem>;

export interface FavoritesListParams extends BasicPageParams {
  userId: string; // 用户id
  targetType: 'goods' | 'sku';
  favoriteStart: Date; // 收藏起始时间
  favoriteEnd: Date; // 收藏结束时间
  favorited: boolean; // 收藏状态
  name: string; // 商品名称
  sn: string; // 商品编码
}
export interface FavoritesItem {
  id: number;
  appId: string;
  userId: number;
  targetType: string;
  targetId: string;
  favorited: boolean;
  createdAt: Date;
  updatedAt: Date;
  target: SkuListItem;
}

export type FavoritesItemGetResultModel = BasicFetchResult<FavoritesItem>;

export enum EGoodsType {
  goods = 0,
  giftCard = 1,
  coupon = 2,
}

export interface IKindsListParams extends BasicPageParams {
  ids?: string;
  name?: string;
}

export interface IKindsParams {
  name: string;
  code: string;
}

export interface IKindsListItem {
  id: number;
  name: string;
  code: string;
  itemsTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IKindsItemGetResultModel = BasicFetchResult<IKindsListItem>;
