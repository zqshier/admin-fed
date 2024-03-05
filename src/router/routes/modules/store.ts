import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const stores: AppRouteModule = {
  path: '/stores',
  name: 'Store',
  component: LAYOUT,
  redirect: '/stores/list',
  meta: {
    orderNo: 50,
    icon: 'ion:bag-handle-outline',
    title: '门店管理',
  },
  children: [
    {
      path: 'list',
      name: 'StoreList',
      component: () => import('/@/views/stores/list/index.vue'),
      meta: {
        // affix: true,
        title: '门店列表',
      },
    },
    {
      path: 'guide',
      name: 'StoreGuide',
      component: () => import('/@/views/stores/guide/index.vue'),
      meta: {
        title: '导购',
      },
    },
  ],
};

export default stores;
