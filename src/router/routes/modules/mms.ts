import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const deco: AppRouteModule = {
  path: '/mms',
  name: 'Mms',
  component: LAYOUT,
  redirect: '/mms/list',
  meta: {
    orderNo: 60,
    icon: 'ri:coupon-line',
    title: '营销资源',
  },
  children: [
    {
      path: 'coupons',
      name: 'CouponsList',
      component: () => import('/@/views/mms/coupons/index.vue'),
      meta: {
        title: '优惠券管理',
      },
    },
    {
      path: 'birthday',
      name: 'Birthday',
      component: () => import('/@/views/mms/birthday/index.vue'),
      meta: {
        title: '生日礼',
      },
    },
    {
      path: 'newcomer',
      name: 'Newcomer',
      component: () => import('/@/views/mms/newcomer/index.vue'),
      meta: {
        title: '新人礼',
      },
    },
    {
      path: 'pointmall',
      name: 'Pointmall',
      component: () => import('/@/views/mms/pointmall/index.vue'),
      meta: { title: '积分商城' },
    },
    {
      path: 'drawLots',
      name: 'DrawLots',
      component: () => import('/@/views/mms/drawLots/index.vue'),
      meta: {
        title: '抽签',
      },
    },
    {
      path: 'buyout',
      name: 'Buyout',
      component: () => import('/@/views/mms/buyout/index.vue'),
      meta: {
        title: '一口价',
      },
    },
    {
      path: 'friendPower',
      name: 'FriendPower',
      component: () => import('/@/views/mms/friendPower/index.vue'),
      meta: {
        title: '助力活动',
      },
    },
    {
      path: 'activity',
      name: 'Activity',
      component: () => import('/@/views/mms/activity/index.vue'),
      meta: { title: '活动列表' },
    },
    {
      path: 'links',
      name: 'Links',
      component: () => import('/@/views/mms/links/index.vue'),
      meta: {
        title: '短链生成',
      },
    },
  ],
};

export default deco;
