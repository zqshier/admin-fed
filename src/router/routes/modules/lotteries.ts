import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const deco: AppRouteModule = {
  path: '/lotteries',
  name: 'Lotteries',
  component: LAYOUT,
  redirect: '/lotteries/awards',
  meta: {
    orderNo: 80,
    icon: 'ion:ribbon-outline',
    title: '抽奖活动',
  },
  children: [
    {
      path: 'awards',
      name: 'LotteriesAwards',
      component: () => import('/@/views/lotteries/awards/index.vue'),
      meta: {
        title: '奖品列表',
      },
    },
    {
      path: 'list',
      name: 'LotteriesList',
      component: () => import('/@/views/lotteries/list/index.vue'),
      meta: {
        title: '奖池列表',
      },
    },
    {
      path: 'recommend',
      name: 'RecommendList',
      component: () => import('/@/views/lotteries/recommend/index.vue'),
      meta: {
        title: '奖池任务',
      },
    },
  ],
};

export default deco;
