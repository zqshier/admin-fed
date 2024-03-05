import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export enum EBookingTarget {
  goods = 'goods',
  pointmall = 'pointmall',
  drawLots = 'drawLots',
}
export interface BookingListItem {
  id: number; // 活动ID
  name: string; // 名称
  start: string; // 预约开始时间
  sendAt: string; // 通知发放时间
  templateId: string; // 模板ID
  templateData: string[][]; // 模板数据对应关系，例: [["thing1", "商品名称"], ["thing3", "这是自定义的一句话"]]
  target: EBookingTarget; // 预约对象标识: goods 商品 ⤵
  targetId: string; // 预约对象ID，比如商品则是商品ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  disabled: boolean; // 是否禁用
  bookedNumbers: number; // 实际预约人数
  bookedBaseNumbers: number; // 基础人数
}

export type BookingListResultModel = BasicFetchResult<BookingListItem>;

export interface BookingListParams extends BasicPageParams {
  targets?: EBookingTarget[];
}

export interface WxTemplateListItem {
  priTmplId: string; // 模板ID
  title: string; // 模板标题
  content: string; // 模板内容
  example: string; // 模板内容示例
}

export type WxTemplateListResultModel = BasicFetchResult<WxTemplateListItem>;
