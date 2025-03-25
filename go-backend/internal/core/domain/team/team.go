package team

import (
	"time"
)

// Team represents a football team
type Team struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	ShortName string  `json:"short_name"`
	LeagueID  string  `json:"league_id"`
	Logo      string  `json:"logo"` // URL to team logo
	Website   string  `json:"website"`
	Stadium   Stadium `json:"stadium"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Stadium struct {
	Name    string `json:"name"`
	City    string `json:"city"`
	Surface string `json:"surface"`
}

// Statistics represents team statistics for a season
type Statistics struct {
	TeamID        string    `json:"team_id"`
	SeasonID      string    `json:"season_id"`
	MatchesPlayed int       `json:"matches_played"`
	Wins          int       `json:"wins"`
	Draws         int       `json:"draws"`
	Losses        int       `json:"losses"`
	GoalsFor      int       `json:"goals_for"`
	GoalsAgainst  int       `json:"goals_against"`
	GoalDiff      int       `json:"goal_diff"`
	Points        int       `json:"points"`
	Position      int       `json:"position"`
	Form          []string  `json:"form"` // Last 5 match results: W/D/L
	UpdatedAt     time.Time `json:"updated_at"`
}

// NewTeam creates a new team
func NewTeam(name, shortName, countryCode string, founded int, leagueID string) *Team {
	now := time.Now()
	return &Team{
		ID:        generateTeamID(),
		Name:      name,
		ShortName: shortName,
		LeagueID:  leagueID,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// UpdateName updates the team's name
func (t *Team) UpdateName(name, shortName string) {
	t.Name = name
	t.ShortName = shortName
	t.UpdatedAt = time.Now()
}

// UpdateLogo updates the team's logo URL
func (t *Team) UpdateLogo(logo string) {
	t.Logo = logo
	t.UpdatedAt = time.Now()
}

// UpdateLeague updates the team's league
func (t *Team) UpdateLeague(leagueID string) {
	t.LeagueID = leagueID
	t.UpdatedAt = time.Now()
}

// UpdateWebsite updates the team's website
func (t *Team) UpdateWebsite(website string) {
	t.Website = website
	t.UpdatedAt = time.Now()
}

// generateTeamID generates a unique ID for a team
// Note: Implement this according to your ID generation strategy
func generateTeamID() string {
	// Implementation depends on your ID generation strategy
	// Could use UUID, sequential IDs, etc.
	return "team_" + time.Now().Format("20060102150405")
}
