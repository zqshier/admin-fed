import { defHttp } from '/@/utils/http/axios';

enum Api {
  List = '/api/pt/access/access-api/list',
}

export const getAccessList = async () => defHttp.get({ url: Api.List, params: { perPage: 1000 } });
