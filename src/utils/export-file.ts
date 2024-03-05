import { downloadByData } from './file/download';
import { defHttp } from './http/axios';

// 导出列表下载文件
export const fileExport = async (url: string, params: any, filename?: string) => {
  const res = await defHttp.get(
    { url, params, responseType: 'blob', timeout: 7200 * 1000 },
    { errorMessageMode: 'none', isReturnNativeResponse: true },
  );
  if (!filename) filename = '导出.xlsx';
  try {
    filename = decodeURIComponent(
      res.headers['content-disposition'].split(';')[1].split('filename=')[1],
    );
  } catch (err) {}
  downloadByData(res.data, filename);
};
