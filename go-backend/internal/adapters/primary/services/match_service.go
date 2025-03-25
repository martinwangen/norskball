package primary

import (
	"context"
	"errors"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	ports "github.com/martinwangen/norskball/apps/backend/internal/core/ports/match"
)

type matchService struct {
	matchRepo     match.Repository
	lineupService ports.LineupService
}

func NewMatchService(matchRepo match.Repository, lineupService ports.LineupService) ports.MatchService {
	return &matchService{
		matchRepo:     matchRepo,
		lineupService: lineupService,
	}
}

func (s *matchService) ListMatches(ctx context.Context, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	matches, nextPageToken, err := s.matchRepo.List(ctx, pageSize, pageToken)
	if err != nil {
		return nil, "", err
	}

	// Populate lineups for each match
	for _, m := range matches {
		if err := s.populateLineups(ctx, m); err != nil {
			return nil, "", err
		}
	}

	return matches, nextPageToken, nil
}

func (s *matchService) GetMatch(ctx context.Context, id string) (*match.Match, error) {
	match, err := s.matchRepo.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	if match == nil {
		return nil, nil
	}

	// Populate lineups for the match
	if err := s.populateLineups(ctx, match); err != nil {
		return nil, err
	}

	return match, nil
}

func (s *matchService) CreateMatch(ctx context.Context, match *match.Match) (*match.Match, error) {
	createdMatch, err := s.matchRepo.Create(ctx, match)
	if err != nil {
		return nil, err
	}

	return createdMatch, nil
}

func (s *matchService) UpdateMatch(ctx context.Context, match *match.Match) (*match.Match, error) {
	updatedMatch, err := s.matchRepo.Update(ctx, match)
	if err != nil {
		return nil, err
	}

	// Populate lineups for the updated match
	if err := s.populateLineups(ctx, updatedMatch); err != nil {
		return nil, err
	}

	return updatedMatch, nil
}

func (s *matchService) DeleteMatch(ctx context.Context, id string) error {
	// Get match to check if it exists and get team IDs
	match, err := s.matchRepo.Get(ctx, id)
	if err != nil {
		return err
	}

	if match == nil {
		return nil
	}

	// Delete associated lineups
	if err := s.lineupService.DeleteLineup(ctx, id, match.HomeTeamID); err != nil {
		return err
	}
	if err := s.lineupService.DeleteLineup(ctx, id, match.AwayTeamID); err != nil {
		return err
	}

	// Delete the match
	return s.matchRepo.Delete(ctx, id)
}

func (s *matchService) UpdateMatchLineup(ctx context.Context, matchID string, teamID string, lineup *match.Lineup) (*match.Match, error) {
	// First verify the match exists and the team is part of it
	match, err := s.matchRepo.Get(ctx, matchID)
	if err != nil {
		return nil, err
	}

	if match == nil {
		return nil, err
	}

	if teamID != match.HomeTeamID && teamID != match.AwayTeamID {
		return nil, errors.New("team is not part of the match")
	}

	// Update the lineup
	updatedLineup, err := s.lineupService.UpdateLineup(ctx, lineup)
	if err != nil {
		return nil, err
	}

	// Get the updated match with both lineups
	updatedMatch, err := s.GetMatch(ctx, matchID)
	if err != nil {
		return nil, err
	}

	return updatedMatch, nil
}

// populateLineups is a helper function to populate both home and away lineups for a match
func (s *matchService) populateLineups(ctx context.Context, match *match.Match) error {
	homeLineup, err := s.lineupService.GetLineup(ctx, match.ID, match.HomeTeamID)
	if err != nil {
		return err
	}
	match.HomeTeamLineup = homeLineup

	awayLineup, err := s.lineupService.GetLineup(ctx, match.ID, match.AwayTeamID)
	if err != nil {
		return err
	}
	match.AwayTeamLineup = awayLineup

	return nil
}
