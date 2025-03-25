package ports

//go:generate mockgen -source=repository.go -destination=mocks/team_repository_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
)

// Repository defines the interface for team data persistence
type TeamRepository interface {
	// Create persists a new team
	Create(ctx context.Context, t *team.Team) (*team.Team, error)

	// Get retrieves a team by ID
	Get(ctx context.Context, id string) (*team.Team, error)

	// List retrieves a list of teams with pagination
	List(ctx context.Context, pageSize int32, pageToken string) ([]*team.Team, string, error)

	// Update updates an existing team
	Update(ctx context.Context, t *team.Team) (*team.Team, error)

	// Delete removes a team by ID
	Delete(ctx context.Context, id string) error

	// ListPlayers retrieves a list of players for a team with pagination
	ListPlayers(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*player.Player, string, error)

	// FindByCountry retrieves teams from a specific country
	FindByCountry(ctx context.Context, country string, pageSize int32, pageToken string) ([]*team.Team, string, error)

	// FindByLeague retrieves teams from a specific league
	FindByLeague(ctx context.Context, leagueID string, pageSize int32, pageToken string) ([]*team.Team, string, error)

	// GetHomeStadium retrieves the home stadium of a team
	GetHomeStadium(ctx context.Context, teamID string) (*team.Stadium, error)

	// SetHomeStadium sets the home stadium for a team
	SetHomeStadium(ctx context.Context, teamID string, stadiumID string) error

	// AddTrophy adds a trophy to a team
	AddTrophy(ctx context.Context, teamID string, trophyName string, year int) error

	// RemoveTrophy removes a trophy from a team
	RemoveTrophy(ctx context.Context, teamID string, trophyName string, year int) error

	// ListTrophies retrieves all trophies of a team
	ListTrophies(ctx context.Context, teamID string) ([]string, error)

	// GetUpcomingMatches retrieves upcoming matches for a team
	GetUpcomingMatches(ctx context.Context, teamID string, limit int) ([]*match.Match, error)

	// GetPastMatches retrieves past matches for a team
	GetPastMatches(ctx context.Context, teamID string, limit int) ([]*match.Match, error)

	// GetLastLineup retrieves the most recent lineup for a team
	GetLastLineup(ctx context.Context, teamID string) (*match.Lineup, error)
}
