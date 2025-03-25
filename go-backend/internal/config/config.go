package config

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds all configuration for the application
type Config struct {
	Server      ServerConfig
	Database    DatabaseConfig
	Logging     LoggingConfig
	FootballAPI FootballAPIConfig
}

// ServerConfig holds server-related configuration
type ServerConfig struct {
	HTTPPort int
	Timeout  time.Duration
}

// DatabaseConfig holds database-related configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
	Timeout  time.Duration
}

// LoggingConfig holds logging-related configuration
type LoggingConfig struct {
	Level string
}

// FootballAPIConfig holds football API configuration
type FootballAPIConfig struct {
	BaseURL string
	APIKey  string
	Host    string
}

// GetDSN returns the database connection string
func (c *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode,
	)
}

// GetConfig returns the application configuration
func GetConfig() Config {
	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))
	serverPort, _ := strconv.Atoi(getEnv("SERVER_PORT", "8080"))

	return Config{
		Server: ServerConfig{
			HTTPPort: serverPort,
			Timeout:  getEnvAsDuration("SERVER_TIMEOUT", 30*time.Second),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     dbPort,
			User:     getEnv("DB_USER", "football"),
			Password: getEnv("DB_PASSWORD", "football123"),
			DBName:   getEnv("DB_NAME", "football"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
			Timeout:  getEnvAsDuration("DB_TIMEOUT", 5*time.Second),
		},
		Logging: LoggingConfig{
			Level: getEnv("LOG_LEVEL", "info"),
		},
		FootballAPI: FootballAPIConfig{
			BaseURL: getEnv("FOOTBALL_API_BASE_URL", "https://v3.football.api-sports.io"),
			APIKey:  getEnv("FOOTBALL_API_KEY", ""),
			Host:    getEnv("FOOTBALL_API_HOST", "v3.football.api-sports.io"),
		},
	}
}

// Helper functions to get environment variables with defaults
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func LoadConfig(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config Config
	if err := json.NewDecoder(file).Decode(&config); err != nil {
		return nil, err
	}

	// Override with environment variables if present
	if port := os.Getenv("SERVER_PORT"); port != "" {
		// Parse port and set it
	}
	if dbHost := os.Getenv("DB_HOST"); dbHost != "" {
		config.Database.Host = dbHost
	}
	// Add other environment variable overrides as needed

	return &config, nil
}

func (dc *DatabaseConfig) ConnectionString() string {
	return "postgres://" + dc.User + ":" + dc.Password + "@" +
		dc.Host + ":" + string(dc.Port) + "/" + dc.DBName + "?sslmode=" + dc.SSLMode
}
