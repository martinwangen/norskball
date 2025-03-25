package common

import (
	"time"
)

// IDGenerator defines an interface for generating unique IDs
type IDGenerator interface {
	GenerateID(prefix string) string
}

// TimestampIDGenerator generates timestamp-based IDs
type TimestampIDGenerator struct{}

// GenerateID generates a unique ID with the given prefix
func (g *TimestampIDGenerator) GenerateID(prefix string) string {
	return prefix + "_" + time.Now().Format("20060102150405")
}

// Entity defines common fields for all domain entities
type Entity struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// NewEntity creates a new entity with the given ID
func NewEntity(id string) Entity {
	now := time.Now()
	return Entity{
		ID:        id,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// Touch updates the UpdatedAt field to the current time
func (e *Entity) Touch() {
	e.UpdatedAt = time.Now()
}

// WeatherCondition represents weather conditions for a match
type WeatherCondition string

// Weather conditions
const (
	WeatherSunny    WeatherCondition = "SUNNY"
	WeatherCloudy   WeatherCondition = "CLOUDY"
	WeatherRainy    WeatherCondition = "RAINY"
	WeatherSnowy    WeatherCondition = "SNOWY"
	WeatherFoggy    WeatherCondition = "FOGGY"
	WeatherWindy    WeatherCondition = "WINDY"
	WeatherStormy   WeatherCondition = "STORMY"
	WeatherHeatwave WeatherCondition = "HEATWAVE"
	WeatherFreezing WeatherCondition = "FREEZING"
)

// SortDirection represents the direction of sorting
type SortDirection string

// Sort directions
const (
	SortAscending  SortDirection = "ASC"
	SortDescending SortDirection = "DESC"
)

// PaginationParams contains parameters for pagination
type PaginationParams struct {
	Page     int `json:"page"`
	PageSize int `json:"page_size"`
}

// SortParams contains parameters for sorting
type SortParams struct {
	Field     string        `json:"field"`
	Direction SortDirection `json:"direction"`
}

// FilterParams contains parameters for filtering
type FilterParams struct {
	Field string      `json:"field"`
	Value interface{} `json:"value"`
}

// QueryParams combines pagination, sorting, and filtering parameters
type QueryParams struct {
	Pagination PaginationParams `json:"pagination"`
	Sort       []SortParams     `json:"sort"`
	Filters    []FilterParams   `json:"filters"`
}
