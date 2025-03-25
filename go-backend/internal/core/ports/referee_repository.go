package ports

//go:generate mockgen -source=repository.go -destination=mocks/referee_repository_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/common"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
)

// Repository defines the interface for referee data persistence
type RefereeRepository interface {
	// Create persists a new referee
	Create(ctx context.Context, r *common.Referee) (*common.Referee, error)

	// Get retrieves a referee by ID
	Get(ctx context.Context, id string) (*common.Referee, error)

	// List retrieves a list of referees with pagination
	List(ctx context.Context, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// Update updates an existing referee
	Update(ctx context.Context, r *common.Referee) (*common.Referee, error)

	// Delete removes a referee by ID
	Delete(ctx context.Context, id string) error

	// FindByCountry retrieves referees from a specific country
	FindByCountry(ctx context.Context, country string, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// FindByLevel retrieves referees of a specific level
	FindByLevel(ctx context.Context, level string, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// ListMatches retrieves matches officiated by a referee with pagination
	ListMatches(ctx context.Context, refereeID string, pageSize int32, pageToken string) ([]*match.Match, string, error)
}
