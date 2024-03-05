import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export enum IBatchesType {
  normal = 'normal',
  adt = 'adt',
}

/** 批次任务状态 */
export enum EBatchStep {
  /** 待处理 */
  pending = 'pending',

  /** 处理中 */
  processing = 'processing',

  /** 已完成 */
  completed = 'completed',

  /** 待出库 */
  waitPublish = 'wait_publish',
}

/** 子任务步骤 */
export enum ETaskStep {
  /** 待处理 */
  pending = 'pending',

  /** 生成编码记录 */
  genCode = 'gen_code',

  /** 等待生成二维码 */
  waitGenImg = 'wait_gen_img',

  /** 等待打包 */
  waitZip = 'wait_zip',

  /** 等待出库 */
  waitPublish = 'wait_publish',

  /** 已完成 */
  completed = 'completed',
}

// export enum EBatchStep {
//   /** 待处理 */
//   pending = 'pending',
//   /** 生成编码记录 */
//   genCode = 'gen_code',
//   /** 等待生成二维码 */
//   waitGenImg = 'wait_gen_img',
//   /** 等待打包 */
//   waitZip = 'wait_zip',
//   /** 已完成 */
//   completed = 'completed',
// }

export enum IStagingStatus {
  /** 待处理 */
  pending = 'pending',
  /** 已提交 */
  commited = 'commited',
  /** 已删除 */
  deleted = 'deleted',
}

export interface IBatchesParams {
  memo: string; // 备注
  type: IBatchesType; // 码类型
  distributors: { code: string; num: number }[];
}

export interface IBatchesListParams extends BasicPageParams {
  step: string;
  memo: string; // 备注
  createdAtStart: Date; // 创建时间开始
  createdAtEnd: Date; // 创建时间结束
}

export interface IBatchesListItem {
  codeNum: number;
  createdAt: Date | null;
  creator: string;
  creatorId: number;
  distributorNum: number;
  finishTime: Date | null;
  id: number;
  memo: string;
  progress: number;
  sn: string;
  startTime: Date | null;
  step: EBatchStep;
  type: IBatchesType;
}

export type IBatchesListItemResultModel = BasicFetchResult<IBatchesListItem>;

export interface IBatchesDetailParams {
  distributorName?: string;
  step?: EBatchStep;
}

export enum ETaskType {
  lighter = 1,
  outdoorGoods = 2,
  oil = 3,
}

export interface IBatchesDetailTasks {
  id: number;
  batchId: number;
  type: ETaskType;
  sn: string;
  start: string; // 起始编码
  end: string; // 结束编码
  codeNum: number;
  progress: number;
  step: ETaskStep;
  distributorCode: string;
  createdAt: Date | null;
  distributor: IDistributorsListItem;
  qrcodeType?: IBatchesType;
}

export interface IBatchesDetailItem extends IBatchesListItem {
  tasks: IBatchesDetailTasks[];
}

export interface IDcodesQueryItem {
  batchId: number;
  createdAt: Date | null;
  distributorCode: string;
  id: number;
  product: IProductsListItem;
  productCode: string;
  productBoundAt?: Date;
  sn: string;
  status: number;
  taskId: number;
  distributor: IDistributorsListItem;
  batch: IBatchesListItem;
  wxacode?: string;
}

export interface IDistributorsListParams extends BasicPageParams {
  id?: number;
  name?: string; // 经销商名称
  code?: string; // 经销商编码
}

export interface IDistributorsListItem extends IDistributorsParams {
  createdAt: Date;
  id: number;
  updatedAt: Date;
}

export type IDistributorsListResultModel = BasicFetchResult<IDistributorsListItem>;

export interface IDistributorsParams {
  code: string; // 经销商编码;
  name: string; // 经销商名称;
  province: string; // 经销商省份;
  city: string; // 经销商城市;
  phoneNumber: string; // 经销商电话;
}

export interface IProductsParams {
  id?: number;
  code: string; // 产品编码
  barcode: string; // 产品条码
  name: string; // 产品名称
  status: string; // 产品状态
  price: string; // 产品价格
  name_e: string; // 产品英文名称
  type1: string; // 产品类别
  type2: string; // 产品层级1
  type3: string; // 产品层级2
  type4: string; // 产品层级3
  photos: string; // 从DRP同步来的照片
  qrPhoto: string; // 扫码验真页面显示的照片
  source: string; // 产品来源
  subtype: string; // 产品子类型
  baseModel: string; // 基座型号
  applyType: string; // 申请类型
  surface: string; // 表面工艺
  decoration: string; // 装饰工艺
  lifeCycle: string; // 产品生命周期状态
  place: string; // 产地
  launchYear: string; // 上市年度
  launchMonth: string; // 上市月度
  channel: string; // 渠道
  isBaseModel: string; // 是否基础款
  onSale: string; // 是否在售
  launchDate: string; // 上市日期
}

export interface IProductsListParams extends BasicPageParams {
  code?: string;
  barcode?: string;
  name?: string;
}

export interface IProductsListItem extends IProductsParams {
  createdAt: Date;
  updatedAt: Date;
}

export type IProductsListResultModel = BasicFetchResult<IProductsListItem>;

export interface IRecordsListParams extends BasicPageParams {
  sn: string; // 明码
  sort: string; // 排序
  scanDateStart: Date; // 扫码时间区间开始
  scanDateEnd; // 扫码时间区间结束
  userId: number;
  distributorName: string; // 经销商名称
  productName: string; // 产品名称
}

export interface IRecordsItem {
  birthday: Date | null;
  buyPurpose: string;
  cipher: string;
  code: string;
  createdAt: Date | null;
  distributor: string;
  distributorCode: string;
  gender: number;
  id: number;
  ip: string;
  openId: string;
  phone: string;
  product: null;
  productCode: string;
  sn: string;
  updatedAt: Date | string;
  userId: number;
}

export type IRecordsListResultModel = BasicFetchResult<IRecordsItem>;

export interface IStagingParams {
  sn: string; // 明码
  productCode: string; // 产品编码;
}

export interface IStagingItem {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  creator: string; // 管理员
  creatorId: number; // 管理员id
  distributor: IDistributorsListItem;
  distributorCode: string;
  product: IProductsListItem;
  productCode: string;
  sn: string;
  committedAt: Date;
}

export interface IStagingListParams {
  start: Date;
  end: Date;
  status: IStagingStatus;
}

export type IStagingListResultModel = BasicFetchResult<IStagingItem>;

export interface ICodesListParams extends BasicPageParams {
  sn: string; // 明码
  productBound: string; // 是否绑定产品
  productBoundAtStart: Date; // 绑定产品时间起始
  productBoundAtEnd: Date; // 绑定产品时间结束
  createdAtStart: Date; // 生成时间起始
  createdAtEnd: Date; // 生成时间结束
}

export interface ICodesListItem {
  sn: string; // 明码
  cipher: string; // 暗码
  status: number; // 状态
  taskId: number; // 任务ID
  batchId: number; // 批次ID
  batch: IBatchesListItem;
  distributorCode: string; // 经销商编码
  distributor: IDistributorsListItem;
  productCode: string; // 产品编码
  productBoundAt: Date; // 绑定产品日期时间
  createdAt: Date; // 创建时间
}

export type ICodesListResultModel = BasicFetchResult<ICodesListItem>;

export interface IBindDailyListParams extends BasicPageParams {
  start: Date; // 起始时间
  end: Date; // 结束时间
}

export interface IBindDailyListItem {
  id: number;
  date: Date;
  codes: number;
  committed: number;
  createdAt: Date;
  products: number;
  updatedAt: Date;
}

export type IBindDailyListResultModel = BasicFetchResult<IBindDailyListItem>;
