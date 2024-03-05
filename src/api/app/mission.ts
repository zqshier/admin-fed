import { defHttp } from '/@/utils/http/axios';
import {
  IMission,
  MissionsGroupsListResultModel,
  MissionsGroupsParams,
  GroupCode,
} from './model/missionModel';

enum Api {
  list = '/api/pt/app/missions',
  batchUpdate = '/api/pt/app/missions/batch',
}

export const missionsList = (params: { groupCode: GroupCode; groupRelatedId: number }) =>
  defHttp.get<{ list: IMission[] }>({ url: Api.list, params }, { errorMessageMode: 'none' });

export const batchUpdate = (params: {
  list: IMission[];
  groupCode: GroupCode;
  groupRelatedId: number;
  groupName: string;
}) =>
  defHttp.post<{ list: IMission[] }>(
    { url: Api.batchUpdate, params },
    { errorMessageMode: 'none' },
  );

export const missionsGroupsList = (params: MissionsGroupsParams) => {
  const { groupRelatedIds, ...others } = params;
  return defHttp.get<MissionsGroupsListResultModel>(
    {
      url: `${Api.list}/groups`,
      params: { ...others, groupRelatedIds: groupRelatedIds?.join(',') },
    },
    { errorMessageMode: 'none' },
  );
};

export const missionsGroupsUpdate = (data: { id: number; params: { disabled: boolean } }) =>
  defHttp.put(
    { url: `${Api.list}/groups/${data.id}`, params: data.params },
    { errorMessageMode: 'none' },
  );

export const missionsCreated = (data: IMission) =>
  defHttp.post<{ list: IMission[] }>({ url: `${Api.list}/configs`, data });

export const missionsUpdate = (id: number, data: IMission) =>
  defHttp.put<{ list: IMission[] }>({ url: `${Api.list}/configs/${id}`, data });

export const missionsDelete = (id: number) =>
  defHttp.delete<{ list: IMission[] }>({ url: `${Api.list}/configs/${id}` });
