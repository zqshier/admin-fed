import { defHttp, downloadLink } from '/@/utils/http/axios';

import {
  CouponsListParams,
  CouponsListGetResultModel,
  CouponsListItem,
  CouponsCenterListGetResultModel,
  TopicsListGetResultModel,
  TopicsListItem,
  TopicsGroupsListItem,
  TopicsGroupsListGetResultModel,
  LinksItem,
  CouponsCenterListItem,
  NewcomerGiftsGetResultModel,
  NewcomerGiftsItem,
  NewcomerGiftsListParams,
  NewcomerGiftsSendRecordParams,
  CouponsRecordsListGetResultModel,
  CouponsRecordsListParams,
  DrawLotsParams,
  DrawLotsItems,
  DrawLotsGetResultModel,
  DrawLotsCodeParams,
  DrawLotsCodeGetResultModel,
  ICnyStoreListParams,
  ICnyStoreListGetResultModel,
  ECnyStoreStatus,
  ICnyStoreItem,
  ICnyStoresRetryItem,
  ICnyStoreRecordsListGetResultModel,
  IDailySigninItem,
} from './model/mmsModel';
import { BasicPageParams } from '/@/api/model/baseModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  COUPONS_CONFIGS = '/api/pt/app/mms/coupons/configs',
  COUPONS_CENTER = '/api/pt/app/mms/coupons-center',
  COUPONS_RECORDS = '/api/pt/app/mms/coupons/records',
  TOPICS = '/api/pt/app/mms/topics',
  TOPICS_GROUPS = '/api/pt/app/mms/topics/groups',
  COUPON_SEND = '/api/pt/app/mms/coupons/send',
  LINKS = '/api/pt/app/tpms/links',
  NEWCOMER_GIFTS = '/api/pt/app/mms/newcomer-gifts',
  BIRTHDAY_GIFTS = '/api/pt/app/mms/birthday-gifts',
  EXPORT_CONFIGS = '/api/pt/app/mms/coupons/export_configs',
  DRAW_LOTS = '/api/pt/app/draw-lots',
  WxCode = '/api/pt/app/tpms/wx/qrcode',
  CNY_STORES = '/api/pt/app/mms/cny/stores',
  CNY_RECORDS = '/api/pt/app/mms/cny/records',
  DAILY_SIGNIN = '/api/pt/app/mms/daily-signin/configs',
  COUPONS_DISCARD = '/api/pt/app/mms/coupons/discard',
}

// coupons列表
export const couponsList = (params: CouponsListParams) =>
  defHttp.get<CouponsListGetResultModel>(
    { url: Api.COUPONS_CONFIGS, params },
    { errorMessageMode: 'none' },
  );

// coupons 码库
export const couponsRecords = (params: CouponsRecordsListParams) =>
  defHttp.get<CouponsRecordsListGetResultModel>(
    { url: Api.COUPONS_RECORDS, params },
    { errorMessageMode: 'none' },
  );

// coupons新建
export const couponsCreate = (data: CouponsListItem) =>
  defHttp.post({ url: Api.COUPONS_CONFIGS, data });

// coupons更新
export const couponsUpdate = (id: number, data: CouponsListItem) =>
  defHttp.put({ url: `${Api.COUPONS_CONFIGS}/${id}`, data });

// coupons更新投放状态
export const couponsUpdateStatus = (id: number, disabled: boolean) =>
  defHttp.put({ url: `${Api.COUPONS_CONFIGS}/${id}`, data: { disabled } });

// coupons导出
export const exportConfigs = async (params: any) => {
  // const res = await defHttp.get(
  //   {
  //     url: Api.EXPORT_CONFIGS,
  //     responseType: 'blob',
  //     params: params,
  //   },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出优惠券数据.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(Api.EXPORT_CONFIGS, params);
  downloadByUrl({ url });
};

// coupons作废
export const couponsDiscard = (data: { userId: number; code: string }) =>
  defHttp.post({ url: `${Api.COUPONS_DISCARD}`, data });

// 活动券列表
export const couponsCenterList = (params: CouponsListParams) =>
  defHttp.get<CouponsCenterListGetResultModel>(
    { url: Api.COUPONS_CENTER + '/list', params },
    { errorMessageMode: 'none' },
  );

//活动券保存
export const couponsCenterSave = (data: CouponsCenterListItem) =>
  defHttp.post({ url: Api.COUPONS_CENTER, data });

//活动券删除
export const couponsCenterDelete = (code: string) =>
  defHttp.delete({ url: Api.COUPONS_CENTER + '/' + code });

//活动券详情
export const couponsCenterDetail = (code: string) =>
  defHttp.get({ url: Api.COUPONS_CENTER + '/' + code });

export const couponsSend = (data: { couponId: number; userId: number }) =>
  defHttp.post({ url: Api.COUPON_SEND, data: { ...data, sn: `${Math.random()}` } });

//商品专区列表
export const topicsList = (params: BasicPageParams) =>
  defHttp.get<TopicsListGetResultModel>({ url: Api.TOPICS, params }, { errorMessageMode: 'none' });

// 商品专区新增or更新
export const topicsCreateOrUpdate = (data: TopicsListItem) =>
  defHttp.post({ url: Api.TOPICS, data });

// 商品专区删除
export const topicsDelete = (id: number) => defHttp.delete({ url: `${Api.TOPICS}/${id}` });

// 活动专区组:列表
export const topicsGroupsList = (params: BasicPageParams) =>
  defHttp.get<TopicsGroupsListGetResultModel>(
    { url: Api.TOPICS_GROUPS, params },
    { errorMessageMode: 'none' },
  );

// 活动专区组:新增or更新
export const topicsGroupsCreateOrUpdate = (data: TopicsGroupsListItem) =>
  defHttp.post({ url: Api.TOPICS_GROUPS, data });

// 活动专区组:删除
export const topicsGroupsDelete = (id: number) =>
  defHttp.delete({ url: `${Api.TOPICS_GROUPS}/${id}` });

// 生成营销链接
export const linksCreate = (data: LinksItem) => defHttp.post({ url: Api.LINKS, data });

// 生成 URL Link
export const linksCreateURL = (data: LinksItem) =>
  defHttp.post({ url: Api.LINKS + '/generate', data });

// 生成 太阳码
export const linksCreateWxCode = (data: LinksItem) =>
  defHttp.post({ url: Api.WxCode, data, responseType: 'blob' });

// 新人礼:列表
export const newcomerGiftsList = (params: NewcomerGiftsListParams) =>
  defHttp.get<NewcomerGiftsGetResultModel>(
    { url: Api.NEWCOMER_GIFTS, params },
    { errorMessageMode: 'none' },
  );

// 新人礼:新增
export const newcomerGiftsCreate = (data: NewcomerGiftsItem) =>
  defHttp.post({ url: Api.NEWCOMER_GIFTS, data });

// 新人礼:更新
export const newcomerGiftsUpdate = (id: number, data: NewcomerGiftsItem) =>
  defHttp.put({ url: `${Api.NEWCOMER_GIFTS}/${id}`, data });

//新人礼:发放记录
export const newcomerGiftsSendRecord = (params: NewcomerGiftsSendRecordParams) =>
  defHttp.get({ url: `${Api.NEWCOMER_GIFTS}/${params.id}/records`, params });

/** 生日礼:列表 */
export const birthdayGiftsList = (params: NewcomerGiftsListParams) =>
  defHttp.get<NewcomerGiftsGetResultModel>(
    { url: Api.BIRTHDAY_GIFTS, params },
    { errorMessageMode: 'none' },
  );

/** 生日礼:新增 */
export const birthdayGiftsCreate = (data: NewcomerGiftsItem) =>
  defHttp.post({ url: Api.BIRTHDAY_GIFTS, data });

/** 生日礼:更新 */
export const birthdayGiftsUpdate = (id: number, data: NewcomerGiftsItem) =>
  defHttp.put({ url: `${Api.BIRTHDAY_GIFTS}/${id}`, data });

/** 生日礼:发放记录 */
export const birthdayGiftsSendRecord = (params: NewcomerGiftsSendRecordParams) =>
  defHttp.get({ url: `${Api.BIRTHDAY_GIFTS}/${params.id}/records`, params });

/** 抽签活动：创建  */
export const drawLotsCreate = (params: DrawLotsItems) =>
  defHttp.post({ url: `${Api.DRAW_LOTS}`, params });

/** 抽签活动：更新  */
export const drawLotsUpdate = (id: number, params: DrawLotsItems) =>
  defHttp.put({ url: `${Api.DRAW_LOTS}/${id}`, params });

/** 抽签活动：列表  */
export const drawLotsList = (params: DrawLotsParams) =>
  defHttp.get<DrawLotsGetResultModel>({ url: `${Api.DRAW_LOTS}`, params });

/** 抽签活动：详情  */
export const drawLotsDetail = (id: number) =>
  defHttp.get<DrawLotsItems>({ url: `${Api.DRAW_LOTS}/${id}` });

/** 抽签活动：签码列表  */
export const drawLotsCodeList = (data: { id: number; params: DrawLotsCodeParams }) =>
  defHttp.get<DrawLotsCodeGetResultModel>({
    url: `${Api.DRAW_LOTS}/${data.id}/codes`,
    params: data.params,
  });

export const drawLotsExport = async (fileName: string, id: number, params: DrawLotsCodeParams) => {
  // return fileExport(`${Api.DRAW_LOTS}/${id}/export_codes`, params, filename);
  const url = downloadLink(`${Api.DRAW_LOTS}/${id}/export_codes`, params);
  downloadByUrl({ url, fileName });
};

/** CNY店铺申请：列表  */
export const cnyStoresList = (params: ICnyStoreListParams) =>
  defHttp.get<ICnyStoreListGetResultModel>({ url: `${Api.CNY_STORES}`, params });

/** CNY店铺申请：审核  */
export const cnyStoresAudit = (
  id: number,
  params: { status: ECnyStoreStatus; disapproveReason?: string },
) => defHttp.put<ICnyStoreItem[]>({ url: `${Api.CNY_STORES}/${id}/audit`, params });

/** CNY扫码：记录  */
export const cnyStoresRecords = (params: ICnyStoreListParams) =>
  defHttp.get<ICnyStoreRecordsListGetResultModel>({ url: `${Api.CNY_RECORDS}`, params });

/** CNY扫码：重发奖励  */
export const cnyStoresRetry = (id: number) =>
  defHttp.put<ICnyStoresRetryItem[]>({ url: `${Api.CNY_RECORDS}/${id}/retry` });

/** 签到配置：详情  */
export const dailySigninConfigsDetail = () =>
  defHttp.get<IDailySigninItem>({ url: `${Api.DAILY_SIGNIN}` });

/** 签到配置：更新  */
export const dailySigninConfigsUpdate = (data: IDailySigninItem) =>
  defHttp.post<IDailySigninItem>({ url: `${Api.DAILY_SIGNIN}`, data });

/** CNY店铺申请：导出  */
export const cnyStoresExport = async (params: ICnyStoreListParams) => {
  const url = downloadLink(`${Api.CNY_STORES}/export`, params);
  downloadByUrl({ url });
};

/** CNY扫码：记录导出  */
export const cnyStoresRecordsExport = async (params: ICnyStoreListParams) => {
  const url = downloadLink(`${Api.CNY_RECORDS}/export`, params);
  downloadByUrl({ url });
};
