package ports

//go:generate mockgen -source=service.go -destination=mocks/referee_service_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/common"
)

// Service defines the interface for referee-related operations
type RefereeService interface {
	// CreateReferee creates a new referee
	CreateReferee(ctx context.Context, r *common.Referee) (*common.Referee, error)

	// GetReferee retrieves a referee by ID
	GetReferee(ctx context.Context, id string) (*common.Referee, error)

	// ListReferees retrieves a list of referees with pagination
	ListReferees(ctx context.Context, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// UpdateReferee updates an existing referee
	UpdateReferee(ctx context.Context, r *common.Referee) (*common.Referee, error)

	// DeleteReferee removes a referee by ID
	DeleteReferee(ctx context.Context, id string) error

	// FindRefereesByCountry retrieves referees from a specific country
	FindRefereesByCountry(ctx context.Context, country string, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// FindRefereesByLevel retrieves referees of a specific level
	FindRefereesByLevel(ctx context.Context, level string, pageSize int32, pageToken string) ([]*common.Referee, string, error)

	// GetRefereeMatches retrieves matches officiated by a referee
	GetRefereeMatches(ctx context.Context, refereeID string, pageSize int32, pageToken string) ([]*match.Match, string, error)

	// CalculateRefereeStats calculates statistics for a referee based on matches officiated
	CalculateRefereeStats(ctx context.Context, refereeID string) (*common.Referee, error)

	// AssignRefereeToMatch assigns a referee to a match
	AssignRefereeToMatch(ctx context.Context, refereeID string, matchID string) error

	// RemoveRefereeFromMatch removes a referee assignment from a match
	RemoveRefereeFromMatch(ctx context.Context, matchID string) error

	// GetTopRefereesByYellowCards retrieves referees who issued the most yellow cards
	GetTopRefereesByYellowCards(ctx context.Context, limit int) ([]*common.Referee, error)

	// GetTopRefereesByRedCards retrieves referees who issued the most red cards
	GetTopRefereesByRedCards(ctx context.Context, limit int) ([]*common.Referee, error)
}
