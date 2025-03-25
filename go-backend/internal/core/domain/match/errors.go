package match

import "errors"

var (
	// ErrMatchNotFound is returned when a match cannot be found
	ErrMatchNotFound = errors.New("match not found")

	// ErrTeamNotInMatch is returned when a team is not part of the match
	ErrTeamNotInMatch = errors.New("team is not part of this match")

	// ErrInvalidMatchData is returned when match data is invalid
	ErrInvalidMatchData = errors.New("invalid match data")

	// ErrInvalidLineupData is returned when lineup data is invalid
	ErrInvalidLineupData = errors.New("invalid lineup data")
)
