/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  // userId: string | number;
  // token: string;
  // role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  email: string;
  avatar: string;
  phone: string;
  nickname: string;
  domainId: string;

  // roles: RoleInfo[];
  // // 用户id
  // userId: string | number;
  // // 用户名
  // username: string;
  // // 真实名字
  // realName: string;
  // // 头像
  // avatar: string;
  // // 介绍
  // desc?: string;
}

export interface LoginUpdateParams {
  password: string;
  oldPassword: string;
  info?: {
    email: string;
    phone: string;
    nickname: string;
  };
}
