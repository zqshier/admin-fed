import {
  IAppUserModelStatus,
  IMemberLevelsParams,
  IUserPointsItemGetModel,
  IUserPointsParams,
} from './model/userModel';
/**
 * 用户管理API
 */

import {
  AppUserListModel,
  AppUserListParams,
  AppUserModel,
  IMemberLevelsItem,
  UserExportParams,
  UserRightsListGetModel,
  UserRightsModel,
  UserTagBindModel,
  UserTagListModel,
  UserTagListParams,
  UserTagModel,
} from './model/userModel';
import { downloadByUrl } from '/@/utils/file/download';
import { defHttp, downloadLink } from '/@/utils/http/axios';
export * from './model/userModel';

enum Api {
  USERS = '/api/pt/app/users',
  USERS_EXPORT = '/api/pt/app/users/export',
  USERS_TAGS = '/api/pt/app/user-tags',
  USERS_RIGHTS = '/api/pt/app/mpms/rights',
  USER_INVITES = '/api/pt/app/user-invites',
  MEMBER_LEVELS = '/api/pt/app/mpms/member-levels',
  USER_POINTS = '/api/pt/app/mpms/points',
}

// 用户列表
export const userList = (params: AppUserListParams) =>
  defHttp.get<AppUserListModel>({ url: Api.USERS, params }, { errorMessageMode: 'none' });

// 用户详情
export const userDetail = (id: number) => defHttp.get<AppUserModel>({ url: `${Api.USERS}/${id}` });

export const updateUserStatus = (id: number, status: IAppUserModelStatus) =>
  defHttp.put<AppUserModel>({ url: `${Api.USERS}/${id}/status`, data: { status } });

// 用户列表导出
export const userListExport = (params: AppUserListParams) => {
  // const res = await defHttp.get(
  //   { url: Api.USERS_EXPORT, params, responseType: 'blob', timeout: 30 * 60 * 1000 },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  return downloadLink(Api.USERS_EXPORT, params);
};

// 标签列表
export const userTagList = (params: UserTagListParams) =>
  defHttp.get<UserTagListModel>({ url: Api.USERS_TAGS, params }, { errorMessageMode: 'none' });

//标签:新建
export const userTagCreate = (data: UserTagModel) => defHttp.post({ url: Api.USERS_TAGS, data });

//标签:更新
export const userTagUpdate = (id: number, data: UserTagModel) =>
  defHttp.put({ url: Api.USERS_TAGS + '/' + id, data });

//标签:用户绑定
export const userTagBind = (data: UserTagBindModel) =>
  defHttp.post({ url: Api.USERS_TAGS + '/bind', data });

//标签:用户解除
export const userTagUnbind = (data: UserTagBindModel) =>
  defHttp.post({ url: Api.USERS_TAGS + '/unbind', data });

interface IUserPointsUpdateDto {
  userId: number;
  changed: number;
  memo: string;
}

// 积分：增减
export const userPointsUpdate = (data: IUserPointsUpdateDto) =>
  defHttp.post({ url: Api.USER_POINTS, data });

// 用户权益列表
export const userRightsList = () =>
  defHttp.get<UserRightsListGetModel>({ url: Api.USERS_RIGHTS }, { errorMessageMode: 'none' });

// 用户权益 新增/更新
export const userRightsSave = (data: UserRightsModel) =>
  defHttp.post({ url: Api.USERS_RIGHTS, data });

// 导出邀请
export const usersInviteExport = async (params: UserExportParams) => {
  // const res = await defHttp.get(
  //   { url: `${Api.USER_INVITES}/export`, params, responseType: 'blob' },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出会员邀请注册记录.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.USER_INVITES}/export`, params);
  downloadByUrl({ url });
};

// 邀请记录用户列表
export const userInvitesList = (params: AppUserListParams) =>
  defHttp.get<AppUserListModel>({ url: Api.USER_INVITES, params }, { errorMessageMode: 'none' });

// 会员等级配置
export const memberLevelsList = () =>
  defHttp.get<{ levels: IMemberLevelsItem[] }>({ url: Api.MEMBER_LEVELS });

// 会员等级配置
export const memberLevelsSave = (levels: IMemberLevelsParams[]) =>
  defHttp.post<{ levels: IMemberLevelsItem[] }>({ url: Api.MEMBER_LEVELS, data: { levels } });

// 积分：明细列表
export const userPointsList = (params: IUserPointsParams) =>
  defHttp.get<IUserPointsItemGetModel>({ url: Api.USER_POINTS, params });
