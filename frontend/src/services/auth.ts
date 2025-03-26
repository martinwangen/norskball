import { useAuthStore } from '../stores/auth';
import { apolloClient } from '../boot/apollo';

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: GoogleInitConfig) => void;
      prompt: () => void;
      disableAutoSelect: () => void;
    };
  };
}

interface GoogleInitConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    google: GoogleIdentity;
  }
}

class AuthService {
  private initialized = false;
  private clientId: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!this.clientId) {
      console.error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
    }
  }

  async initializeGoogleSignIn(): Promise<void> {
    if (this.initialized) return;

    if (!this.clientId) {
      throw new Error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
          });
          this.initialized = true;
          resolve();
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
          reject(new Error('Failed to initialize Google Sign-In. Please check your client ID and configuration.'));
        }
      };

      script.onerror = () => {
        console.error('Error loading Google Sign-In script');
        reject(new Error('Failed to load Google Sign-In script. Please check your internet connection.'));
      };

      document.head.appendChild(script);
    });
  }

  private async handleCredentialResponse(response: GoogleCredentialResponse) {
    if (response.credential) {
      const authStore = useAuthStore();
      try {
        // Decode the JWT token to get user information
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        const requestBody = {
          idToken: response.credential,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };

        await authStore.loginWithGoogle(requestBody);
      } catch (error) {
        console.error('Error handling Google credential:', error);
        throw error;
      }
    }
  }

  private decodeJwt(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      throw error;
    }
  }

  async signIn(): Promise<void> {
    if (!this.initialized) {
      await this.initializeGoogleSignIn();
    }
    window.google.accounts.id.prompt();
  }

  async signOut(): Promise<void> {
    const authStore = useAuthStore();
    window.google.accounts.id.disableAutoSelect();
    authStore.logout();
    // Clear Apollo cache
    await apolloClient.clearStore();
  }

  async checkAuth(): Promise<void> {
    const authStore = useAuthStore();
    await authStore.checkAuth();
  }

  isAuthenticated(): boolean {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
  }
}

export const authService = new AuthService();
