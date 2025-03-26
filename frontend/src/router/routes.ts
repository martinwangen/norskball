import type { RouteRecordRaw } from 'vue-router';
import './types';

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
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'teams',
        name: 'teams',
        component: () => import('pages/TeamsPage.vue'),
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'teams/:id',
        component: () => import('pages/TeamDetailPage.vue'),
        name: 'team-detail',
        props: true,
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'players',
        name: 'players',
        component: () => import('pages/PlayersPage.vue'),
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'players/:id',
        component: () => import('pages/PlayerDetailPage.vue'),
        name: 'player-detail',
        props: true,
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'matches',
        name: 'matches',
        component: () => import('pages/MatchesPage.vue'),
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'matches/:id',
        component: () => import('pages/MatchDetailPage.vue'),
        name: 'match-detail',
        props: true,
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('pages/StatisticsPage.vue'),
        meta: {
          requiresAuth: false,
          allowAnonymous: true,
          allowedActions: ['view']
        }
      },
      {
        path: 'unauthorized',
        component: () => import('pages/UnauthorizedPage.vue'),
        meta: {
          requiresAuth: false,
          allowAnonymous: true
        }
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
        props: true,
        meta: {
          requiresAuth: true,
          allowedActions: ['view', 'create', 'edit']
        }
      },
      {
        path: 'statistics/team/:id',
        name: 'team-statistics',
        component: () => import('pages/IFrames/TeamStatistics.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          allowedActions: ['view', 'create', 'edit']
        }
      },
      {
        path: 'statistics/match/:id',
        name: 'match-ratings',
        component: () => import('pages/IFrames/MatchRatings.vue'),
        props: true,
        meta: {
          requiresAuth: true,
          allowedActions: ['view', 'create', 'edit']
        }
      }
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      requiresAuth: false,
      allowAnonymous: true
    }
  },
];

export default routes;
