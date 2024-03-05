import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const users: AppRouteModule = {
  path: '/users',
  name: 'Users',
  component: LAYOUT,
  redirect: '/users/list',
  meta: {
    orderNo: 40,
    icon: 'ion:people-circle-outline',
    title: '用户管理',
  },
  children: [
    {
      path: 'list',
      name: 'UsersList',
      component: () => import('/@/views/users/list/index.vue'),
      meta: {
        // affix: true,
        title: '用户列表',
      },
    },
    {
      path: 'detail/:id',
      name: 'UsersDetail',
      meta: {
        hideMenu: true,
        title: '用户详情',
        ignoreKeepAlive: true,
        currentActiveMenu: '/users/detail',
      },
      component: () => import('/@/views/users/list/detail.vue'),
    },
    {
      path: 'tags',
      name: 'UsersTag',
      component: () => import('/@/views/users/tags/index.vue'),
      meta: {
        // affix: true,
        title: '用户标签',
      },
    },
    {
      path: 'rights',
      name: 'UsersRights',
      component: () => import('/@/views/users/rights/index.vue'),
      meta: {
        // affix: true,
        title: '会员权益',
      },
    },
    {
      path: 'mass',
      name: 'UsersMass',
      component: () => import('/@/views/users/mass/index.vue'),
      meta: {
        // affix: true,
        title: '群发任务',
      },
    },
    {
      path: 'scoreList',
      name: 'ScoreList',
      component: () => import('/@/views/users/scoreList/index.vue'),
      meta: { title: '积分明细' },
    },
    {
      path: 'memberLevels',
      name: 'MemberLevels',
      component: () => import('/@/views/system/memberLevels/index.vue'),
      meta: { title: '会员等级' },
    },
    {
      path: 'userMedal',
      name: 'UserMedal',
      component: () => import('/@/views/users/medal/index.vue'),
      meta: { title: '会员勋章' },
    },
  ],
};

export default users;
