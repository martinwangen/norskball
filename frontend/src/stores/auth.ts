import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apolloClient } from '../boot/apollo';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  roles?: string[];
}

interface AuthResponse {
  user: User;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const token = ref<string | null>(null);
  const isAdmin = ref(false);

  // Initialize from localStorage
  const storedToken = localStorage.getItem('auth_token');
  if (storedToken) {
    token.value = storedToken;
    isAuthenticated.value = true;
  }

  function setUser(newUser: User | null) {
    console.log('Setting user:', newUser);
    user.value = newUser;
    isAdmin.value = newUser?.roles?.includes('admin') ?? false;
  }

  async function loginWithGoogle(requestBody: { idToken: string; email: string; name: string; picture: string }) {
    try {
      console.log('Attempting Google login with:', requestBody);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data: AuthResponse = await response.json();
      console.log('Received auth response:', data);

      // Store user and token
      setUser(data.user);
      token.value = data.token;
      isAuthenticated.value = true;
      localStorage.setItem('auth_token', data.token);

      // Reset Apollo cache with new auth state
      await apolloClient.resetStore();

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout(): void {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth_token');
    // Reset Apollo cache
    apolloClient.resetStore().catch(error => {
      console.error('Error resetting Apollo cache:', error);
    });
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('auth_token');
    console.log('Checking auth with stored token:', storedToken);

    if (!storedToken) {
      isAuthenticated.value = false;
      user.value = null;
      token.value = null;
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      user.value = data;
      token.value = storedToken;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Token verification error:', error);
      isAuthenticated.value = false;
      user.value = null;
      token.value = null;
      localStorage.removeItem('auth_token');
      // Reset Apollo cache on auth error
      apolloClient.resetStore().catch(error => {
        console.error('Error resetting Apollo cache:', error);
      });
    }
  }

  function getToken(): string | null {
    return token.value || localStorage.getItem('auth_token');
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    token,
    loginWithGoogle,
    logout,
    checkAuth,
    getToken,
  };
});
