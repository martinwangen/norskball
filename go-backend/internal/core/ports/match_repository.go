package ports

//go:generate mockgen -source=repository.go -destination=mocks/match_repository_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/"
)

// Repository defines the interface for match data persistence
type MatchRepository interface {
	List(ctx context.Context, pageSize int32, pageToken string) ([]*domain.Match, string, error)
	Get(ctx context.Context, id string) (*domain.Match, error)
	Create(ctx context.Context, match *domain.Match) (*domain.Match, error)
	Update(ctx context.Context, match *domain.Match) (*domain.Match, error)
	Delete(ctx context.Context, id string) error
}

// Repository defines the interface for lineup data persistence
type LineupRepository interface {
	// Create persists a new lineup
	Create(ctx context.Context, l *domain.Lineup) (*domain.Lineup, error)

	// Get retrieves a lineup by ID
	Get(ctx context.Context, id string) (*domain.Lineup, error)

	// List retrieves a list of lineups with pagination
	List(ctx context.Context, pageSize int32, pageToken string) ([]*domain.Lineup, string, error)

	// Update updates an existing lineup
	Update(ctx context.Context, l *domain.Lineup) (*domain.Lineup, error)

	// Delete removes a lineup by ID
	Delete(ctx context.Context, id string) error

	// FindByMatch retrieves lineups for a specific match
	FindByMatch(ctx context.Context, matchID string, pageSize int32, pageToken string) ([]*domain.Lineup, string, error)

	// FindByTeam retrieves lineups for a specific team
	FindByTeam(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*domain.Lineup, string, error)

	// GetStartingLineup retrieves the starting lineup for a match
	GetStartingLineup(ctx context.Context, matchID string, teamID string) (*domain.Lineup, error)

	// GetSubstituteLineup retrieves the substitute lineup for a match
	GetSubstituteLineup(ctx context.Context, matchID string, teamID string) (*domain.Lineup, error)

	// AddPlayer adds a player to a lineup
	AddPlayer(ctx context.Context, lineupID string, player *domain.LineupPlayer) error

	// RemovePlayer removes a player from a lineup
	RemovePlayer(ctx context.Context, lineupID string, playerID string) error

	// UpdatePlayerPosition updates a player's position in a lineup
	UpdatePlayerPosition(ctx context.Context, lineupID string, playerID string, position domain.PlayerPosition) error

	// SetCaptain sets a player as captain in a lineup
	SetCaptain(ctx context.Context, lineupID string, playerID string) error

	// GetLineupPlayers retrieves all players in a lineup
	GetLineupPlayers(ctx context.Context, lineupID string) ([]*domain.LineupPlayer, error)

	// UpdatePlayerStats updates a player's match statistics
	UpdatePlayerStats(ctx context.Context, lineupID string, playerID string, stats domain.PlayerMatchStats) error
}

// PlayerRepository defines the operations that can be performed on lineup player entities
type LineupPlayerRepository interface {
	// Create a new lineup player
	Create(ctx context.Context, player *domain.LineupPlayer) error

	// Get lineup players by lineup ID
	GetByLineupID(ctx context.Context, lineupID string) ([]domain.LineupPlayer, error)

	// Get lineup players by match ID
	GetByMatchID(ctx context.Context, matchID string) ([]domain.LineupPlayer, error)

	// Update an existing lineup player
	Update(ctx context.Context, player *domain.LineupPlayer) error

	// Delete a lineup player by its ID
	Delete(ctx context.Context, id string) error

	// List all lineup players with pagination
	List(ctx context.Context, pageSize int32, pageToken string) ([]domain.LineupPlayer, string, error)

	// Get players with most goals in a season
	GetTopGoalScorers(ctx context.Context, season string, limit int) ([]domain.LineupPlayer, error)

	// Get players with most assists in a season
	GetTopAssistProviders(ctx context.Context, season string, limit int) ([]domain.LineupPlayer, error)
}

