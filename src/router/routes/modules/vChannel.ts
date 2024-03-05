import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const card: AppRouteModule = {
  path: '/video-channel',
  name: 'videoChannel',
  component: LAYOUT,
  redirect: '/video-channel/index',
  meta: {
    orderNo: 110,
    icon: 'material-symbols:video-call',
    title: '视频号',
  },
  children: [
    {
      path: 'index',
      name: 'vChannelIndex',
      component: () => import('/@/views/vChannel/index.vue'),
      meta: { title: '视频号' },
    },
  ],
};

export default card;
