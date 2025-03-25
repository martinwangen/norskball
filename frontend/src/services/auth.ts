import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

// Authentication state
const isAuthenticated = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

// API Key
const API_KEY = 'rabonaPod';

// Initialize auth state from localStorage
const initAuth = () => {
  try {
    const storedAuth = localStorage.getItem('auth_authenticated');
    if (storedAuth) {
      isAuthenticated.value = JSON.parse(storedAuth);
    }
  } catch (err) {
    console.error('Error initializing auth:', err);
    localStorage.removeItem('auth_authenticated');
  }
};

// Login with API key
const login = async (): Promise<boolean> => {
  isLoading.value = true;
  error.value = null;

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Set authentication state
    isAuthenticated.value = true;
    localStorage.setItem('auth_authenticated', 'true');
    return true;
  } catch (err) {
    console.error('Error logging in:', err);
    error.value = 'Failed to login. Please try again.';
    throw err;
  } finally {
    isLoading.value = false;
  }
};

// Logout
const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem('auth_authenticated');

  // Get router instance
  const router = useRouter();

  // Redirect to login page
  if (router) {
    void router.push('/login');
  }
};

// Check if user is authenticated
const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!isAuthenticated.value) {
    // Store the intended destination
    localStorage.setItem('auth_redirect', to.fullPath);
    next('/login');
  } else {
    next();
  }
};

// Initialize auth on module load
initAuth();

// Export auth service
export const authService = {
  isAuthenticated,
  isLoading,
  error,
  login,
  logout,
  requireAuth,
  API_KEY
};
