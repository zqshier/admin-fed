import type { AppRouteModule } from '/@/router/types';

import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '/@/router/constant';

const welcome: AppRouteModule = {
  path: '/welcome',
  name: 'Welcome',
  component: LAYOUT,
  redirect: '/welcome',
  meta: {
    hideMenu: true,
    title: t('routes.basic.welcome'),
  },
  children: [
    {
      path: '',
      name: 'WelcomeIndex',
      component: () => import('/@/views/welcome/index.vue'),
      meta: { title: t('routes.basic.welcome'), hideMenu: true },
    },
  ],
};

export default welcome;
