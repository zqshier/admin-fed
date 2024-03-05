import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const deco: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/delivery',
  meta: {
    orderNo: 1000,
    icon: 'ion:settings-outline',
    title: '系统设置',
  },
  children: [
    {
      path: 'member',
      name: 'Member',
      component: () => import('/@/views/system/member/index.vue'),
      meta: {
        title: '成员管理',
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('/@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'menu',
      name: 'Menu',
      component: () => import('/@/views/system/menu/index.vue'),
      meta: {
        title: '菜单管理',
      },
    },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      meta: {
        hideMenu: true,
        title: '修改密码',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/password/index.vue'),
    },
    // {
    //   path: 'api',
    //   name: 'Api',
    //   component: () => import('/@/views/system/api/index.vue'),
    //   meta: {
    //     title: 'API管理',
    //   },
    // },
    {
      path: 'delivery',
      name: 'Delivery',
      component: () => import('/@/views/system/delivery/index.vue'),
      meta: {
        title: '运费模版',
      },
    },
    {
      path: 'score/rule',
      name: 'ScoreRule',
      component: () => import('/@/views/system/score/rule.vue'),
      meta: {
        title: '积分规则',
      },
    },
    {
      path: 'mission',
      name: 'Mission',
      component: () => import('/@/views/system/newMission/index.vue'),
      meta: {
        title: '任务管理',
      },
    },
    {
      path: 'signIn',
      name: 'SignIn',
      component: () => import('/@/views/system/signIn/index.vue'),
      meta: { title: '签到规则' },
    },
  ],
};

export default deco;
