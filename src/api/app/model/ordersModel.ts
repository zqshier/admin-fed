import { CombItem, MediaInfo } from './goodsModel';
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type OrdersListParams = BasicPageParams;

export interface OrdersListItem {
  id: number;
}

export type OrdersListGetResultModel = BasicFetchResult<OrdersListItem>;

export interface AftersaleListParams extends BasicPageParams {
  orderNo?: string;
  userId?: number;
  type?: number;
  status?: number;
  startTime?: string;
  endTime?: string;
  guideId?: number;
}

export interface AftersaleStatusUpdateParams {
  action: string; // 管理行为 REFUSE = 'refuse', // 同意 APPROVE = 'approve', // 拒绝物流 REJECT_SHIPMENT = 'reject_shipment', // 同意物流 ACCEPT_SHIPMENT = 'accept_shipment', // 取消 CANCEL = 'cancel' ⤵
  afterSaleNo: string; //退款号;
  refuseRemark?: string; //原因
}

export interface AfterSaleCreateItem {
  goodsId: number;
  skuId: number;
  refundGoodsAmount: string;
}

export interface AftersaleRefundOrderParams {
  orderNo: string;
  userId: number;
  isRefundCostFright: boolean;
  reason: string;
  type: AfterSaleType;
  items: AfterSaleCreateItem[];
}

export enum AfterSaleType {
  // 仅退款
  MONEY_ONLY = 'money_only',
  // 退货退款
  MONEY_GOODS = 'money_goods',
  // 主动退款
  INITIATIVE = 'initiative',
}

export enum EAfterSaleStatus {
  pending = 'pending',
  pending_fill_up_logistic = 'pending_fill_up_logistic',
  pending_shipment = 'pending_shipment',
  refund_pending = 'refund_pending',
  refund_success = 'refund_success',
  close = 'close',
  refuse = 'refuse',
}

export enum EAfterSaleLogsAction {
  /** 填写地址 */
  fill_shipment = 'fill_shipment',
  /**  售后单创建 */
  create = 'create',
  /** 拒绝退款 */
  refuse = 'refuse',
  /** 同意退款 */
  approve = 'approve',
  /** 拒绝退货收货 */
  reject_shipment = 'reject_shipment',
  /** 接受退货收货 */
  accept_shipment = 'accept_shipment',
  /** 取消售后单 */
  cancel = 'cancel',
  /** 退款到账 */
  refund_success = 'refund_success',
}

export enum EAfterSaleLogsState {
  /** 未发货 */
  pending = 'pending',
  /** 已经发货 */
  delivered = 'delivered',
}

export enum EAfterSaleLogisticsType {
  /** 无需物流 */
  none,
  /** 快递 */
  express,
  /** 到店 */
  shop,
}

export enum EOrderStatus {
  pending_paid = 'pending_paid',
  pending_shipment = 'pending_shipment',
  pending_receipt = 'pending_receipt',
  completed = 'completed',
  canceled = 'canceled',
  closed = 'closed',
  invalid = 'invalid',
  partial_paid = 'partial_paid',
}

export enum ESettleCartMode {
  buyBulk = 'buyBulk',
  buyNow = 'buyNow',
  GiftCard = 'giftCard',
  Point = 'point',
  FlashSale = 'flash',
  drawLot = 'drawLot',
}

export enum EOrderItemServeStatus {
  /** 售后进行中 */
  SERVING = 'serving',
  /** 当前无售后 */
  NOSERVING = 'noserving',
  /** 全退款 */
  CLOSE = 'close',
}

export interface AftersaleRefundOrderItem {
  totalRefundAmount: string; //退款总金额
  isDelivery: boolean; //是否进入退款发货
  fillUpTime: Date; //退款物流填写时间
  id: number; //记录id
  afterSaleNo: string; //退款单号
  orderNo: string; //订单号
  userId: number; //用户id
  refundGoodsAmount: string; //退款金额
  reason: string | null; //退款原因
  goodsInfo: {
    //商品信息
    name: string; //商品名
    image: string; //商品主图
    type: number; //商品类型
    comb: CombItem; //规格参数
    goodsSn: string; //商品SN
    skuSn: string; //SKU SN
    goodsBarCode: string; //规格编码
    skuBarCode: string; //规格条码
    meta: {
      giftCardId: number; //礼品卡ID，当商品类型为优惠券时有效
      couponCode: string; //优惠券编码，当商品类型为优惠券时有效
    };
  };
  remark: string | null; //退款备注
  goodsId: number; //退款物品Id
  skuId: number; //skuId
  refundCostFright: string; //运费
  status: EAfterSaleStatus; //售后单状态
  type: AfterSaleType; //售后单类型
  count: number; //售后数量
  logs: {
    //协商详情
    action: EAfterSaleLogsAction; //审核
    createdAt: Date; //创建时间
  }[];
  logisticCode: string | null; //售后单创建时间
  logisticNo: string | null; //售后单创建时间
  createdAt: Date; //售后单创建时间
  updatedAt: Date; //售后单创建时间
  order: {
    // 订单信息
    displayTime: Date; //订单展示时间
    isShipped: boolean; //是否已经发货
    bizCode: string; //业务代码
    shipGuideId: number; //发货导购
    shipStoreCode: string; //发货导购
    receivableAmount: string; //实收金额
    parentNo: string | null; //父订单号
    parcelItems: {
      // 包裹
      parcelNo: string; //包裹ID
      arrivedAt: Date | null; //到达时间
      shippedAt: Date | null; //发货时间
      createdAt: Date; //创建时间
      updatedAt: Date; //修改时间
      userId: number; //用户Id
      orderNo: string; //订单号
      items: {
        skuId: number;
        goodsId: number;
      }[];
      state: EAfterSaleLogsState;
      logisticCode: string; //物流公司僅
      logisticNo: string; //物流单号
      logisticToken: string; //物流查询TOKEN
      consignorId: number; //发货人Id
      warehouseCode: string; //仓库Id
      synced: boolean; //三方物流同步
      id: number;
    }[];
    orderModeConfig: {
      //订单销售模式选项
      payment: number; //0 全款, 1 比例, 3 定金
      value: number; //按比例或者按定金支付的值, 比例: 1-99, 定金: 不超过商品价格
      prepayTimeEnd: Date; //预付结束时间
      finalPayTimeStart: Date; //尾款开始时间
      finalPayTimeEnd: Date; //尾款结束时间
      deliveryType: number; //发货时间类型, 0 固定时间 | 1 尾款X天后
      deliveryValue: number; //发货时间, 时间戳(秒)或天数
    };
    orderDiscountAmount: string; //订单折扣金额
    weight: number; //重量
    expirationTime: Date; //支付过期时间
    orderNo: string; //订单号
    userId: number; //用户id
    memo: string | null; //备注信息
    remark: string | null; //卖家备注信息
    goodsAmount: string; //商品总金额
    orderAmount: string; //订单实际销售总额度
    promotionDiscountAmount: string; //订单促销金额
    couponDiscountAmount: string; //卡券促销金额
    promotionList: {
      //促销列表
      promotionId: string;
      goodsInfos: {
        count: number; //购买数量
        skuId: number;
        goodsId: number;
      }[];
    }[];
    couponList: string[]; //卡券列表
    pointExchangeMoney: string; //积分抵扣金额
    point: number; //使用积分
    orderItems: {
      //购买项信息
      goodsInfo: {
        //商品信息
        name: string; //商品名
        image: string; //商品主图
        type: number; //商品类型
        comb: CombItem;
        goodsSn: string; //商品SN
        skuSn: string;
        goodsBarCode: string; //规格编码
        skuBarCode: string; //规格条码
        meta: {
          //meta信息
          giftCardId: number; //礼品卡ID，当商品类型为优惠券时有效
          couponCode: string; //优惠券编码，当商品类型为优惠券时有效
        };
      };
      couponDiscountAmount: string; //卡券抵扣
      pointDiscountAmount: string; //积分抵扣
      totalDiscountAmount: string; //商品项总抵扣
      promotionDiscountAmount: string; //活动优惠
      changeAmount: string; //改价价格
      orderNo: string; //订单No
      skuId: number;
      goodsId: number; //商品Id
      payableAmount: string; //付款价格
      totalPrice: string; //总价
      mktPrice: string; //标价
      count: number; //购买数量
      weight: string; //商品重量
      itemType: number; //商品类型 0|1|2
      remark: string; //备注
      giftCardDiscountAmount: string; //礼品卡抵扣金额
      orderItemDiscountAmount: string; //优惠金额(除礼品卡扣减)
      payablePoint: number; //应付积分
      createdAt: Date;
      id: number;
      updatedAt: Date;
    }[];
    source: string; //订单来源
    deliverAddr: {
      //用户地址信息
      orderNo: string;
      name: string; //收货人姓名
      phone: string; //收货人电话
      provinceName: string; //省
      cityName: string; //市
      districtName: string; //区
      zipcode: string; //邮政编码
      districtCode: string; //地区编码
      address: string; //详细地址
    };
    clientIp: string; //下单Ip地址
    platformId: string; //客户端AppId
    orderType: number; //订单类型 0|1|2
    logisticsType: EAfterSaleLogisticsType;
    logisticsId: number | null; //物流方式ID
    costFreight: string; //运费金额
    createTime: Date; //订单创建时间
    completeTime: Date | null; //订单完成时间
    confirmTime: Date | null; //确认收货时间
    createdAt: Date; //订单系统创建订单时间
    deliverTime: Date | null; //送达时间
    guaranteeDeliverTime: Date | null; //送达时间
    id: number;
    orderStatusCode: string; //订单业务状态码
    payCode: string; //支付方法代码
    payStatus: number; //支付状态 0|1|2
    payableAmount: string; //应付金额
    payablePoint: string; //应付金额
    payTime: Date | null; //支付时间
    status: EOrderStatus; //订单状态
    updatedAt: Date; //订单修改时间
    orderModeCode: string; //订单模式标识
    changeAmount: string; //订单改价金额
    changeCostFreight: string; //运费改价金额
    serveStatus: EOrderItemServeStatus; //售后状态用作检索 default|serving|close|cancel
    storeCode: string; //店铺Code
    cancelMemo: string; //取消订单备注
    guideId: number; //导购ID
    giftCardDiscountAmount: string; //礼物卡抵扣
    settleCartMode: ESettleCartMode; //结算模式
    commentStatus: 'default' | 'comment' | 'close'; //订单评价状态
    refundGiftCardAmount: string; //兑换卡退款金额
    extendInfo: {
      //发起退款扩展字段
      images: string[]; //图片
      description: string; //描述
    };
    guide: {
      //导购信息
      id: number;
      storeCode: string; //店铺编码
      code: string; //导购编码
      name: string; //姓名
      phone: string; //手机号
      status: 1 | 0; //状态: 1 启动, 0 停用
    };
    wxId: string; //企业微信ID
    avatar: string; //头像
    qrcode: string; //导购二维码
    shipper: boolean; //发货导购
    global: boolean; //全局默认导购
    store: {
      //所属店铺, 查询导购详情时
      code: string; //门店代码，唯一
      name: string; //门店名称
      type: string; //门店类型, 直营|加盟
      status: 1 | 0; //门店状态, 1启用, 0禁用
      district: string; //门店地区编码
      address: string; //门店地址
      latitude: number; //门店纬度
      longitude: number; //门店经度
      phone: string; //门店电话
      opentime: string; //营业时间
      logo: string; //门店图片
      numOfGuides: number; //门店导购数量
    };
    position: string; //职位, 店长|店员
  };
}

export type AftersaleRefundOrderListGetResultModel = BasicFetchResult<AftersaleRefundOrderItem>;

export interface IOrderCommentsListParams extends BasicPageParams {
  orderNo?: string;
  goodsName?: string;
  userId?: number;
  start?: Date;
  end?: Date;
}

export interface IOrderCommentsListItem {
  userId: number;
  orderNo: string;
  goodsInfo: {
    name: string;
    image: string;
    type: number;
    comb: CombItem[];
    goodsSn: string;
    skuSn: string;
    goodsBarCode: string;
    skuBarCode: string;
    meta: { giftCardId: number; couponCode: string };
  };
  productStar: number;
  productPackagingStar: number;
  customerServiceStar: number;
  logisticsStar: number;
  recommendationStar: number;
  createdAt: Date;
  id: number;
  appId: string;
  state: string;
}

export type IOrderCommentsListGetResultModel = BasicFetchResult<IOrderCommentsListItem>;

export enum EOrderConversionAuditStatus {
  pending,
  approve,
  reject,
}
export interface IOrderConversionGoodsInfo {
  goodsName: string;
  specName: string;
  goodsBarCode: string;
  skuBarCode: string;
  num: number;
  notes: string;
  amount: string;
}
export interface IOrderConversionParams {
  orderNo?: string;
  omsOrderNo?: string;
  payAmount?: string;
  payTime?: Date | null;
  orderStatus?: string;
  shopName?: string;
  receiverInfo?: {
    name: string; //收件人姓名
    phone: string; //收件人电话
    province: string; //省
    city: string; //市
    district: string; //区
    address: string; //
    districtCode?: string;
    provinceCode?: string;
    cityCode?: string;
  };
  goodsInfo?: IOrderConversionGoodsInfo[];
  productName?: string;
  orderAmount?: string;
}

export interface IOrderConversionListParams extends BasicPageParams {
  orderNo?: string;
  startTime?: Date;
  endTime?: Date;
  auditStatus?: EOrderConversionAuditStatus;
  platform?: string;
  channel?: string;
  userId?: number;
}

export interface IOrderConversionListItem {
  id: number;
  userId: number;
  orderNo: string;
  levelAlias: string; //会员等级名称
  pointsRate: string; //等级积分倍率
  auditStatus: EOrderConversionAuditStatus; // 审核状态 0未审核 1通过 2拒绝
  auditTime: Date;
  predictIntegral: number; //预计发放的积分
  platform: string;
  channel: string;
  isRepeat: false; //是否重复
  omsOrderNo: string; //旺店通的订单编号
  payAmount: string;
  payTime: Date;
  createdAt: Date;
  actualIntegral: number | null; //发放积分
}

export type IOrderConversionListGetResultModel = BasicFetchResult<IOrderConversionListItem>;

export enum EOrderConversionConfigType {
  payAmountAndRate = 1,
}
export interface IOrderConversionConfigParams {
  status: boolean; //是否上架
  type: EOrderConversionConfigType; //转化奖励 1按照会员实付金额会员系数赠送积分
  image: string; //活动头图
  explainImage: MediaInfo[]; //转化说明图
  shareImage: string; //活动分享图
}

export interface IOrderConversionConfigItem extends IOrderConversionConfigParams {
  id: number;
  createdAt: Date; //创建时间
  updatedA: Date; //更新时间
}

export interface IOrderConversionAuditParams {
  ids: number[];
  isAllow: boolean;
  refuseType?: number;
  refuseReason?: string;
  actualIntegral?: number;
}
