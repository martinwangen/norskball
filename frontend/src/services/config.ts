import { ref, readonly } from 'vue';
import appSettings from '../config/appsettings.json';

// Define configuration interfaces
export interface ApiConfig {
  base_url: string;
  timeout: number;
}

// Fix the empty interface warning by adding a comment to disable the rule
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthConfig {
  // No Google auth config anymore
}

// Add football API configuration
export interface FootballApiConfig {
  base_url: string;
  api_key: string;
  host: string;
}

export interface FeatureConfig {
  enable_dark_mode: boolean;
  enable_notifications: boolean;
}

export interface DefaultsConfig {
  language: string;
  items_per_page: number;
}

export interface AppSettings {
  api: ApiConfig;
  auth: AuthConfig;
  features: FeatureConfig;
  defaults: DefaultsConfig;
  football_api?: FootballApiConfig; // Make it optional for backward compatibility
}

// Create a reactive configuration object
const config = ref<AppSettings>(appSettings);

// Use environment variable for API URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Update the config line to use the environment variable
config.value.api.base_url = apiBaseUrl;

// Fix the async function without await warning
// eslint-disable-next-line @typescript-eslint/require-await
const loadEnvironmentSettings = async (): Promise<void> => {
  try {
    // In a real app, we might load different settings based on the environment
    // For example, we could load settings from a .env file or from the server

    // For development, we might override some settings
    if (import.meta.env.DEV) {
      console.log('Loading development settings');
      // Example: Override API URL for development

      // Add football API configuration if not present
      if (!config.value.football_api) {
        config.value.football_api = {
          base_url: 'https://v3.football.api-sports.io',
          api_key: import.meta.env.VITE_FOOTBALL_API_KEY || 'YOUR_API_KEY', // Use environment variable if available
          host: 'v3.football.api-sports.io'
        };
      }
    }

    // For production, we might load settings from a different source
    if (import.meta.env.PROD) {
      console.log('Loading production settings');
      try {
        // Example: Load settings from a remote source
        // const response = await fetch('/api/config');
        // const productionSettings = await response.json();
        // config.value = { ...config.value, ...productionSettings };

        // Add football API configuration if not present
        if (!config.value.football_api) {
          config.value.football_api = {
            base_url: 'https://v3.football.api-sports.io',
            api_key: import.meta.env.VITE_FOOTBALL_API_KEY || '', // Use environment variable
            host: 'v3.football.api-sports.io'
          };
        }
      } catch (err) {
        console.error('Failed to load production settings:', err);
      }
    }

    console.log('Configuration loaded:', config.value);
  } catch (err) {
    console.error('Error loading environment settings:', err);
  }
};

// Initialize configuration
loadEnvironmentSettings().catch(err => {
  console.error('Failed to initialize configuration:', err);
});

// Export a readonly version of the configuration
export const appConfig = readonly(config);

// Helper functions to access specific configuration sections
export const getApiConfig = (): ApiConfig => appConfig.value.api;
export const getAuthConfig = (): AuthConfig => appConfig.value.auth;
export const getFeatureConfig = (): FeatureConfig => appConfig.value.features;
export const getDefaultsConfig = (): DefaultsConfig => appConfig.value.defaults;
export const getFootballApiConfig = (): FootballApiConfig | undefined => appConfig.value.football_api;

// Export the configuration service
export const configService = {
  appConfig,
  getApiConfig,
  getAuthConfig,
  getFeatureConfig,
  getDefaultsConfig,
  getFootballApiConfig
};
