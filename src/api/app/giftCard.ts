import { defHttp, downloadLink } from '/@/utils/http/axios';

import {
  GiftCardListParams,
  GiftCardListResultModel,
  GiftCardCreateParams,
  GiftCardDetailParams,
  GiftCardDetailResultModel,
  GiftCardsBatchUpdateParams,
  GiftCardsBatchUpdateResultModel,
  GiftCardsBatchListParams,
  GiftCardsBatchListResultModel,
  GiftCardBindListResultModel,
  GiftCardQueryListParams,
  GiftCardConsumeListParams,
  GiftCardConsumeListResultModel,
  GiftCardOptParams,
  GiftCardDetailItem,
} from './model/giftCardModel';

import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  GIFT_CARD = '/api/pt/app/gift-card/config',
  GIFT_CARD_CARD = '/api/pt/app/gift-card/card',
  GIFT_CARD_CARDS = '/api/pt/app/gift-card/cards',
  GIFT_CARD_CONSUME = '/api/pt/app/gift-card/consume',
}

// 卡中心：列表
export const giftCardList = (params: GiftCardListParams) =>
  defHttp.get<GiftCardListResultModel>({ url: Api.GIFT_CARD, params });

// 卡中心：创建
export const giftCardCreate = (params: GiftCardCreateParams) =>
  defHttp.post<GiftCardListResultModel>({ url: Api.GIFT_CARD, params });

// 卡中心：详情
export const giftCardDetail = (data: { id: number; params: GiftCardDetailParams }) =>
  defHttp.get<GiftCardDetailResultModel>({
    url: `${Api.GIFT_CARD}/${data.id}/cards-list`,
    params: data.params,
  });

// 卡中心：更新
export const giftCardUpdate = (id: number, params: GiftCardCreateParams) =>
  defHttp.put<GiftCardListResultModel>({ url: `${Api.GIFT_CARD}/${id}`, params });

// 卡中心：新增卡批次
export const giftCardsBatchCreate = (id: number, params: { count: number }) =>
  defHttp.post<GiftCardListResultModel>({
    url: `${Api.GIFT_CARD}/${id}/cards-batch`,
    params,
    timeout: 120 * 1000,
  });

// 卡中心：卡批次列表
export const giftCardsBatchList = (data: { id: number; params: GiftCardsBatchListParams }) =>
  defHttp.get<GiftCardsBatchListResultModel>({
    url: `${Api.GIFT_CARD}/${data.id}/cards-batch`,
    params: data.params,
  });

// 卡中心：导出礼品卡信息
export const giftCardsExport = async (id: number, params: { batchNo: string } & any) => {
  // const data = await defHttp.get(
  //   { url: `${Api.GIFT_CARD}/${id}/export-cards`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none' },
  // );
  // downloadByData(data, '礼品卡信息导出' + '.csv');
  const url = downloadLink(`${Api.GIFT_CARD}/${id}/export-cards`, params);
  downloadByUrl({ url });
};

// 卡中心：导入更新礼品卡信息
export const giftCardImport = (id: number, params: { file: File }) => {
  const file = params.file;
  return defHttp.submitForm<GiftCardsBatchUpdateResultModel>(
    { url: `${Api.GIFT_CARD}/${id}/import-cards` },
    { file },
  );
};

// 卡中心：批量更新礼品卡信息
export const giftCardsBatchUpdate = (id: number, params: GiftCardsBatchUpdateParams) =>
  defHttp.put<GiftCardsBatchUpdateResultModel>({
    url: `${Api.GIFT_CARD}/${id}/update-cards`,
    params,
  });

// 卡中心：操作礼品卡
export const giftCardsOpt = (params: GiftCardOptParams) =>
  defHttp.put<GiftCardDetailItem>({
    url: `${Api.GIFT_CARD_CARD}-opt`,
    params,
  });

// 卡中心：礼品卡退款
export const giftCardsRefund = (params: { cardNo: string; amount: string }) =>
  defHttp.put<GiftCardDetailItem>({
    url: `${Api.GIFT_CARD_CARD}-refund`,
    params,
  });

// 卡中心：绑定记录
export const giftCardQueryList = (params: GiftCardQueryListParams) =>
  defHttp.get<GiftCardBindListResultModel>({ url: `${Api.GIFT_CARD_CARDS}-query`, params });

// 卡中心：导出卡查询记录
export const giftCardQueryExport = async (params: GiftCardQueryListParams) => {
  // const data = await defHttp.get(
  //   { url: `${Api.GIFT_CARD_CARDS}-export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none' },
  // );
  // downloadByData(data, '导出卡查询记录' + '.csv');
  const url = downloadLink(`${Api.GIFT_CARD_CARDS}-export`, params);
  downloadByUrl({ url });
};

// 卡中心：消费记录
export const giftCardConsumeList = (params: GiftCardConsumeListParams) =>
  defHttp.get<GiftCardConsumeListResultModel>({ url: `${Api.GIFT_CARD_CONSUME}-list`, params });

// 卡中心：导出消费记录
export const giftCardConsumeExport = async (params: GiftCardConsumeListParams) => {
  // const data = await defHttp.get(
  //   { url: `${Api.GIFT_CARD_CONSUME}-export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none' },
  // );
  // downloadByData(data, '导出消费记录' + '.csv');
  const url = downloadLink(`${Api.GIFT_CARD_CONSUME}-export`, params);
  downloadByUrl({ url });
};
