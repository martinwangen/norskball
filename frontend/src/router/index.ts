import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from '../stores/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.config.js instead!
    // quasar.config.js -> build -> vueRouterMode
    // quasar.config.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      await authStore.checkAuth();

      if (!authStore.isAuthenticated) {
        return next({ name: 'login' });
      }

      // Check if route requires admin access
      if (to.meta.requiresAdmin && !authStore.user?.roles?.includes('admin')) {
        return next({ name: 'unauthorized' });
      }
    }

    // If authenticated and trying to access login page, redirect to home
    if (to.name === 'login' && authStore.isAuthenticated) {
      return next({ name: 'home' });
    }

    next();
  });

  return Router;
});
