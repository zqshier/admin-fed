import { defHttp, downloadLink } from '/@/utils/http/axios';
import {
  FriendPowerListParams,
  FriendPowerListResultModel,
  FriendPowerListItem,
  FriendPowerUpdateData,
  IFriendPowerConfigCycleListParams,
  IFriendPowerConfigCycleListItem,
} from './model/friendPowerModel';
import { downloadByUrl } from '/@/utils/file/download';

enum Api {
  ACTIVITY = '/api/pt/app/friend-power/activity',
  CONFIG_CYCLE_LIST = '/api/pt/app/friend-power/configCycleList',
}

// 助力活动列表
export const friendPowerListApi = (params: FriendPowerListParams) =>
  defHttp.get<FriendPowerListResultModel>({ url: Api.ACTIVITY, params });

// 助力活动新增
export const friendPowerCreateApi = (data: FriendPowerListItem) =>
  defHttp.post({ url: Api.ACTIVITY, data });

// 助力活动更新
export const friendPowerUpdateApi = (id: number, data: FriendPowerUpdateData) =>
  defHttp.put({ url: `${Api.ACTIVITY}/${id}`, data });

// 助力活动详情
export const friendPowerDetailApi = (id: number) =>
  defHttp.get<FriendPowerListItem>({
    url: `${Api.ACTIVITY}/${id}`,
  });

// 助力活动记录列表
export const friendPowerConfigCycleListApi = (params: IFriendPowerConfigCycleListParams) =>
  defHttp.get<IFriendPowerConfigCycleListItem>({ url: `${Api.CONFIG_CYCLE_LIST}`, params });

// 助力活动记录列表
export const friendPowerConfigCycleListExportApi = async (
  params: IFriendPowerConfigCycleListParams,
) => {
  // const res = await defHttp.get(
  //   {
  //     url: `${Api.CONFIG_CYCLE_LIST}/export`,
  //     responseType: 'blob',
  //     params: params,
  //   },
  //   { errorMessageMode: 'none', isReturnNativeResponse: true },
  // );
  // let filename = '导出助力活动记录列表.xlsx';
  // try {
  //   filename = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
  //   filename = decodeURIComponent(filename);
  // } catch (err) {}
  // downloadByData(res.data, filename);
  const url = downloadLink(`${Api.CONFIG_CYCLE_LIST}/export`, params);
  downloadByUrl({ url });
};
