import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const deco: AppRouteModule = {
  path: '/qrcodes',
  name: 'Qrcodes',
  component: LAYOUT,
  redirect: '/qrcodes/list',
  meta: {
    orderNo: 70,
    icon: 'ion:qr-code-outline',
    title: '一物一码',
  },
  children: [
    {
      path: 'list',
      name: 'QrcodesList',
      component: () => import('/@/views/qrcodes/list/index.vue'),
      meta: {
        title: '一物一码列表',
      },
    },
  ],
};

export default deco;
