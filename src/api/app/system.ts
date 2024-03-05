import { defHttp } from '/@/utils/http/axios';
import { DeliveryTemplatesGetResultModel, DeliveryTemplates, MenuModel } from './model/systemModel';

export * from './model/systemModel';

enum Api {
  DELIVERY_TEMPLATES = '/api/pt/app/delivery-templates',
  MENUS = '/api/pt/menus',
}

// 运费模版列表
export const deliveryTemplatesList = () =>
  defHttp.get<DeliveryTemplatesGetResultModel>(
    { url: Api.DELIVERY_TEMPLATES },
    { errorMessageMode: 'none' },
  );

// 运费模版新增
export const deliveryTemplatesCreate = (data: DeliveryTemplates) =>
  defHttp.post({ url: Api.DELIVERY_TEMPLATES, data });

// 运费模版更新
export const deliveryTemplatesUpdate = (id: number, data: DeliveryTemplates) =>
  defHttp.put({ url: `${Api.DELIVERY_TEMPLATES}/${id}`, data });

// 运费模版删除
export const deliveryTemplatesDelete = (id: number) =>
  defHttp.delete({ url: `${Api.DELIVERY_TEMPLATES}/${id}` });

//获取菜单信息
export const menuList = () => defHttp.get({ url: Api.MENUS + '/config' });

//创建菜单
export const menuCreate = (data: MenuModel) => defHttp.post({ url: Api.MENUS + '/create', data });

//修改菜单
export const menuUpdate = (id: number, data: MenuModel) =>
  defHttp.put({ url: Api.MENUS + '/update/' + id, data });

//修改菜单
export const menuDelete = (id: number) => defHttp.delete({ url: Api.MENUS + '/delete/' + id });
