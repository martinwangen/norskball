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

  // IFrame routes with IFrameLayout
  {
    path: '/iframes',
    component: () => import('layouts/IFrameLayout.vue'),
    children: [
      {
        path: 'statistics/player/:id',
        name: 'player-statistics',
        component: () => import('pages/IFrames/PlayerStatistics.vue'),
        props: true
      },
      {
        path: 'statistics/team/:id',
        name: 'team-statistics',
        component: () => import('pages/IFrames/TeamStatistics.vue'),
        props: true
      },
      {
        path: 'statistics/match/:id',
        name: 'match-ratings',
        component: () => import('pages/IFrames/MatchRatings.vue'),
        props: true
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
