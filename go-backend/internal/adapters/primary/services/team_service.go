package primary

import (
	"context"
	"fmt"

	domainTeam "github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/"
)

// TeamService implements the team Service interface
type TeamService struct {
	teamRepo ports.TeamRepository
}

// NewTeamService creates a new team service
func NewTeamService(teamRepo ports.TeamRepository) ports.TeamService {
	return &TeamService{
		teamRepo: teamRepo,
	}
}

// CreateTeam creates a new team
func (s *TeamService) CreateTeam(ctx context.Context, t *domainTeam.Team) (*domainTeam.Team, error) {
	// Additional business logic can be added here

	// Store the team
	createdTeam, err := s.teamRepo.Create(ctx, t)
	if err != nil {
		return nil, fmt.Errorf("failed to create team: %w", err)
	}

	return createdTeam, nil
}

// GetTeam retrieves a team by ID
func (s *TeamService) GetTeam(ctx context.Context, id string) (*domainTeam.Team, error) {
	team, err := s.teamRepo.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get team: %w", err)
	}

	return team, nil
}

// ListTeams retrieves a paginated list of teams
func (s *TeamService) ListTeams(ctx context.Context, pageSize int32, pageToken string) ([]*domainTeam.Team, string, error) {
	// Default page size if not specified
	if pageSize <= 0 {
		pageSize = 10
	}

	// Maximum page size
	if pageSize > 100 {
		pageSize = 100
	}

	teams, nextPageToken, err := s.teamRepo.List(ctx, pageSize, pageToken)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list teams: %w", err)
	}

	return teams, nextPageToken, nil
}

// UpdateTeam updates an existing team
func (s *TeamService) UpdateTeam(ctx context.Context, t *domainTeam.Team) (*domainTeam.Team, error) {
	// Check if team exists
	_, err := s.teamRepo.Get(ctx, t.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to find team: %w", err)
	}

	// Update the team
	updatedTeam, err := s.teamRepo.Update(ctx, t)
	if err != nil {
		return nil, fmt.Errorf("failed to update team: %w", err)
	}

	return updatedTeam, nil
}

// DeleteTeam deletes a team by ID
func (s *TeamService) DeleteTeam(ctx context.Context, id string) error {
	// You might want to add additional checks here, such as:
	// - Checking if the team has players
	// - Checking if the team has scheduled matches
	// - Checking if the team is part of a league

	err := s.teamRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	return nil
}

