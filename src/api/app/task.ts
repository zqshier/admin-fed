import { defHttp } from '/@/utils/http/axios';

enum Api {
  list = '/api/pt/app/tasks',
  logs = '/api/pt/app/tasks/:id/logs',
}

interface IAppTaskLogsParams {
  id: number;
  page: number;
  perPage: number;
}

interface IAppTasksListParams {
  page: number;
  perPage: number;
}

interface IAppTasksItemModel {
  id: number;
  name: string;
}

interface IAppTasksListModel {
  total: number;
  list: IAppTasksItemModel[];
}

interface IAppTasksCreateParams {
  name: string;
  file?: File;
}

/** 群发任务列表 */
export const tasksList = (params: IAppTasksListParams) =>
  defHttp.get<IAppTasksListModel>({ url: Api.list, params }, { errorMessageMode: 'none' });

/** 新建群发任务 */
export const tasksCreate = (params: IAppTasksCreateParams) => {
  if (params.file) {
    const file = params.file;
    delete params.file;
    return defHttp.submitForm<IAppTasksItemModel>({ url: Api.list }, { file, data: params });
  } else {
    return defHttp.post<IAppTasksItemModel>({ url: Api.list, params });
  }
};

/** 群发任务记录 */
export const tasksLogList = (params: IAppTaskLogsParams) =>
  defHttp.get<IAppTasksListModel>(
    {
      url: Api.logs.replace(':id', params.id.toString()),
      params,
    },
    { errorMessageMode: 'none' },
  );
