package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports"
)

// PostgresMatchRepository is a PostgreSQL implementation of the match Repository interface
type PostgresMatchRepository struct {
	db *database.PostgresDB
}

// NewPostgresMatchRepository creates a new PostgreSQL match repository
func NewPostgresMatchRepository(db *database.PostgresDB) ports.MatchRepository {
	return &PostgresMatchRepository{db: db}
}

// Create persists a new match
func (r *PostgresMatchRepository) Create(ctx context.Context, m *match.Match) (*match.Match, error) {
	// Generate ID if not provided
	if m.ID == "" {
		m.ID = uuid.New().String()
	}

	// Set timestamps
	now := time.Now()
	m.CreatedAt = now
	m.UpdatedAt = now

	query := `
		INSERT INTO matches (
			id, home_team_id, away_team_id, season_id, league_id,
			referee_id, scheduled_date, status, home_score, away_score,
			created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		)
		RETURNING id
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		m.ID,
		m.HomeTeamID,
		m.AwayTeamID,
		m.SeasonID,
		m.LeagueID,
		m.RefereeID,
		m.ScheduledDate,
		m.Status,
		m.HomeScore,
		m.AwayScore,
		m.CreatedAt,
		m.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create match: %w", err)
	}

	return m, nil
}

// Get retrieves a match by ID
func (r *PostgresMatchRepository) Get(ctx context.Context, id string) (*match.Match, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id,
			referee_id, scheduled_date, status, home_score, away_score,
			created_at, updated_at
		FROM matches
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)
	m, err := r.scanMatch(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("match not found: %s", id)
		}
		return nil, fmt.Errorf("failed to get match: %w", err)
	}

	return m, nil
}

// List retrieves a list of matches with pagination
func (r *PostgresMatchRepository) List(ctx context.Context, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id,
			referee_id, scheduled_date, status, home_score, away_score,
			created_at, updated_at
		FROM matches
	`

	args := []interface{}{}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " WHERE id > $1"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date ASC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list matches: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// Update updates an existing match
func (r *PostgresMatchRepository) Update(ctx context.Context, m *match.Match) (*match.Match, error) {
	m.UpdatedAt = time.Now()

	query := `
		UPDATE matches
		SET 
			home_team_id = $1,
			away_team_id = $2,
			season_id = $3,
			league_id = $4,
			referee_id = $5,
			scheduled_date = $6,
			status = $7,
			home_score = $8,
			away_score = $9,
			updated_at = $10
		WHERE id = $11
		RETURNING id, home_team_id, away_team_id, season_id, league_id,
				  referee_id, scheduled_date, status, home_score, away_score,
				  created_at, updated_at
	`

	row := r.db.QueryRowContext(
		ctx,
		query,
		m.HomeTeamID,
		m.AwayTeamID,
		m.SeasonID,
		m.LeagueID,
		m.RefereeID,
		m.ScheduledDate,
		m.Status,
		m.HomeScore,
		m.AwayScore,
		m.UpdatedAt,
		m.ID,
	)

	updatedMatch, err := r.scanMatch(row)
	if err != nil {
		return nil, fmt.Errorf("failed to update match: %w", err)
	}

	return updatedMatch, nil
}

// Delete removes a match from the database
func (r *PostgresMatchRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM matches WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete match: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("match not found: %s", id)
	}

	return nil
}

// FindByTeam retrieves matches involving a specific team
func (r *PostgresMatchRepository) FindByTeam(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE home_team_id = $1 OR away_team_id = $1
	`

	args := []interface{}{teamID}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by team: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindByStadium retrieves matches played at a specific stadium
func (r *PostgresMatchRepository) FindByStadium(ctx context.Context, stadiumID string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE stadium_id = $1
	`

	args := []interface{}{stadiumID}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by stadium: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindByReferee retrieves matches officiated by a specific referee
func (r *PostgresMatchRepository) FindByReferee(ctx context.Context, refereeID string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE referee_id = $1
	`

	args := []interface{}{refereeID}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by referee: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindByDateRange retrieves matches played within a date range
func (r *PostgresMatchRepository) FindByDateRange(ctx context.Context, startDate, endDate time.Time, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE scheduled_date BETWEEN $1 AND $2
	`

	args := []interface{}{startDate, endDate}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $3"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by date range: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindByCompetition retrieves matches from a specific competition
func (r *PostgresMatchRepository) FindByCompetition(ctx context.Context, competition string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE league_id = $1
	`

	args := []interface{}{competition}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by competition: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindBySeason retrieves matches from a specific season
func (r *PostgresMatchRepository) FindBySeason(ctx context.Context, season string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE season_id = $1
	`

	args := []interface{}{season}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by season: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// FindByStatus retrieves matches with a specific status
func (r *PostgresMatchRepository) FindByStatus(ctx context.Context, status string, pageSize int32, pageToken string) ([]*match.Match, string, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id, stadium_id,
			referee_id, scheduled_date, status, home_score, away_score,
			home_possession, away_possession, home_shots, away_shots,
			home_shots_on_target, away_shots_on_target, home_corners, away_corners,
			home_fouls, away_fouls, home_yellow_cards, away_yellow_cards,
			home_red_cards, away_red_cards, weather, attendance,
			created_at, updated_at
		FROM matches
		WHERE status = $1
	`

	args := []interface{}{status}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY scheduled_date DESC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find matches by status: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		m, err := r.scanMatch(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, m)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating matches: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(matches) > int(pageSize) {
		nextPageToken = matches[len(matches)-1].ID
		matches = matches[:len(matches)-1] // Remove the extra item
	}

	return matches, nextPageToken, nil
}

// UpdateScore updates the score of a match
func (r *PostgresMatchRepository) UpdateScore(ctx context.Context, matchID string, homeScore, awayScore int) error {
	query := `
		UPDATE matches
		SET home_score = $1, away_score = $2, updated_at = $3
		WHERE id = $4
	`

	result, err := r.db.ExecContext(ctx, query, homeScore, awayScore, time.Now(), matchID)
	if err != nil {
		return fmt.Errorf("failed to update match score: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("match not found: %s", matchID)
	}

	return nil
}

// UpdateStatus updates the status of a match
func (r *PostgresMatchRepository) UpdateStatus(ctx context.Context, matchID string, status string) error {
	query := `
		UPDATE matches
		SET status = $1, updated_at = $2
		WHERE id = $3
	`

	result, err := r.db.ExecContext(ctx, query, status, time.Now(), matchID)
	if err != nil {
		return fmt.Errorf("failed to update match status: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("match not found: %s", matchID)
	}

	return nil
}

// scanMatch scans a database row into a Match struct
func (r *PostgresMatchRepository) scanMatch(scanner interface{}) (*match.Match, error) {
	var m match.Match

	var scan func(...interface{}) error
	switch s := scanner.(type) {
	case *sql.Row:
		scan = s.Scan
	case *sql.Rows:
		scan = s.Scan
	default:
		return nil, fmt.Errorf("unsupported scanner type: %T", scanner)
	}

	err := scan(
		&m.ID,
		&m.HomeTeamID,
		&m.AwayTeamID,
		&m.SeasonID,
		&m.LeagueID,
		&m.RefereeID,
		&m.ScheduledDate,
		&m.Status,
		&m.HomeScore,
		&m.AwayScore,
		&m.CreatedAt,
		&m.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &m, nil
}
