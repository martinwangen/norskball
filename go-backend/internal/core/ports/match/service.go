package match

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
)

// Service defines the interface for match operations
type MatchService interface {
	// Match operations
	ListMatches(ctx context.Context, pageSize int32, pageToken string) ([]*match.Match, string, error)
	GetMatch(ctx context.Context, id string) (*match.Match, error)
	CreateMatch(ctx context.Context, match *match.Match) (*match.Match, error)
	UpdateMatch(ctx context.Context, match *match.Match) (*match.Match, error)
	DeleteMatch(ctx context.Context, id string) error

	// Lineup operations within match context
	UpdateMatchLineup(ctx context.Context, matchID string, teamID string, lineup *match.Lineup) (*match.Match, error)
}

// LineupService defines the interface for lineup operations
type LineupService interface {
	GetLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error)
	UpdateLineup(ctx context.Context, lineup *match.Lineup) (*match.Lineup, error)
	DeleteLineup(ctx context.Context, matchID string, teamID string) error
}
