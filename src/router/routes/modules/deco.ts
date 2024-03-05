import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const deco: AppRouteModule = {
  path: '/deco',
  name: 'Deco',
  component: LAYOUT,
  redirect: '/deco/list',
  meta: {
    orderNo: 10,
    icon: 'ion:storefront-outline',
    title: '店铺装修',
  },
  children: [
    {
      path: 'banners',
      name: 'BannerList',
      component: () => import('/@/views/deco/banners/index.vue'),
      meta: {
        // affix: true,
        title: 'Banner管理',
      },
    },
    {
      path: 'coupons',
      name: 'CouponsCenter',
      component: () => import('/@/views/deco/coupons/index.vue'),
      meta: {
        // affix: true,
        title: '活动券配置',
      },
    },
    {
      path: 'topics',
      name: 'TopicsList',
      component: () => import('/@/views/deco/topics/index.vue'),
      meta: {
        // affix: true,
        title: 'tab组',
      },
    },
    {
      path: 'topics/groups',
      name: 'TopicsGroupsList',
      component: () => import('/@/views/deco/topics/groups/index.vue'),
      meta: {
        // affix: true,
        title: 'tab模块',
      },
    },
    {
      path: 'documents',
      name: 'Documents',
      component: () => import('/@/views/deco/document/index.vue'),
      meta: {
        // affix: true,
        title: '文档管理',
      },
    },
    {
      path: 'contents',
      name: 'Contents',
      component: () => import('/@/views/deco/contents/index.vue'),
      meta: {
        // affix: true,
        title: '内容配置',
      },
    },
  ],
};

export default deco;
