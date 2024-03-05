import { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel';

export interface AppUserListParams extends BasicPageParams {
  nickname?: string; //用户昵称
  phone?: string; //手机号
  registerStart?: string; //注册起始时间
  registerEnd?: string; //注册结束时间
  userIds?: string; //用户ID, 逗号分隔
  userId?: string; //受邀人
  fromUserId?: number; //邀请人ID
  fromChannel?: string; //来源渠道 lottery:{id}
}

export enum IAppUserModelStatus {
  normal = 0,
  blacklist = 1,
  logout = 2,
}

export interface AppUserModel {
  status: IAppUserModelStatus; //用户状态, 0 正常|1 黑名单|2 注销 ⤵

  id: number; //用户ID
  sid: string; // 用户SID，用于小程序端展示，不暴露真实ID

  nickname: string; // 用户昵称

  avatar: string; //用户头像

  gender: number; //用户性别, 0 女|1 男|2 未知 ⤵

  createdAt: string; //用户创建时间

  name: string; //用户姓名

  birthday: string; //用户生日

  phone: string | null; //手机号

  points: number; //用户积分

  unionId: string; //小程序unionId

  orderNum: number; //消费次数

  orderAmount: number; //消费金额

  subscribed: boolean; //是否关注公众号
  subscribedAt: Date; //关注公众号时间

  remark?: string; //备注

  /** 用户交易数据 */
  data?: {
    lastOrderTime: Date | null;
    totalPaidAmount: number;
    totalPaidCount: number;
    totalRefundAmount: number;
    totalRefundCount: number;
  };
}

export type AppUserListModel = BasicFetchResult<AppUserModel>;

export interface UserTagModel {
  id?: number; //ID
  name: string; //名称
}

export interface UserTagListParams extends BasicPageParams {
  id?: number; //ID
  name?: string; //名称
}

export type UserTagListModel = BasicFetchResult<UserTagModel>;

export interface UserTagBindModel {
  userIds: number[]; //用户IDs
  tagIds: number[]; //标签IDs
}

export interface UserRightsModel {
  code: string; //权益编码, 新建无需指定
  name: string; //权益名称
  image: string; //权益图标
  desc: string; //权益说明
  buttonText: string; //按钮名称
  path: string; //跳转路径
  enabled: boolean; //权益开启
  position: number; //权益排序
  catalog: string; //权益分类名称
}

export type UserRightsListGetModel = BasicFetchResult<UserRightsModel>;

export interface UserExportParams extends BasicPageParams {
  userIds?: string; //用户ID, 逗号分隔
  userId?: string; //受邀人
  fromUserId?: number; //邀请人ID
  fromChannel?: string; //来源渠道 lottery:{id}
  vipStart?: Date; //会员注册起始时间
  vipEnd?: Date; //会员注册结束时间
}

export interface IMemberLevelsParams {
  id?: number;
  alias: string; //等级中文别称
  image: string; //等级图片配置
  image2: string; //会员图片配置
  rules: string[] | { id: number; url: string }[]; //等级说明图片配置
  pointsRate: string; //等级积分倍率
  threshold: number; //升级条件(消费满多少元)
  gifts: {
    points: number; //积分
    coupons: {
      /** 优惠券码 */
      code: string;
      /** 优惠券发放量 */
      count: number;
      /** 优惠券名称 */
      name?: string;
    }[]; //优惠券
  }; //升级礼包
}

export interface IMemberLevelsItem extends IMemberLevelsParams {
  createdAt: Date | null;
  updatedAt: Date | null;
  level: number;
  levelCode: string;
}

export interface IUserPointsParams extends BasicPageParams {
  userId?: string; //受邀人
  account: string; //积分账号
  statuses?: string; //流水状态
  memo?: string; //变更原因
  startDate?: Date; //起始时间
  endDate?: Date; //结束时间
}

export enum EUserPointsType {
  /** 存入(credit)为加 */
  credit = 'credit',
  /** 支出(debit)为减 */
  debit = 'debit',
  /** 支出回滚(debref)为加 */
  debref = 'debref',
  /** 存入回滚(creref)为减 */
  creref = 'creref',
  /** 过期(expire)为减 */
  expire = 'expire',
}

export enum EUserPointsStatus {
  /** 待确认 */
  pending = 0,

  /** 已确认 */
  commited = 1,

  /** 退款单 */
  refund = 2,

  /** 已回滚 */
  rolledback = 3,
}

export interface IUserPointsItem {
  id: number;
  type: EUserPointsType;
  changed: number; //变更值
  balance: number; //变更前余额
  channel: string; //来源
  memo: string; //备注
  account: string; //账号
  sn: string; //流水号
  oriSN: string; //原始流水号
  status: EUserPointsStatus;
  synced: boolean; //是否已同步
  expiredAt: Date; //过期时间
  createdAt: Date; //时间
}

export type IUserPointsItemGetModel = BasicFetchResult<IUserPointsItem>;

export enum EMedalCodeEnum {
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
  joinactivity = 'joinactivity ',
  /** 调查问卷 */
  questionanswer = 'questionanswer',
  /** 年度挚友 */
  annualmember = 'annualmember',
}
