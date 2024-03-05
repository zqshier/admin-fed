import { defHttp, downloadLink } from '/@/utils/http/axios';

import {
  AriticleParams,
  AriticleListResultModel,
  AriticleInfo,
  UsersParams,
  UsersListResultModel,
  UsersInfo,
  IQuestionnaireParams,
  IQuestionnaireResultModel,
  IQuestionnaireListParams,
  IQuestionnaireItem,
  IQuestionnaireRecordItemResultModel,
  IQuestionnaireRecordListParams,
} from './model/articleModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  ARTICLE = '/api/pt/app/community/article',
  USERS = '/api/pt/app/community/users',
  QUESTIONNAIRE = '/api/pt/app/questionnaire',
}

// 文章列表
export const articleList = (params: AriticleParams) =>
  defHttp.get<AriticleListResultModel>({ url: `${Api.ARTICLE}/list`, params });

// 新增文章
export const articleCreate = (data: AriticleInfo) => defHttp.post({ url: Api.ARTICLE, data });

// 删除文章
export const articleDelete = (data: { id: number; userId: number }) =>
  defHttp.delete({ url: `${Api.ARTICLE}/delete/${data.id}`, data });

// 更新文章
export const articleUpdate = (id: number, data: AriticleInfo) =>
  defHttp.put({ url: `${Api.ARTICLE}/update/${id}`, data });

// 更新文章状态
export const articleStateUpdate = (data: { id: number; state: string }) =>
  defHttp.put({ url: `${Api.ARTICLE}/state/update`, data });

// 账号列表
export const usersList = (params: UsersParams) =>
  defHttp.get<UsersListResultModel>({ url: `${Api.USERS}`, params });

// 新增账号
export const usersCreate = (data: UsersInfo) => defHttp.post({ url: Api.USERS, data });

// 更新账号
export const usersUpdate = (id: number, data: UsersInfo) =>
  defHttp.put({ url: `${Api.USERS}/${id}`, data });

// 账号详情
export const usersDetail = (id: number) => defHttp.get<UsersInfo>({ url: `${Api.USERS}/${id}` });

// 问卷列表
export const questionnaireList = (params: IQuestionnaireListParams) =>
  defHttp.get<IQuestionnaireResultModel>({ url: `${Api.QUESTIONNAIRE}/list`, params });

// 问卷:新增
export const questionnaireCreate = (data: IQuestionnaireParams) =>
  defHttp.post<IQuestionnaireItem>({ url: `${Api.QUESTIONNAIRE}/info`, data });

// 问卷:详情
export const questionnaireDetail = (id: number) =>
  defHttp.get<IQuestionnaireItem>({ url: `${Api.QUESTIONNAIRE}/info/${id}` });

// 问卷:修改
export const questionnaireUpdate = (id: number, params: IQuestionnaireParams) =>
  defHttp.put<IQuestionnaireItem>({ url: `${Api.QUESTIONNAIRE}/info/${id}`, params });

// 问卷统计:列表
export const questionnaireRecordList = (params: IQuestionnaireRecordListParams) =>
  defHttp.get<IQuestionnaireRecordItemResultModel>({
    url: `${Api.QUESTIONNAIRE}/record-list`,
    params,
  });

// 问卷统计:导出
export const questionnaireRecordExport = async (params: IQuestionnaireRecordListParams) => {
  // const res = await defHttp.get(
  //   { url: `${Api.QUESTIONNAIRE}/record-export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出问卷统计.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.QUESTIONNAIRE}/record-export`, params);
  downloadByUrl({ url });
};
