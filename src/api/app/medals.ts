import { EMedalsConfigsGroup } from '/@/api/app/model/medalsModel';
import {
  IMedalsConfigsParams,
  IMedalsConfigsList,
  IMedalsGroupParams,
  IMedalsRecordsParams,
  IMedalsSettingsParams,
  IMedalsConfigsMedals,
} from './model/medalsModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  MEDALS = '/api/pt/app/medals',
}

// 勋章: 创建or更新
export const medalsConfigs = (data: IMedalsConfigsParams) =>
  defHttp.post({ url: `${Api.MEDALS}/configs`, data });

// 勋章组: 配置数据
export const medalsConfigsDetail = (params: {
  medalId?: number;
  group?: EMedalsConfigsGroup;
  subgroup: string;
}) => defHttp.get<IMedalsConfigsMedals[]>({ url: `${Api.MEDALS}/configs/find`, params });

// 勋章组: 列表
export const medalsConfigsList = () =>
  defHttp.get<IMedalsConfigsList>({ url: `${Api.MEDALS}/configs` });

// 勋章组: 更新
export const medalsConfigsGroup = (data: IMedalsGroupParams) =>
  defHttp.post<IMedalsConfigsList>({ url: `${Api.MEDALS}/configs/group`, data });

// 勋章: 获取记录
export const medalsRecordsList = (params: IMedalsRecordsParams) =>
  defHttp.get<IMedalsConfigsList>({ url: `${Api.MEDALS}/records`, params });

// 勋章: 前端设置
export const medalsSettings = () => defHttp.get({ url: `${Api.MEDALS}/settings` });

// 勋章组: 前端设置更新
export const medalsSettingsUpdate = (data: IMedalsSettingsParams) =>
  defHttp.post({ url: `${Api.MEDALS}/settings`, data });
