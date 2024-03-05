import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const stores: AppRouteModule = {
  path: '/business',
  name: 'Business',
  component: LAYOUT,
  redirect: '/business/list',
  meta: {
    orderNo: 100,
    icon: 'ic:baseline-add-business',
    title: '商家管理',
  },
  children: [
    {
      path: 'list',
      name: 'BusinessList',
      component: () => import('/@/views/business/list/index.vue'),
      meta: { title: '门店审核' },
    },
    {
      path: 'store',
      name: 'BusinessStore',
      component: () => import('/@/views/business/store/index.vue'),
      meta: { title: '门店汇总' },
    },
  ],
};

export default stores;
