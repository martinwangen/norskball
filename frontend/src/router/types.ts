import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // Basic auth flags
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    // Action-based permissions
    allowAnonymous?: boolean;
    allowedActions?: Array<'view' | 'create' | 'edit' | 'delete'>;
  }
}
