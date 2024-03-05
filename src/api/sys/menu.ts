import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetMenuList = '/api/pt/menus/config',
}

export const getMenuList = async () => {
  const res = await defHttp.get({ url: Api.GetMenuList });
  return res.app;
};
