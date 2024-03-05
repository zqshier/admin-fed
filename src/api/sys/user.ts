import {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
  LoginUpdateParams,
} from './model/userModel';
import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/api/pt/auth/login',
  Logout = '/api/pt/auth/logout',
  GetUserInfo = '/api/pt/me',
  GetPermCode = '/api/pt/access/casbin',
  SendCode = '/api/pt/auth/phone_code',
  LoginPhoneCode = '/api/pt/auth/phone',
  StaffShow = '/api/pt/access/app/staffs/:id',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

// 更新用户信息
export function loginUpdateApi(params: LoginUpdateParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.put<GetUserInfoModel>({ url: Api.Login, params }, { errorMessageMode: mode });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<{ data: { m: string; p: any } }>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export const sendCodeApi = async (phone: string) => {
  if (!phone) return false;
  try {
    await defHttp.post({ url: Api.SendCode, params: { phone } });
    return true;
  } catch (err) {}
  return false;
};

export const loginByPhoneCode = (phone: string, code: string, mode: ErrorMessageMode = 'modal') =>
  defHttp.post(
    { url: Api.LoginPhoneCode, params: { phone, code } },
    {
      errorMessageMode: mode,
    },
  );

export function getStaffInfo(id: number) {
  return defHttp.get(
    { url: Api.StaffShow.replace(':id', String(id)) },
    { errorMessageMode: 'none' },
  );
}
