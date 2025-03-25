package ports

//go:generate mockgen -source=service.go -destination=mocks/team_service_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
)

// Service defines the interface for team-related operations
type TeamService interface {
	// CreateTeam creates a new team
	CreateTeam(ctx context.Context, t *team.Team) (*team.Team, error)

	// GetTeam retrieves a team by ID
	GetTeam(ctx context.Context, id string) (*team.Team, error)

	// ListTeams retrieves a list of teams with pagination
	ListTeams(ctx context.Context, pageSize int32, pageToken string) ([]*team.Team, string, error)

	// UpdateTeam updates an existing team
	UpdateTeam(ctx context.Context, t *team.Team) (*team.Team, error)

	// DeleteTeam deletes a team by ID
	DeleteTeam(ctx context.Context, id string) error

	// ListTeamPlayers retrieves a list of players for a team with pagination
	ListTeamPlayers(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*player.Player, string, error)

	// GetLastLineup retrieves the most recent lineup for a team
	GetLastLineup(ctx context.Context, teamID string) (*match.Lineup, error)
}
