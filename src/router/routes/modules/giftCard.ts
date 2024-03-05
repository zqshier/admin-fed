import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const card: AppRouteModule = {
  path: '/gift-card',
  name: 'GiftCard',
  component: LAYOUT,
  redirect: '/gift-card/list',
  meta: {
    orderNo: 90,
    icon: 'mdi:credit-card-check-outline',
    title: '卡中心',
  },
  children: [
    {
      path: 'list',
      name: 'GiftCardList',
      component: () => import('/@/views/giftCard/list/index.vue'),
      meta: {
        // affix: true,
        title: '卡列表',
      },
    },
    {
      path: 'query',
      name: 'GiftCardQuery',
      component: () => import('/@/views/giftCard/query/index.vue'),
      meta: {
        title: '卡查询',
      },
    },
    {
      path: 'consume',
      name: 'GiftConsumeRecord',
      component: () => import('/@/views/giftCard/consume/index.vue'),
      meta: {
        title: '消费记录',
      },
    },
  ],
};

export default card;
