package match

import (
	"context"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
)

// Formation represents a team's tactical formation (e.g., "4-4-2", "4-3-3", etc.)
type Formation string

// Common formations
const (
	FormationUnknown Formation = "UNKNOWN"
	Formation442     Formation = "4-4-2"
	Formation433     Formation = "4-3-3"
	Formation352     Formation = "3-5-2"
	Formation343     Formation = "3-4-3"
	Formation4231    Formation = "4-2-3-1"
	Formation4321    Formation = "4-3-2-1"
	Formation532     Formation = "5-3-2"
	Formation541     Formation = "5-4-1"
	Formation451     Formation = "4-5-1"
	Formation523     Formation = "5-2-3"
	Formation4141    Formation = "4-1-4-1"
	Formation3142    Formation = "3-1-4-2"
)

// Status represents the current status of a match
type Status string

// Match statuses
const (
	StatusScheduled   Status = "SCHEDULED"   // Match is scheduled but not yet started
	StatusLive        Status = "LIVE"        // Match is currently live
	StatusCompleted   Status = "COMPLETED"   // Match has been completed
	StatusPostponed   Status = "POSTPONED"   // Match has been postponed
	StatusCancelled   Status = "CANCELLED"   // Match has been cancelled
	StatusSuspended   Status = "SUSPENDED"   // Match has been suspended
	StatusInterrupted Status = "INTERRUPTED" // Match has been interrupted
)

// Lineup represents a team's lineup for a specific match
type Lineup struct {
	ID        string         `json:"id"`
	MatchID   string         `json:"match_id"`
	TeamID    string         `json:"team_id"`
	Formation Formation      `json:"formation"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Players   []LineupPlayer `json:"players"`
}

// Validate validates the lineup entity
func (l *Lineup) Validate(ctx context.Context) validation.ValidationErrors {
	var errors validation.ValidationErrors

	// Validate required fields
	errors.AddIf(l.MatchID == "", "MatchID", "Match ID is required")
	errors.AddIf(l.TeamID == "", "TeamID", "Team ID is required")
	errors.AddIf(string(l.Formation) == "", "Formation", "Formation is required")

	// Validate formation
	validFormation := false
	for _, f := range []Formation{
		FormationUnknown, Formation442, Formation433, Formation352, Formation343,
		Formation4231, Formation4321, Formation532, Formation541,
		Formation451, Formation523, Formation4141, Formation3142,
	} {
		if l.Formation == f {
			validFormation = true
			break
		}
	}

	// If the formation doesn't match predefined ones, check if it follows the pattern N-N-N, etc.
	if !validFormation {
		if len(l.Formation) < 3 {
			errors.Add("Formation", "Formation must follow the pattern N-N-N (e.g., 4-4-2)")
		}
	}

	return errors
}

// NewLineup creates a new lineup instance
func NewLineup(matchID, teamID string, formation Formation) *Lineup {
	now := time.Now()
	return &Lineup{
		ID:        generateLineupID(),
		MatchID:   matchID,
		TeamID:    teamID,
		Formation: formation,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// SetFormation changes the lineup's formation
func (l *Lineup) SetFormation(formation Formation) {
	l.Formation = formation
	l.UpdatedAt = time.Now()
}

// generateLineupID generates a unique ID for a lineup
func generateLineupID() string {
	return "lineup_" + time.Now().Format("20060102150405")
}

// Match represents a football match
type Match struct {
	ID             string    `json:"id"`
	HomeTeamID     string    `json:"home_team_id"`
	AwayTeamID     string    `json:"away_team_id"`
	HomeTeamLineup *Lineup   `json:"home_team_lineup,omitempty"`
	AwayTeamLineup *Lineup   `json:"away_team_lineup,omitempty"`
	SeasonID       string    `json:"season_id"`
	LeagueID       string    `json:"league_id"`
	RefereeID      string    `json:"referee_id"`
	ScheduledDate  time.Time `json:"scheduled_date"`
	Status         Status    `json:"status"`
	HomeScore      int       `json:"home_score"`
	AwayScore      int       `json:"away_score"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// NewMatch creates a new match instance
func NewMatch(homeTeamID, awayTeamID, seasonID, leagueID, stadiumID, refereeID string, scheduledDate time.Time) *Match {
	now := time.Now()
	return &Match{
		HomeTeamID:    homeTeamID,
		AwayTeamID:    awayTeamID,
		SeasonID:      seasonID,
		LeagueID:      leagueID,
		RefereeID:     refereeID,
		ScheduledDate: scheduledDate,
		Status:        StatusScheduled,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
}

// StartMatch marks the match as live
func (m *Match) StartMatch() {
	m.Status = StatusLive
	m.UpdatedAt = time.Now()
}

// CompleteMatch marks the match as completed
func (m *Match) CompleteMatch() {
	m.Status = StatusCompleted
	m.UpdatedAt = time.Now()
}

// PostponeMatch marks the match as postponed
func (m *Match) PostponeMatch() {
	m.Status = StatusPostponed
	m.UpdatedAt = time.Now()
}

// CancelMatch marks the match as cancelled
func (m *Match) CancelMatch() {
	m.Status = StatusCancelled
	m.UpdatedAt = time.Now()
}

// SuspendMatch marks the match as suspended
func (m *Match) SuspendMatch() {
	m.Status = StatusSuspended
	m.UpdatedAt = time.Now()
}

// UpdateScore updates the score of the match
func (m *Match) UpdateScore(homeScore, awayScore int) {
	m.HomeScore = homeScore
	m.AwayScore = awayScore
	m.UpdatedAt = time.Now()
}

// Reschedule updates the scheduled date of the match
func (m *Match) Reschedule(newDate time.Time) {
	m.ScheduledDate = newDate
	if m.Status == StatusPostponed {
		m.Status = StatusScheduled
	}
	m.UpdatedAt = time.Now()
}

// generateMatchID generates a unique ID for a match
// Note: Implement this according to your ID generation strategy
func generateMatchID() string {
	// Implementation depends on your ID generation strategy
	// Could use UUID, sequential IDs, etc.
	return "match_" + time.Now().Format("20060102150405")
}
