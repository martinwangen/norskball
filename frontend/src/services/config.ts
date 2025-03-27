import { ref, readonly } from 'vue';

// Define configuration interfaces
export interface ApiConfig {
  base_url: string;
  timeout: number;
}

export interface AuthConfig {
  token_expiry_minutes: number;
  refresh_token_expiry_days: number;
}



export interface FeatureConfig {
  enable_dark_mode: boolean;
  enable_notifications: boolean;
}

export interface DefaultsConfig {
  language: string;
  items_per_page: number;
}

export interface LoggingConfig {
  log_level: string;
  enable_console_logging: boolean;
  enable_file_logging: boolean;
}

export interface AppSettings {
  api: ApiConfig;
  auth: AuthConfig;
  features: FeatureConfig;
  defaults: DefaultsConfig;
  logging: LoggingConfig;
}

// Create a reactive configuration object with default values
const config = ref<AppSettings>({
  api: {
    base_url: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000
  },
  auth: {
    token_expiry_minutes: Number(import.meta.env.VITE_TOKEN_EXPIRY_MINUTES) || 60,
    refresh_token_expiry_days: Number(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY_DAYS) || 7
  },
  features: {
    enable_dark_mode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    enable_notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true'
  },
  defaults: {
    language: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    items_per_page: Number(import.meta.env.VITE_ITEMS_PER_PAGE) || 20
  },
  logging: {
    log_level: import.meta.env.VITE_LOG_LEVEL || 'info',
    enable_console_logging: import.meta.env.VITE_ENABLE_CONSOLE_LOGGING === 'true',
    enable_file_logging: import.meta.env.VITE_ENABLE_FILE_LOGGING === 'true'
  }
});


// Export the configuration as readonly to prevent accidental modifications
export const appConfig = readonly(config);

// Export individual configuration sections for convenience
export const apiConfig = readonly(config.value.api);
export const authConfig = readonly(config.value.auth);
export const featureConfig = readonly(config.value.features);
export const defaultsConfig = readonly(config.value.defaults);
export const loggingConfig = readonly(config.value.logging);
