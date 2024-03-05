import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const article: AppRouteModule = {
  path: '/article',
  name: 'Article',
  component: LAYOUT,
  redirect: '/article/list',
  meta: {
    orderNo: 90,
    icon: 'majesticons:article-search-line',
    title: '内容管理',
  },
  children: [
    {
      path: 'list',
      name: 'ArticleList',
      component: () => import('/@/views/article/list/index.vue'),
      meta: {
        // affix: true,
        title: '内容社区',
      },
    },
    {
      path: 'vaccount',
      name: 'VirtualAccount',
      component: () => import('/@/views/article/vaccount/index.vue'),
      meta: {
        title: '虚拟账号管理',
      },
    },
    {
      path: 'questionnaire',
      name: 'Questionnaire',
      component: () => import('/@/views/article/questionnaire/index.vue'),
      meta: { title: '调查问卷' },
    },
  ],
};

export default article;
