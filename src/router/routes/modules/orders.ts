import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const orders: AppRouteModule = {
  path: '/orders',
  name: 'Orders',
  component: LAYOUT,
  redirect: '/orders/list',
  meta: {
    orderNo: 30,
    icon: 'ion:receipt-outline',
    title: '订单管理',
  },
  children: [
    {
      path: 'list',
      name: 'OrdersList',
      component: () => import('/@/views/orders/list/index.vue'),
      meta: {
        // affix: true,
        title: '订单列表',
      },
    },
    {
      path: 'detail/:orderNo',
      name: 'OrdersDetail',
      meta: {
        hideMenu: true,
        title: '订单详情',
        ignoreKeepAlive: true,
        currentActiveMenu: '/orders/detail',
      },
      component: () => import('/@/views/orders/list/detail.vue'),
    },
    {
      path: 'service',
      name: 'OrdersService',
      component: () => import('/@/views/orders/service/index.vue'),
      meta: {
        // affix: true,
        title: '退款管理',
      },
    },
    {
      path: 'pointList',
      name: 'OrdersPointList',
      component: () => import('/@/views/orders/pointList/index.vue'),
      meta: { title: '积分订单' },
    },
    {
      path: 'pointDetail/:orderNo',
      name: 'OrdersPointDetail',
      meta: {
        hideMenu: true,
        title: '积分订单详情',
        ignoreKeepAlive: true,
        currentActiveMenu: '/orders/pointDetail',
      },
      component: () => import('/@/views/orders/pointList/detail.vue'),
    },
    {
      path: 'conversion',
      name: 'OrdersConversion',
      component: () => import('/@/views/orders/conversion/index.vue'),
      meta: { title: '订单转化' },
    },
    {
      path: 'conDetail/:orderId',
      name: 'OrdersConDetail',
      meta: {
        hideMenu: true,
        title: '订单转化详情',
        ignoreKeepAlive: true,
        currentActiveMenu: '/orders/conDetail',
      },
      component: () => import('/@/views/orders/conversion/detail.vue'),
    },
    {
      path: 'evaluate',
      name: 'OrdersEvaluate',
      component: () => import('/@/views/orders/evaluate/index.vue'),
      meta: { title: '评价记录' },
    },
  ],
};

export default orders;
