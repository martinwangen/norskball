import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [

  // Main app routes (with layout)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'teams',
        name: 'teams',
        component: () => import('pages/TeamsPage.vue'),
      },
      {
        path: 'teams/:id',
        component: () => import('pages/TeamDetailPage.vue'),
        name: 'team-detail',
        props: true
      },
      {
        path: 'players',
        name: 'players',
        component: () => import('pages/PlayersPage.vue'),
      },
      {
        path: 'players/:id',
        component: () => import('pages/PlayerDetailPage.vue'),
        name: 'player-detail',
        props: true
      },
      // Updated matches route to use the new MatchesPage component
      {
        path: 'matches',
        name: 'matches',
        component: () => import('pages/MatchesPage.vue'),
      },
      {
        path: 'matches/:id',
        component: () => import('pages/MatchDetailPage.vue'),
        name: 'match-detail',
        props: true
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('pages/StatisticsPage.vue'),
      },
      {
        path: 'unauthorized',
        component: () => import('pages/UnauthorizedPage.vue')
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
