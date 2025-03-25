package primary

import (
	"context"
	"fmt"

	domainPlayer "github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/"
)

// PlayerService implements the player Service interface
type PlayerService struct {
	playerRepo ports.PlayerRepository
}

// NewPlayerService creates a new player service
func NewPlayerService(playerRepo ports.PlayerRepository) ports.PlayerService {
	return &PlayerService{
		playerRepo: playerRepo,
	}
}

// CreatePlayer creates a new player
func (s *PlayerService) CreatePlayer(ctx context.Context, p *domainPlayer.Player) (*domainPlayer.Player, error) {
	// Additional business logic can be added here

	// Store the player
	createdPlayer, err := s.playerRepo.Create(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("failed to create player: %w", err)
	}

	return createdPlayer, nil
}

// GetPlayer retrieves a player by ID
func (s *PlayerService) GetPlayer(ctx context.Context, id string) (*domainPlayer.Player, error) {
	player, err := s.playerRepo.Get(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get player: %w", err)
	}

	return player, nil
}

// ListPlayers retrieves a paginated list of players
func (s *PlayerService) ListPlayers(ctx context.Context, pageSize int32, pageToken string) ([]*domainPlayer.Player, string, error) {
	// Default page size if not specified
	if pageSize <= 0 {
		pageSize = 10
	}

	// Maximum page size
	if pageSize > 100 {
		pageSize = 100
	}

	players, nextPageToken, err := s.playerRepo.List(ctx, pageSize, pageToken)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list players: %w", err)
	}

	return players, nextPageToken, nil
}

// GetPlayersByTeamId retrieves a list of players by team ID
func (s *PlayerService) GetPlayersByTeamId(ctx context.Context, teamId string) ([]*domainPlayer.Player, error) {
	players, err := s.playerRepo.GetPlayersByTeamId(ctx, teamId)
	if err != nil {
		return nil, fmt.Errorf("failed to get players by team ID: %w", err)
	}

	return players, nil
}

// UpdatePlayer updates an existing player
func (s *PlayerService) UpdatePlayer(ctx context.Context, p *domainPlayer.Player) (*domainPlayer.Player, error) {
	// Check if player exists
	_, err := s.playerRepo.Get(ctx, p.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to find player: %w", err)
	}

	// You could add more business logic here, like verifying certain updates
	// are allowed, or merging specific fields from the existing player

	// Update the player
	updatedPlayer, err := s.playerRepo.Update(ctx, p)
	if err != nil {
		return nil, fmt.Errorf("failed to update player: %w", err)
	}

	return updatedPlayer, nil
}

// DeletePlayer deletes a player by ID
func (s *PlayerService) DeletePlayer(ctx context.Context, id string) error {
	// You might want to add additional checks here, such as:
	// - Checking if the player is part of any active lineups
	// - Checking if the player has other dependencies

	err := s.playerRepo.Delete(ctx, id)
	if err != nil {
		return fmt.Errorf("failed to delete player: %w", err)
	}

	return nil
}
