package primary

import (
	"context"
	"fmt"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/"
)

// LineupService implements the lineup Service interface
type LineupService struct {
	lineupRepo ports.LineupRepository
}

// NewLineupService creates a new lineup service
func NewLineupService(lineupRepo ports.LineupRepository) ports.LineupService {
	return &LineupService{
		lineupRepo: lineupRepo,
	}
}

// CreateLineup creates a new lineup
func (s *LineupService) CreateLineup(ctx context.Context, l *match.Lineup) (*match.Lineup, error) {
	// Validate the lineup
	if err := l.Validate(ctx); err != nil {
		return nil, fmt.Errorf("invalid lineup: %w", err)
	}

	// Store the lineup
	createdLineup, err := s.lineupRepo.Create(ctx, l)
	if err != nil {
		return nil, fmt.Errorf("failed to create lineup: %w", err)
	}

	return createdLineup, nil
}

// GetLineup retrieves a lineup by ID
func (s *LineupService) GetLineup(ctx context.Context, id string) (*match.Lineup, error) {
	lineup, err := s.lineupRepo.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get lineup: %w", err)
	}

	return lineup, nil
}

// ListLineups retrieves a paginated list of lineups
func (s *LineupService) ListLineups(ctx context.Context, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	// Default page size if not specified
	if pageSize <= 0 {
		pageSize = 10
	}

	// Maximum page size
	if pageSize > 100 {
		pageSize = 100
	}

	lineups, nextPageToken, err := s.lineupRepo.List(ctx, pageSize, pageToken)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list lineups: %w", err)
	}

	return lineups, nextPageToken, nil
}

// UpdateLineup updates an existing lineup
func (s *LineupService) UpdateLineup(ctx context.Context, l *match.Lineup) (*match.Lineup, error) {
	// Validate the lineup
	if err := l.Validate(ctx); err != nil {
		return nil, fmt.Errorf("invalid lineup: %w", err)
	}

	// Check if lineup exists
	_, err := s.lineupRepo.Get(ctx, l.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to find lineup: %w", err)
	}

	// Update the lineup
	updatedLineup, err := s.lineupRepo.Update(ctx, l)
	if err != nil {
		return nil, fmt.Errorf("failed to update lineup: %w", err)
	}

	return updatedLineup, nil
}

// DeleteLineup deletes a lineup by ID
func (s *LineupService) DeleteLineup(ctx context.Context, id string) error {
	err := s.lineupRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete lineup: %w", err)
	}

	return nil
}

// FindLineupsByMatch retrieves lineups for a specific match
func (s *LineupService) FindLineupsByMatch(ctx context.Context, matchID string, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}

	lineups, nextPageToken, err := s.lineupRepo.FindByMatch(ctx, matchID, pageSize, pageToken)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find lineups by match: %w", err)
	}

	return lineups, nextPageToken, nil
}

// FindLineupsByTeam retrieves lineups for a specific team
func (s *LineupService) FindLineupsByTeam(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageSize > 100 {
		pageSize = 100
	}

	lineups, nextPageToken, err := s.lineupRepo.FindByTeam(ctx, teamID, pageSize, pageToken)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find lineups by team: %w", err)
	}

	return lineups, nextPageToken, nil
}

// GetStartingLineup retrieves the starting lineup for a match
func (s *LineupService) GetStartingLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error) {
	lineup, err := s.lineupRepo.GetStartingLineup(ctx, matchID, teamID)
	if err != nil {
		return nil, fmt.Errorf("failed to get starting lineup: %w", err)
	}

	return lineup, nil
}

// GetSubstituteLineup retrieves the substitute lineup for a match
func (s *LineupService) GetSubstituteLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error) {
	lineup, err := s.lineupRepo.GetSubstituteLineup(ctx, matchID, teamID)
	if err != nil {
		return nil, fmt.Errorf("failed to get substitute lineup: %w", err)
	}

	return lineup, nil
}

// AddPlayerToLineup adds a player to a lineup
func (s *LineupService) AddPlayerToLineup(ctx context.Context, lineupID string, player *match.LineupPlayer) error {
	err := s.lineupRepo.AddPlayer(ctx, lineupID, player)
	if err != nil {
		return fmt.Errorf("failed to add player to lineup: %w", err)
	}

	return nil
}

// RemovePlayerFromLineup removes a player from a lineup
func (s *LineupService) RemovePlayerFromLineup(ctx context.Context, lineupID string, playerID string) error {
	err := s.lineupRepo.RemovePlayer(ctx, lineupID, playerID)
	if err != nil {
		return fmt.Errorf("failed to remove player from lineup: %w", err)
	}

	return nil
}

// UpdatePlayerPosition updates a player's position in a lineup
func (s *LineupService) UpdatePlayerPosition(ctx context.Context, lineupID string, playerID string, position match.PlayerPosition) error {
	err := s.lineupRepo.UpdatePlayerPosition(ctx, lineupID, playerID, position)
	if err != nil {
		return fmt.Errorf("failed to update player position: %w", err)
	}

	return nil
}

// SetTeamCaptain sets a player as captain in a lineup
func (s *LineupService) SetTeamCaptain(ctx context.Context, lineupID string, playerID string) error {
	err := s.lineupRepo.SetCaptain(ctx, lineupID, playerID)
	if err != nil {
		return fmt.Errorf("failed to set team captain: %w", err)
	}

	return nil
}

// GetLineupPlayers retrieves all players in a lineup
func (s *LineupService) GetLineupPlayers(ctx context.Context, lineupID string) ([]*match.LineupPlayer, error) {
	players, err := s.lineupRepo.GetLineupPlayers(ctx, lineupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get lineup players: %w", err)
	}

	return players, nil
}

// UpdatePlayerMatchStats updates a player's match statistics
func (s *LineupService) UpdatePlayerMatchStats(ctx context.Context, lineupID string, playerID string, stats match.PlayerMatchStats) error {
	err := s.lineupRepo.UpdatePlayerStats(ctx, lineupID, playerID, stats)
	if err != nil {
		return fmt.Errorf("failed to update player match stats: %w", err)
	}

	return nil
}

// ValidateLineup validates if a lineup follows the rules
func (s *LineupService) ValidateLineup(ctx context.Context, l *match.Lineup) error {
	if err := l.Validate(ctx); err != nil {
		return fmt.Errorf("lineup validation failed: %w", err)
	}

	return nil
}

// GetFormation retrieves the formation of a lineup
func (s *LineupService) GetFormation(ctx context.Context, lineupID string) (match.Formation, error) {
	lineup, err := s.lineupRepo.Get(ctx, lineupID)
	if err != nil {
		return "", fmt.Errorf("failed to get lineup: %w", err)
	}

	return lineup.Formation, nil
}

// UpdateFormation updates the formation of a lineup
func (s *LineupService) UpdateFormation(ctx context.Context, lineupID string, formation match.Formation) error {
	lineup, err := s.lineupRepo.Get(ctx, lineupID)
	if err != nil {
		return fmt.Errorf("failed to get lineup: %w", err)
	}

	lineup.SetFormation(formation)
	_, err = s.lineupRepo.Update(ctx, lineup)
	if err != nil {
		return fmt.Errorf("failed to update formation: %w", err)
	}

	return nil
}
