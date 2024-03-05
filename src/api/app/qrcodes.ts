import {
  QrcodesBatchesGetResultModel,
  QrcodesBatchesListParams,
  QrcodesListGetResultModel,
  QrcodesListItem,
  QrcodesListParams,
  QrcodesModel,
} from './model/qrcodesModel';
import { downloadByUrl } from '/@/utils/file/download';
import { defHttp, downloadLink } from '/@/utils/http/axios';

enum Api {
  QRCODES = '/api/pt/app/qrcodes',
}

// 一物一码列表
export const qrcodesList = (params: QrcodesListParams) =>
  defHttp.get<QrcodesListGetResultModel>(
    { url: Api.QRCODES, params },
    { errorMessageMode: 'none' },
  );

// 一物一码创建
export const qrcodesCreate = (params: QrcodesModel) =>
  defHttp.post<QrcodesListItem>({ url: Api.QRCODES, params });
export const qrcodesUpdate = (id: number, params: QrcodesModel) =>
  defHttp.put<QrcodesListItem>({ url: Api.QRCODES + `/${id}`, params });

// 创建批次
export const qrcodesBatchesCreate = (id: number, count: number) =>
  defHttp.post({ url: `${Api.QRCODES}/${id}/batches`, params: { count } });

// 单码查询
export const qrcodesQuery = (params: any) => defHttp.get({ url: `${Api.QRCODES}/query`, params });

// 批次列表
export const qrcodesBatchesList = (params: QrcodesBatchesListParams) =>
  defHttp.get<QrcodesBatchesGetResultModel>({ url: `${Api.QRCODES}/${params.id}/batches`, params });

//批次导出
export const qrcodesBatchesExport = async (fileName: string, id: number, bid: number) => {
  // const data = await defHttp.get(
  //   {
  //     url: `${Api.QRCODES}/${id}/batches/${bid}/export`,
  //     params: {},
  //     responseType: 'blob',
  //     timeout: 3600 * 1000,
  //   },
  //   { errorMessageMode: 'none' },
  // );
  // downloadByData(data, filename + '.csv');
  const url = downloadLink(`${Api.QRCODES}/${id}/batches/${bid}/export`, {});
  downloadByUrl({ url, fileName });
};
