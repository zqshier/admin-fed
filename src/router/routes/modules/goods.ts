import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const goods: AppRouteModule = {
  path: '/goods',
  name: 'Goods',
  component: LAYOUT,
  redirect: '/goods/list',
  meta: {
    orderNo: 20,
    icon: 'ion:cube-outline',
    title: '商品管理',
  },
  children: [
    {
      path: 'list',
      name: 'GoodsList',
      component: () => import('/@/views/goods/list/index.vue'),
      meta: {
        // affix: true,
        title: '商品列表',
      },
    },
    {
      path: 'catalogs',
      name: 'GoodsCatalog',
      component: () => import('/@/views/goods/catalogs/index.vue'),
      meta: {
        // affix: true,
        title: '商品分组',
      },
    },
    {
      path: 'kinds',
      name: 'GoodsKinds',
      component: () => import('/@/views/goods/kinds/index.vue'),
      meta: { title: '商品品类' },
    },
    {
      path: 'price',
      name: 'GoodsPrice',
      component: () => import('/@/views/goods/price/index.vue'),
      meta: {
        // affix: true,
        title: '价格',
      },
    },
    {
      path: 'stock',
      name: 'GoodsStock',
      component: () => import('/@/views/goods/stock/index.vue'),
      meta: {
        // affix: true,
        title: '库存',
      },
    },
    {
      path: 'booking',
      name: 'GoodsBooking',
      component: () => import('/@/views/goods/booking/index.vue'),
      meta: {
        // affix: true,
        title: '预约',
      },
    },
    {
      path: 'properties',
      name: 'GoodsProperties',
      component: () => import('/@/views/goods/properties/index.vue'),
      meta: {
        title: '分组参数',
      },
    },
    {
      path: 'rating',
      name: 'GoodsRating',
      component: () => import('/@/views/goods/rating/index.vue'),
      meta: {
        title: '商品评分',
      },
    },
    {
      path: 'favorites',
      name: 'GoodsFavorites',
      component: () => import('/@/views/goods/favorites/index.vue'),
      meta: {
        title: '商品收藏',
      },
    },
    {
      path: 'recommend',
      name: 'GoodsRecommend',
      component: () => import('/@/views/goods/recommend/index.vue'),
      meta: { title: '猜你喜欢' },
    },
  ],
};

export default goods;
