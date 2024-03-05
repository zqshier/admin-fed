import { defHttp } from '/@/utils/http/axios';

enum Api {
  OmsRule = '/api/pt/app/sys/oms/rules/:name',
}

export function getOmsPointsRule(name: string) {
  return defHttp.get({
    url: Api.OmsRule.replace(':name', name),
  });
}

export function updateOmsPointsRule(name: string, params: any) {
  return defHttp.put({
    url: Api.OmsRule.replace(':name', name),
    params,
  });
}
