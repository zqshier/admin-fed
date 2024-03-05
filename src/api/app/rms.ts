import { defHttp } from '/@/utils/http/axios';

enum Api {
  Summary = '/api/pt/app/rms/reporting/summary',
}

// banners列表
export const reportingSummary = () =>
  defHttp.get({ url: Api.Summary }, { errorMessageMode: 'none' });
