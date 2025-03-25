package ports

//go:generate mockgen -source=service.go -destination=mocks/match_service_mock.go -package=mocks

import (
	"context"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
)

// Service defines the interface for match-related operations
type MatchService interface {
	// CreateMatch creates a new match
	CreateMatch(ctx context.Context, m *domain.Match) (*domain.Match, error)

	// GetMatch retrieves a match by ID
	GetMatch(ctx context.Context, id string) (*domain.Match, error)

	// ListMatches retrieves a list of matches with pagination
	ListMatches(ctx context.Context, pageSize int32, pageToken string) ([]*domain.Match, string, error)

	// UpdateMatch updates an existing match
	UpdateMatch(ctx context.Context, m *domain.Match) (*domain.Match, error)

	// DeleteMatch removes a match by ID
	DeleteMatch(ctx context.Context, id string) error

	// FindMatchesByTeam retrieves matches involving a specific team
	FindMatchesByTeam(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*domain.Match, string, error)

	// FindMatchesByDateRange retrieves matches played within a date range
	FindMatchesByDateRange(ctx context.Context, startDate, endDate time.Time, pageSize int32, pageToken string) ([]*domain.Match, string, error)

	// UpdateMatchStatus updates the status of a match
	UpdateMatchStatus(ctx context.Context, matchID string, status string) error
	
	// StartMatch changes a match status to in-progress
	StartMatch(ctx context.Context, matchID string) error

	// EndMatch finalizes a match, updates all statistics and league tables
	EndMatch(ctx context.Context, matchID string) error
}

// LineupService defines the interface for lineup-related operations
type LineupService interface {
	// CreateLineup creates a new lineup
	CreateLineup(ctx context.Context, l *match.Lineup) (*match.Lineup, error)

	// GetLineup retrieves a lineup by ID
	GetLineup(ctx context.Context, id string) (*match.Lineup, error)

	// ListLineups retrieves a list of lineups with pagination
	ListLineups(ctx context.Context, pageSize int32, pageToken string) ([]*match.Lineup, string, error)

	// UpdateLineup updates an existing lineup
	UpdateLineup(ctx context.Context, l *match.Lineup) (*match.Lineup, error)

	// DeleteLineup removes a lineup by ID
	DeleteLineup(ctx context.Context, id string) error

	// FindLineupsByMatch retrieves lineups for a specific match
	FindLineupsByMatch(ctx context.Context, matchID string, pageSize int32, pageToken string) ([]*match.Lineup, string, error)

	// GetStartingLineup retrieves the starting lineup for a match
	GetStartingLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error)

	// GetSubstituteLineup retrieves the substitute lineup for a match
	GetSubstituteLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error)

	// AddPlayerToLineup adds a player to a lineup
	AddPlayerToLineup(ctx context.Context, lineupID string, player *match.LineupPlayer) error

	// RemovePlayerFromLineup removes a player from a lineup
	RemovePlayerFromLineup(ctx context.Context, lineupID string, playerID string) error

	// UpdatePlayerPosition updates a player's position in a lineup
	UpdatePlayerPosition(ctx context.Context, lineupID string, playerID string, position match.PlayerPosition) error

	// SetTeamCaptain sets a player as captain in a lineup
	SetTeamCaptain(ctx context.Context, lineupID string, playerID string) error

	// GetLineupPlayers retrieves all players in a lineup
	GetLineupPlayers(ctx context.Context, lineupID string) ([]*match.LineupPlayer, error)

	// UpdatePlayerMatchStats updates a player's match statistics
	UpdatePlayerMatchStats(ctx context.Context, lineupID string, playerID string, stats match.PlayerMatchStats) error

	// ValidateLineup validates if a lineup follows the rules
	ValidateLineup(ctx context.Context, l *match.Lineup) error

	// GetFormation retrieves the formation of a lineup
	GetFormation(ctx context.Context, lineupID string) (match.Formation, error)

	// UpdateFormation updates the formation of a lineup
	UpdateFormation(ctx context.Context, lineupID string, formation match.Formation) error

	// GetSubstitutes retrieves all substitute players
	GetSubstitutes(ctx context.Context, lineupID string) ([]*match.LineupPlayer, error)

	// GetStartingPlayers retrieves all starting players
	GetStartingPlayers(ctx context.Context, lineupID string) ([]*match.LineupPlayer, error)
}
