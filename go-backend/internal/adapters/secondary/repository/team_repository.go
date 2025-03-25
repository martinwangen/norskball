package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	domainTeam "github.com/martinwangen/norskball/apps/backend/internal/core/domain/team"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports"
)

// PostgresTeamRepository is a PostgreSQL implementation of the team Repository interface
type PostgresTeamRepository struct {
	db *database.PostgresDB
}

// NewPostgresTeamRepository creates a new PostgreSQL team repository
func NewPostgresTeamRepository(db *database.PostgresDB) ports.TeamRepository {
	return &PostgresTeamRepository{db: db}
}

// Create persists a new team
func (r *PostgresTeamRepository) Create(ctx context.Context, t *domainTeam.Team) (*domainTeam.Team, error) {
	// Generate ID if not provided
	if t.ID == "" {
		t.ID = uuid.New().String()
	}

	// Set timestamps
	now := time.Now()
	t.CreatedAt = now
	t.UpdatedAt = now

	query := `
		INSERT INTO teams (
			id, name, short_name, league_id, logo, website,
			created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8
		)
		RETURNING id
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		t.ID,
		t.Name,
		t.ShortName,
		t.LeagueID,
		t.Logo,
		t.Website,
		t.CreatedAt,
		t.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create team: %w", err)
	}

	return t, nil
}

// Get retrieves a team by ID
func (r *PostgresTeamRepository) Get(ctx context.Context, id string) (*domainTeam.Team, error) {
	query := `
		SELECT 
			id, name, short_name, league_id, logo, website,
			created_at, updated_at
		FROM teams
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)
	t, err := r.scanTeam(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("team not found: %s", id)
		}
		return nil, fmt.Errorf("failed to get team: %w", err)
	}

	return t, nil
}

// List retrieves a list of teams with pagination
func (r *PostgresTeamRepository) List(ctx context.Context, pageSize int32, pageToken string) ([]*domainTeam.Team, string, error) {
	query := `
		SELECT 
			id, name, short_name, league_id, logo, website,
			created_at, updated_at
		FROM teams
	`

	args := []interface{}{}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " WHERE id > $1"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY id ASC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list teams: %w", err)
	}
	defer rows.Close()

	var teams []*domainTeam.Team
	for rows.Next() {
		t, err := r.scanTeam(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan team: %w", err)
		}
		teams = append(teams, t)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating teams: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(teams) > int(pageSize) {
		nextPageToken = teams[len(teams)-1].ID
		teams = teams[:len(teams)-1] // Remove the extra item
	}

	return teams, nextPageToken, nil
}

// Update updates an existing team
func (r *PostgresTeamRepository) Update(ctx context.Context, t *domainTeam.Team) (*domainTeam.Team, error) {
	// Update timestamp
	t.UpdatedAt = time.Now()

	query := `
		UPDATE teams
		SET 
			name = $1,
			short_name = $2,
			league_id = $3,
			logo = $4,
			website = $5,
			updated_at = $6
		WHERE id = $7
		RETURNING id, name, short_name, league_id, logo, website,
				  created_at, updated_at
	`

	row := r.db.QueryRowContext(
		ctx,
		query,
		t.Name,
		t.ShortName,
		t.LeagueID,
		t.Logo,
		t.Website,
		t.UpdatedAt,
		t.ID,
	)

	updatedTeam, err := r.scanTeam(row)
	if err != nil {
		return nil, fmt.Errorf("failed to update team: %w", err)
	}

	return updatedTeam, nil
}

// Delete removes a team by ID
func (r *PostgresTeamRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM teams WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete team: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("team not found: %s", id)
	}

	return nil
}

// ListPlayers retrieves a list of players for a team with pagination
func (r *PostgresTeamRepository) ListPlayers(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*player.Player, string, error) {
	query := `
		SELECT 
			p.id, p.first_name, p.last_name, p.nationality, p.date_of_birth, 
			p.position, p.image_url, p.team_id, p.created_at, p.updated_at
		FROM players p
		WHERE p.team_id = $1
	`

	args := []interface{}{teamID}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND p.id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY p.id ASC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to list players: %w", err)
	}
	defer rows.Close()

	var players []*player.Player
	for rows.Next() {
		var p player.Player
		err := rows.Scan(
			&p.ID,
			&p.FirstName,
			&p.LastName,
			&p.Nationality,
			&p.DateOfBirth,
			&p.Position,
			&p.ImageURL,
			&p.TeamID,
			&p.CreatedAt,
			&p.UpdatedAt,
		)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan player: %w", err)
		}
		players = append(players, &p)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating players: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(players) > int(pageSize) {
		nextPageToken = players[len(players)-1].ID
		players = players[:len(players)-1] // Remove the extra item
	}

	return players, nextPageToken, nil
}

// FindByCountry retrieves teams from a specific country
func (r *PostgresTeamRepository) FindByCountry(ctx context.Context, country string, pageSize int32, pageToken string) ([]*domainTeam.Team, string, error) {
	query := `
		SELECT 
			id, name, short_name, league_id, logo, website,
			created_at, updated_at
		FROM teams
		WHERE country = $1
	`

	args := []interface{}{country}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY id ASC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find teams by country: %w", err)
	}
	defer rows.Close()

	var teams []*domainTeam.Team
	for rows.Next() {
		t, err := r.scanTeam(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan team: %w", err)
		}
		teams = append(teams, t)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating teams: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(teams) > int(pageSize) {
		nextPageToken = teams[len(teams)-1].ID
		teams = teams[:len(teams)-1] // Remove the extra item
	}

	return teams, nextPageToken, nil
}

// FindByLeague retrieves teams from a specific league
func (r *PostgresTeamRepository) FindByLeague(ctx context.Context, leagueID string, pageSize int32, pageToken string) ([]*domainTeam.Team, string, error) {
	query := `
		SELECT 
			id, name, short_name, league_id, logo, website,
			created_at, updated_at
		FROM teams
		WHERE league_id = $1
	`

	args := []interface{}{leagueID}

	// If pageToken is provided, use it for pagination
	if pageToken != "" {
		query += " AND id > $2"
		args = append(args, pageToken)
	}

	// Add ordering and limit
	query += " ORDER BY id ASC LIMIT $" + fmt.Sprintf("%d", len(args)+1)
	args = append(args, pageSize+1) // Fetch one extra to determine next page token

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", fmt.Errorf("failed to find teams by league: %w", err)
	}
	defer rows.Close()

	var teams []*domainTeam.Team
	for rows.Next() {
		t, err := r.scanTeam(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan team: %w", err)
		}
		teams = append(teams, t)
	}

	if err = rows.Err(); err != nil {
		return nil, "", fmt.Errorf("error iterating teams: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(teams) > int(pageSize) {
		nextPageToken = teams[len(teams)-1].ID
		teams = teams[:len(teams)-1] // Remove the extra item
	}

	return teams, nextPageToken, nil
}

// GetHomeStadium retrieves the home stadium of a team
func (r *PostgresTeamRepository) GetHomeStadium(ctx context.Context, teamID string) (*domainTeam.Stadium, error) {
	query := `
		SELECT 
			s.name, s.city, s.surface
		FROM stadiums s
		JOIN teams t ON t.stadium_id = s.id
		WHERE t.id = $1
	`

	row := r.db.QueryRowContext(ctx, query, teamID)
	var stadium domainTeam.Stadium

	err := row.Scan(
		&stadium.Name,
		&stadium.City,
		&stadium.Surface,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("stadium not found for team: %s", teamID)
		}
		return nil, fmt.Errorf("failed to get stadium: %w", err)
	}

	return &stadium, nil
}

// SetHomeStadium sets the home stadium for a team
func (r *PostgresTeamRepository) SetHomeStadium(ctx context.Context, teamID string, stadiumID string) error {
	query := `UPDATE teams SET stadium_id = $1 WHERE id = $2`

	result, err := r.db.ExecContext(ctx, query, stadiumID, teamID)
	if err != nil {
		return fmt.Errorf("failed to set home stadium: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("team not found: %s", teamID)
	}

	return nil
}

// scanTeam scans a database row into a Team struct
func (r *PostgresTeamRepository) scanTeam(scanner interface{}) (*domainTeam.Team, error) {
	var t domainTeam.Team

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
		&t.ID,
		&t.Name,
		&t.ShortName,
		&t.LeagueID,
		&t.Logo,
		&t.Website,
		&t.CreatedAt,
		&t.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &t, nil
}

// GetUpcomingMatches retrieves upcoming matches for a team
func (r *PostgresTeamRepository) GetUpcomingMatches(ctx context.Context, teamID string, limit int) ([]*match.Match, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id,
			referee_id, scheduled_date, status, home_score, away_score,
			created_at, updated_at
		FROM matches
		WHERE (home_team_id = $1 OR away_team_id = $1)
		AND scheduled_date > NOW()
		ORDER BY scheduled_date ASC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, teamID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get upcoming matches: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		var m match.Match
		err := rows.Scan(
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
			return nil, fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, &m)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating matches: %w", err)
	}

	return matches, nil
}

// GetPastMatches retrieves past matches for a team
func (r *PostgresTeamRepository) GetPastMatches(ctx context.Context, teamID string, limit int) ([]*match.Match, error) {
	query := `
		SELECT 
			id, home_team_id, away_team_id, season_id, league_id,
			referee_id, scheduled_date, status, home_score, away_score,
			created_at, updated_at
		FROM matches
		WHERE (home_team_id = $1 OR away_team_id = $1)
		AND scheduled_date <= NOW()
		ORDER BY scheduled_date DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, teamID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get past matches: %w", err)
	}
	defer rows.Close()

	var matches []*match.Match
	for rows.Next() {
		var m match.Match
		err := rows.Scan(
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
			return nil, fmt.Errorf("failed to scan match: %w", err)
		}
		matches = append(matches, &m)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating matches: %w", err)
	}

	return matches, nil
}

// GetLastLineup retrieves the most recent lineup for a team
func (r *PostgresTeamRepository) GetLastLineup(ctx context.Context, teamID string) (*match.Lineup, error) {
	query := `
		SELECT 
			l.id, l.match_id, l.team_id, l.formation,
			l.created_at, l.updated_at
		FROM lineups l
		JOIN matches m ON l.match_id = m.id
		WHERE l.team_id = $1
		ORDER BY m.scheduled_date DESC
		LIMIT 1
	`

	row := r.db.QueryRowContext(ctx, query, teamID)
	var lineup match.Lineup

	err := row.Scan(
		&lineup.ID,
		&lineup.MatchID,
		&lineup.TeamID,
		&lineup.Formation,
		&lineup.CreatedAt,
		&lineup.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no lineup found for team: %s", teamID)
		}
		return nil, fmt.Errorf("failed to get lineup: %w", err)
	}

	// Get lineup players
	playersQuery := `
		SELECT 
			id, player_id, lineup_id, position,
			created_at, updated_at
		FROM lineup_players
		WHERE lineup_id = $1
	`

	rows, err := r.db.QueryContext(ctx, playersQuery, lineup.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get lineup players: %w", err)
	}
	defer rows.Close()

	var players []match.LineupPlayer
	for rows.Next() {
		var p match.LineupPlayer
		err := rows.Scan(
			&p.ID,
			&p.PlayerID,
			&p.LineupID,
			&p.Position,
			&p.CreatedAt,
			&p.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan lineup player: %w", err)
		}

		// Get player stats
		statsQuery := `
			SELECT 
				goals, assists, yellow_cards, red_cards, minutes_played
			FROM lineup_player_stats
			WHERE lineup_player_id = $1
		`

		var stats match.PlayerMatchStats
		err = r.db.QueryRowContext(ctx, statsQuery, p.ID).Scan(
			&stats.Goals,
			&stats.Assists,
			&stats.YellowCards,
			&stats.RedCards,
			&stats.MinutesPlayed,
		)
		if err != nil && err != sql.ErrNoRows {
			return nil, fmt.Errorf("failed to get player stats: %w", err)
		}
		p.Stats = stats

		// Get player ratings
		ratingsQuery := `
			SELECT 
				id, user_id, rating, created_at, updated_at
			FROM lineup_player_ratings
			WHERE lineup_player_id = $1
		`

		ratingRows, err := r.db.QueryContext(ctx, ratingsQuery, p.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to get player ratings: %w", err)
		}
		defer ratingRows.Close()

		var ratings []match.Rating
		for ratingRows.Next() {
			var r match.Rating
			err := ratingRows.Scan(
				&r.ID,
				&r.UserID,
				&r.Rating,
				&r.CreatedAt,
				&r.UpdatedAt,
			)
			if err != nil {
				return nil, fmt.Errorf("failed to scan rating: %w", err)
			}
			ratings = append(ratings, r)
		}

		if err = ratingRows.Err(); err != nil {
			return nil, fmt.Errorf("error iterating ratings: %w", err)
		}

		p.Ratings = ratings
		players = append(players, p)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating lineup players: %w", err)
	}

	lineup.Players = players

	return &lineup, nil
}

// AddTrophy adds a trophy to a team
func (r *PostgresTeamRepository) AddTrophy(ctx context.Context, teamID string, trophyName string, year int) error {
	query := `
		INSERT INTO team_trophies (team_id, trophy_name, year)
		VALUES ($1, $2, $3)
	`

	result, err := r.db.ExecContext(ctx, query, teamID, trophyName, year)
	if err != nil {
		return fmt.Errorf("failed to add trophy: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("team not found: %s", teamID)
	}

	return nil
}

// RemoveTrophy removes a trophy from a team
func (r *PostgresTeamRepository) RemoveTrophy(ctx context.Context, teamID string, trophyName string, year int) error {
	query := `
		DELETE FROM team_trophies
		WHERE team_id = $1 AND trophy_name = $2 AND year = $3
	`

	result, err := r.db.ExecContext(ctx, query, teamID, trophyName, year)
	if err != nil {
		return fmt.Errorf("failed to remove trophy: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("trophy not found for team: %s", teamID)
	}

	return nil
}

// ListTrophies retrieves all trophies of a team
func (r *PostgresTeamRepository) ListTrophies(ctx context.Context, teamID string) ([]string, error) {
	query := `
		SELECT trophy_name
		FROM team_trophies
		WHERE team_id = $1
		ORDER BY year DESC
	`

	rows, err := r.db.QueryContext(ctx, query, teamID)
	if err != nil {
		return nil, fmt.Errorf("failed to list trophies: %w", err)
	}
	defer rows.Close()

	var trophies []string
	for rows.Next() {
		var trophy string
		err := rows.Scan(&trophy)
		if err != nil {
			return nil, fmt.Errorf("failed to scan trophy: %w", err)
		}
		trophies = append(trophies, trophy)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating trophies: %w", err)
	}

	return trophies, nil
}
