package footballapi

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/martinwangen/norskball/apps/backend/internal/config"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
)

// Client is a client for the football API
type Client struct {
	config     config.FootballAPIConfig
	httpClient *http.Client
}

// NewClient creates a new football API client
func NewClient(config config.FootballAPIConfig) *Client {
	return &Client{
		config: config,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// APIResponse represents the standard response format from the API
type APIResponse struct {
	Get        string          `json:"get"`
	Parameters map[string]any  `json:"parameters"`
	Errors     map[string]any  `json:"errors"`
	Results    int             `json:"results"`
	Paging     map[string]any  `json:"paging"`
	Response   json.RawMessage `json:"response"`
}

// GetRounds fetches all rounds for a league and season
func (c *Client) GetRounds(leagueID, season int) ([]string, error) {
	url := fmt.Sprintf("%s/fixtures/rounds", c.config.BaseURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	// Add query parameters
	q := req.URL.Query()
	q.Add("league", fmt.Sprintf("%d", leagueID))
	q.Add("season", fmt.Sprintf("%d", season))
	req.URL.RawQuery = q.Encode()

	// Add headers
	req.Header.Add("x-rapidapi-host", c.config.Host)
	req.Header.Add("x-rapidapi-key", c.config.APIKey)

	// Make the request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	// Check if the response is successful
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-200 status code: %d, body: %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var apiResp APIResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

	// Check for API errors
	if len(apiResp.Errors) > 0 {
		return nil, fmt.Errorf("API returned errors: %v", apiResp.Errors)
	}

	// Parse the rounds
	var rounds []string
	if err := json.Unmarshal(apiResp.Response, &rounds); err != nil {
		return nil, fmt.Errorf("error unmarshaling rounds: %w", err)
	}

	return rounds, nil
}

// Fixture represents a football match fixture
type Fixture struct {
	Fixture struct {
		ID        int    `json:"id"`
		Referee   string `json:"referee"`
		Timezone  string `json:"timezone"`
		Date      string `json:"date"`
		Timestamp int64  `json:"timestamp"`
		Venue     struct {
			ID   int    `json:"id"`
			Name string `json:"name"`
			City string `json:"city"`
		} `json:"venue"`
		Status struct {
			Long    string `json:"long"`
			Short   string `json:"short"`
			Elapsed int    `json:"elapsed"`
		} `json:"status"`
	} `json:"fixture"`
	League struct {
		ID      int    `json:"id"`
		Name    string `json:"name"`
		Country string `json:"country"`
		Logo    string `json:"logo"`
		Flag    string `json:"flag"`
		Season  int    `json:"season"`
		Round   string `json:"round"`
	} `json:"league"`
	Teams struct {
		Home struct {
			ID     int    `json:"id"`
			Name   string `json:"name"`
			Logo   string `json:"logo"`
			Winner bool   `json:"winner"`
		} `json:"home"`
		Away struct {
			ID     int    `json:"id"`
			Name   string `json:"name"`
			Logo   string `json:"logo"`
			Winner bool   `json:"winner"`
		} `json:"away"`
	} `json:"teams"`
	Goals struct {
		Home int `json:"home"`
		Away int `json:"away"`
	} `json:"goals"`
	Score struct {
		Halftime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"halftime"`
		Fulltime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"fulltime"`
		Extratime struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"extratime"`
		Penalty struct {
			Home int `json:"home"`
			Away int `json:"away"`
		} `json:"penalty"`
	} `json:"score"`
}

// GetFixtures fetches fixtures for a league and season
func (c *Client) GetFixtures(leagueID, season int, round string) ([]Fixture, error) {
	url := fmt.Sprintf("%s/fixtures", c.config.BaseURL)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	// Add query parameters
	q := req.URL.Query()
	q.Add("league", fmt.Sprintf("%d", leagueID))
	q.Add("season", fmt.Sprintf("%d", season))
	if round != "" {
		q.Add("round", round)
	}
	req.URL.RawQuery = q.Encode()

	// Add headers
	req.Header.Add("x-rapidapi-host", c.config.Host)
	req.Header.Add("x-rapidapi-key", c.config.APIKey)

	// Make the request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	// Check if the response is successful
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-200 status code: %d, body: %s", resp.StatusCode, string(body))
	}

	// Parse the response
	var apiResp APIResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return nil, fmt.Errorf("error unmarshaling response: %w", err)
	}

	// Check for API errors
	if len(apiResp.Errors) > 0 {
		return nil, fmt.Errorf("API returned errors: %v", apiResp.Errors)
	}

	// Parse the fixtures
	var fixtures []Fixture
	if err := json.Unmarshal(apiResp.Response, &fixtures); err != nil {
		return nil, fmt.Errorf("error unmarshaling fixtures: %w", err)
	}

	return fixtures, nil
}

// MapFixtureToMatch maps a Fixture to a domain match
func MapFixtureToMatch(fixture Fixture) *match.Match {
	// Parse the scheduled date
	scheduledDate, _ := time.Parse(time.RFC3339, fixture.Fixture.Date)

	// Map status
	var status match.Status
	switch fixture.Fixture.Status.Short {
	case "TBD", "NS", "PST", "CANC":
		status = match.StatusScheduled
	case "1H", "HT", "2H", "ET", "P", "BT", "SUSP", "INT":
		status = match.StatusLive
	case "FT", "AET", "PEN", "AWD", "WO":
		status = match.StatusCompleted
	}

	return &match.Match{
		ID:            fmt.Sprintf("%d", fixture.Fixture.ID),
		HomeTeamID:    fmt.Sprintf("%d", fixture.Teams.Home.ID),
		AwayTeamID:    fmt.Sprintf("%d", fixture.Teams.Away.ID),
		LeagueID:      fmt.Sprintf("%d", fixture.League.ID),
		SeasonID:      fmt.Sprintf("%d", fixture.League.Season),
		RefereeID:     "", // Not available in fixture data
		ScheduledDate: scheduledDate,
		Status:        status,
		HomeScore:     fixture.Goals.Home,
		AwayScore:     fixture.Goals.Away,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}

// Match represents a match in our database
type Match struct {
	ID          string   `json:"id"`
	HomeTeamID  string   `json:"home_team_id"`
	AwayTeamID  string   `json:"away_team_id"`
	HomeTeam    *Team    `json:"home_team,omitempty"`
	AwayTeam    *Team    `json:"away_team,omitempty"`
	Competition string   `json:"competition"`
	Season      string   `json:"season"`
	Stadium     string   `json:"stadium"`
	DateTime    string   `json:"date_time"`
	Status      int      `json:"status"`
	HomeScore   int      `json:"home_score"`
	AwayScore   int      `json:"away_score"`
	Weather     string   `json:"weather"`
	Events      []string `json:"events,omitempty"`
	HomeStats   string   `json:"home_stats"`
	AwayStats   string   `json:"away_stats"`
	Attendance  int      `json:"attendance"`
	RefereeIDs  []string `json:"referee_ids,omitempty"`
	Round       string   `json:"round"`
}

// Team represents a team in our database
type Team struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Country string `json:"country"`
	LogoURL string `json:"logo_url"`
}
