import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const uicodes: AppRouteModule = {
  path: '/uicode',
  name: 'UIcode',
  component: LAYOUT,
  redirect: '/uicode/list',
  meta: {
    orderNo: 29,
    icon: 'ic:baseline-qr-code',
    title: '防伪验真',
  },
  children: [
    {
      path: 'list',
      name: 'UIcodeList',
      component: () => import('/@/views/uicode/list/index.vue'),
      meta: { title: '任务列表' },
    },
    {
      path: 'query',
      name: 'UIcodeQuery',
      component: () => import('/@/views/uicode/query/index.vue'),
      meta: { title: '明码查询' },
    },
    {
      path: 'codes',
      name: 'UIcodeCodes',
      component: () => import('/@/views/uicode/codes/index.vue'),
      meta: { title: '防伪验真码追溯' },
    },
    {
      path: 'records',
      name: 'UIcodeRecords',
      component: () => import('/@/views/uicode/records/index.vue'),
      meta: { title: '扫码记录' },
    },
    {
      path: 'staging',
      name: 'UIcodeStaging',
      component: () => import('/@/views/uicode/staging/index.vue'),
      meta: { title: '扫码绑定商品' },
    },
    {
      path: 'adtRecords',
      name: 'UIcodeAdtRecords',
      component: () => import('/@/views/uicode/adtRecords/index.vue'),
      meta: { title: '绑定统计' },
    },
    {
      path: 'distributors',
      name: 'UIcodeDistributors',
      component: () => import('/@/views/uicode/distributors/index.vue'),
      meta: { title: '经销商管理' },
    },
    {
      path: 'products',
      name: 'UIcodeProducts',
      component: () => import('/@/views/uicode/products/index.vue'),
      meta: { title: '产品主数据' },
    },
  ],
};

export default uicodes;
