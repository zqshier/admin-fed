import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: Request list interface parameters
 */
export type StoresListParams = BasicPageParams;

export interface StoresListItem {
  // 门店代码，唯一
  code: string;
  // 门店名称
  name: string;
  // 门店类型, 直营|加盟
  type: string;
  // 门店状态, 1启用, 0禁用
  status: number;
  // 门店地区编码
  district: string;
  // 门店地址
  address: string;
  // 门店纬度
  latitude: number;
  // 门店经度
  longitude: number;
  // 门店电话
  phone: string;
  // 营业时间
  opentime: string;
  // 门店图片;
  logo: string;
}

/**
 * @description: Request list return value
 */
export type StoresListGetResultModel = BasicFetchResult<StoresListItem>;

export interface GuidesListItem {
  id?: number; //ID

  storeCode?: string; //店铺编码

  name?: string; //姓名

  phone?: string; //手机号

  status?: number; //状态: 1 启动, 0 停用

  wxId?: string; //企业微信ID

  avatar?: string; //头像

  store?: StoresListItem; //店铺信息

  shipper?: boolean; //发货导购

  global?: boolean; //全局默认导购
}

export type GuidesListParams = BasicPageParams;
export type GuidesListGetResultModel = BasicFetchResult<GuidesListItem>;
