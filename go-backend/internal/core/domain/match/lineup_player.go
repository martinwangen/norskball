package match

import (
	"context"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
)

type PlayerPosition string

const (
	PlayerPositionGoalkeeper PlayerPosition = "GOALKEEPER"
	PlayerPositionDefender PlayerPosition = "DEFENDER"
	PlayerPositionMidfielder PlayerPosition = "MIDFIELDER"
	PlayerPositionForward  PlayerPosition = "FORWARD"
	PlayerPositionSubstitute PlayerPosition = "SUBSTITUTE"
)

// PlayerMatchStats represents a player's statistics for a single match
type PlayerMatchStats struct {
	Goals           int  `json:"goals"`
	Assists         int  `json:"assists"`
	YellowCards     int  `json:"yellow_cards"`
	RedCards        int  `json:"red_cards"`
	MinutesPlayed   int  `json:"minutes_played"`
}

// LineupPlayer represents a player in a match lineup
type LineupPlayer struct {
	ID        string           `json:"id"`
	PlayerID  string           `json:"player_id"`
	LineupID  string           `json:"lineup_id"`
	Position  PlayerPosition   `json:"position"`
	Stats     PlayerMatchStats `json:"stats"`
	Ratings   []Rating         `json:"ratings"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`

}

type Rating struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Rating    float64   `json:"rating"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Validate validates the lineup player entity
func (p *LineupPlayer) Validate(ctx context.Context) validation.ValidationErrors {
	var errors validation.ValidationErrors

	// Validate required fields
	errors.AddIf(p.ID == "", "ID", "ID is required")
	errors.AddIf(p.LineupID == "", "LineupID", "Lineup ID is required")
	errors.AddIf(p.PlayerID == "", "PlayerID", "Player ID is required")

	// Validate stats
	if p.Stats.MinutesPlayed < 0 {
		errors.Add("Stats.MinutesPlayed", "Minutes played cannot be negative")
	}

	if p.Stats.Goals < 0 {
		errors.Add("Stats.Goals", "Goals cannot be negative")
	}
	if p.Stats.Assists < 0 {
		errors.Add("Stats.Assists", "Assists cannot be negative")
	}
	if p.Stats.YellowCards < 0 {
		errors.Add("Stats.YellowCards", "Yellow cards cannot be negative")
	}
	if p.Stats.YellowCards > 2 {
		errors.Add("Stats.YellowCards", "Yellow cards cannot exceed 2")
	}
	if p.Stats.RedCards < 0 {
		errors.Add("Stats.RedCards", "Red cards cannot be negative")
	}
	if p.Stats.RedCards > 1 {
		errors.Add("Stats.RedCards", "Red cards cannot exceed 1")
	}

	return errors
}

// NewLineupPlayer creates a new lineup player instance
func NewLineupPlayer(lineupID, matchID, teamID, playerID string) *LineupPlayer {
	now := time.Now()
	return &LineupPlayer{
		ID:        generateLineupPlayerID(),
		LineupID:  lineupID,
		PlayerID:  playerID,
		Stats:     PlayerMatchStats{},
		Ratings:   []Rating{},
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// UpdateStats updates the player's match statistics
func (p *LineupPlayer) UpdateStats(stats PlayerMatchStats) {
	p.Stats = stats
	p.UpdatedAt = time.Now()
}

// generateLineupPlayerID generates a unique ID for a lineup player
func generateLineupPlayerID() string {
	return "lineup_player_" + time.Now().Format("20060102150405")
}
