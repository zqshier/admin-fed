import { useUserStore } from '/@/store/modules/user';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Roles = '/api/pt/access/app/roles',
  CreateRole = '/api/pt/access/app/roles',
  UpdateRole = '/api/pt/access/app/roles/{name}',
  AddUserToRole = '/api/pt/access/app/roles/{name}/add/user',
  // CreateUser = '/api/pt/auth/create',
  Users = '/api/pt/access/app/staffs',
}

interface IUserApiBody {
  disabled?: boolean;
  info?: { nickname?: string; disabled?: boolean; phone?: string; email?: string };
  roles?: string[];
}

export function listRoles() {
  return defHttp.get({
    url: Api.Roles,
  });
}

export function createRoles(params: {
  domainId: string;
  appId: string;
  name: string; // 角色名
  remark: string; // 备注
  menuIds: number[];
  apiIds: number[];
}) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo || {};
  if (!params.menuIds) params.menuIds = [];
  if (!params.apiIds) params.apiIds = [];
  return defHttp.post({
    url: Api.CreateRole,
    params: { ...params, domainId: userInfo.domainId, appId: userStore.getAppId },
  });
}

export function updateRoles(
  roleName: string,
  params: {
    domainId: string;
    appId: string;
    name?: string; // 角色名
    remark?: string; // 备注
    apiIds?: number[]; // apiId 逗号分隔
    menuIds?: number[]; // 菜单Id 逗号分隔
  },
) {
  // const userStore = useUserStore();
  // const userInfo = userStore.getUserInfo || {};
  return defHttp.put({
    url: Api.UpdateRole.replace('{name}', roleName),
    params: { ...params, roleName },
  });
}

export function deleteRoles(roleName: string) {
  return defHttp.delete({ url: Api.UpdateRole.replace('{name}', roleName) });
}

export function addUserToRole(roleName: string, userId: number) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo || {};
  return defHttp.put({
    url: Api.AddUserToRole.replace('{name}', roleName),
    params: { userIds: [userId], domainId: userInfo.domainId, appId: userStore.getAppId, roleName },
  });
}

export function listUsers() {
  return defHttp.get({ url: Api.Users });
}

export function createUser(params: IUserApiBody) {
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo || {};
  return defHttp.post({
    url: Api.Users,
    params: { ...params, domainId: userInfo.domainId },
  });
}

export function updateUser(id: number, params: IUserApiBody) {
  return defHttp.put({
    url: `${Api.Users}/${id}`,
    params: { ...params },
  });
}

export function deleteUser(id: number) {
  return defHttp.delete({
    url: `${Api.Users}/${id}`,
  });
}

export function resetUserPwd(userId: number) {
  return defHttp.put({
    url: `${Api.Users}/${userId}/pwd`,
  });
}
