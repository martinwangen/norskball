package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/lineup"
)

// PostgresLineupRepository is a PostgreSQL implementation of the LineupRepository interface
type PostgresLineupRepository struct {
	db *database.PostgresDB
}

// NewPostgresLineupRepository creates a new PostgreSQL lineup repository
func NewPostgresLineupRepository(db *database.PostgresDB) lineup.Repository {
	return &PostgresLineupRepository{db: db}
}

// Create persists a new lineup
func (r *PostgresLineupRepository) Create(ctx context.Context, l *match.Lineup) (*match.Lineup, error) {
	// Validate the entity before creating
	if err := validation.IsValid(ctx, l); err != nil {
		return nil, fmt.Errorf("validation error: %w", err)
	}
	id := uuid.New().String()

	query := `
		INSERT INTO lineups (
			id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, match_id, team_id, formation, is_starting, description, created_at, updated_at
	`

	row := r.db.QueryRowContext(
		ctx,
		query,
		id,
		l.MatchID,
		l.TeamID,
		string(l.Formation),
		l.CreatedAt,
		l.UpdatedAt,
	)

	return r.scanLineup(row)
}

// Get retrieves a lineup by ID
func (r *PostgresLineupRepository) Get(ctx context.Context, id string) (*match.Lineup, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)

	return r.scanLineup(row)
}

// List retrieves a list of lineups with pagination
func (r *PostgresLineupRepository) List(ctx context.Context, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		ORDER BY created_at DESC
	`

	if pageToken != "" {
		query += ` AND id > $1`
	}

	query += ` LIMIT $1`

	args := []interface{}{pageSize + 1}
	if pageToken != "" {
		args = append(args, pageToken)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", err
	}
	defer rows.Close()

	lineups, err := r.scanLineups(rows)
	if err != nil {
		return nil, "", err
	}

	var nextPageToken string
	if len(lineups) > int(pageSize) {
		nextPageToken = lineups[len(lineups)-1].ID
		lineups = lineups[:len(lineups)-1]
	}

	return lineups, nextPageToken, nil
}

// Update updates an existing lineup
func (r *PostgresLineupRepository) Update(ctx context.Context, l *match.Lineup) (*match.Lineup, error) {
	// Validate the entity before updating
	if err := validation.IsValid(ctx, l); err != nil {
		return nil, fmt.Errorf("validation error: %w", err)
	}

	query := `
		UPDATE lineups
		SET formation = $1, is_starting = $2, description = $3, updated_at = $4
		WHERE id = $5
		RETURNING id, match_id, team_id, formation, created_at, updated_at
	`

	row := r.db.QueryRowContext(
		ctx,
		query,
		string(l.Formation),
		time.Now(),
		l.ID,
	)

	return r.scanLineup(row)
}

// Delete removes a lineup by ID
func (r *PostgresLineupRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM lineups WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("lineup not found: %s", id)
	}

	return nil
}

// FindByMatch retrieves lineups for a specific match
func (r *PostgresLineupRepository) FindByMatch(ctx context.Context, matchID string, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		WHERE match_id = $1
		ORDER BY team_id
	`

	if pageToken != "" {
		query += ` AND id > $2`
	}

	query += ` LIMIT $2`

	args := []interface{}{matchID, pageSize + 1}
	if pageToken != "" {
		args = append(args, pageToken)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", err
	}
	defer rows.Close()

	lineups, err := r.scanLineups(rows)
	if err != nil {
		return nil, "", err
	}

	var nextPageToken string
	if len(lineups) > int(pageSize) {
		nextPageToken = lineups[len(lineups)-1].ID
		lineups = lineups[:len(lineups)-1]
	}

	return lineups, nextPageToken, nil
}

// FindByTeam retrieves lineups for a specific team
func (r *PostgresLineupRepository) FindByTeam(ctx context.Context, teamID string, pageSize int32, pageToken string) ([]*match.Lineup, string, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		WHERE team_id = $1
		ORDER BY created_at DESC
	`

	if pageToken != "" {
		query += ` AND id > $2`
	}

	query += ` LIMIT $2`

	args := []interface{}{teamID, pageSize + 1}
	if pageToken != "" {
		args = append(args, pageToken)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, "", err
	}
	defer rows.Close()

	lineups, err := r.scanLineups(rows)
	if err != nil {
		return nil, "", err
	}

	var nextPageToken string
	if len(lineups) > int(pageSize) {
		nextPageToken = lineups[len(lineups)-1].ID
		lineups = lineups[:len(lineups)-1]
	}

	return lineups, nextPageToken, nil
}

// GetStartingLineup retrieves the starting lineup for a match and team
func (r *PostgresLineupRepository) GetStartingLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		WHERE match_id = $1 AND team_id = $2 AND is_starting = true
	`

	row := r.db.QueryRowContext(ctx, query, matchID, teamID)

	return r.scanLineup(row)
}

// GetSubstituteLineup retrieves the substitute lineup for a match and team
func (r *PostgresLineupRepository) GetSubstituteLineup(ctx context.Context, matchID string, teamID string) (*match.Lineup, error) {
	query := `
		SELECT id, match_id, team_id, formation, is_starting, description, created_at, updated_at
		FROM lineups
		WHERE match_id = $1 AND team_id = $2 AND is_starting = false
	`

	row := r.db.QueryRowContext(ctx, query, matchID, teamID)

	return r.scanLineup(row)
}

// AddPlayer adds a player to a lineup
func (r *PostgresLineupRepository) AddPlayer(ctx context.Context, lineupID string, player *match.LineupPlayer) error {
	query := `
		INSERT INTO lineup_players (
			id, lineup_id, player_id, position, 
			stats, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		player.ID,
		lineupID,
		player.PlayerID,
		string(player.Position),
		player.Stats,
		player.CreatedAt,
		player.UpdatedAt,
	)

	return err
}

// RemovePlayer removes a player from a lineup
func (r *PostgresLineupRepository) RemovePlayer(ctx context.Context, lineupID string, playerID string) error {
	query := `DELETE FROM lineup_players WHERE lineup_id = $1 AND player_id = $2`

	_, err := r.db.ExecContext(ctx, query, lineupID, playerID)
	return err
}

// UpdatePlayerPosition updates a player's position in a lineup
func (r *PostgresLineupRepository) UpdatePlayerPosition(ctx context.Context, lineupID string, playerID string, position match.PlayerPosition) error {
	query := `
		UPDATE lineup_players
		SET position = $1, updated_at = $2
		WHERE lineup_id = $3 AND player_id = $4
	`

	_, err := r.db.ExecContext(ctx, query, string(position), time.Now(), lineupID, playerID)
	return err
}

// SetCaptain sets a player as captain in a lineup
func (r *PostgresLineupRepository) SetCaptain(ctx context.Context, lineupID string, playerID string) error {
	// First, remove captain status from all players in the lineup
	query1 := `
		UPDATE lineup_players
		SET captain = false, updated_at = $1
		WHERE lineup_id = $2
	`

	_, err := r.db.ExecContext(ctx, query1, time.Now(), lineupID)
	if err != nil {
		return err
	}

	// Then, set the new captain
	query2 := `
		UPDATE lineup_players
		SET captain = true, updated_at = $1
		WHERE lineup_id = $2 AND player_id = $3
	`

	_, err = r.db.ExecContext(ctx, query2, time.Now(), lineupID, playerID)
	return err
}

// GetLineupPlayers retrieves all players in a lineup
func (r *PostgresLineupRepository) GetLineupPlayers(ctx context.Context, lineupID string) ([]*match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, player_id, position, stats, created_at, updated_at
		FROM lineup_players
		WHERE lineup_id = $1
		ORDER BY position
	`

	rows, err := r.db.QueryContext(ctx, query, lineupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var players []*match.LineupPlayer
	for rows.Next() {
		var player match.LineupPlayer
		var position string
		var statsJson []byte

		err := rows.Scan(
			&player.ID,
			&player.LineupID,
			&player.PlayerID,
			&position,
			&statsJson,
			&player.CreatedAt,
			&player.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		player.Position = match.PlayerPosition(position)

		// Parse the player stats JSON
		err = json.Unmarshal(statsJson, &player.Stats)
		if err != nil {
			return nil, err
		}

		players = append(players, &player)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return players, nil
}

// UpdatePlayerStats updates a player's match statistics
func (r *PostgresLineupRepository) UpdatePlayerStats(ctx context.Context, lineupID string, playerID string, stats match.PlayerMatchStats) error {
	query := `
		UPDATE lineup_players
		SET stats = $1, updated_at = $2
		WHERE lineup_id = $3 AND player_id = $4
	`

	_, err := r.db.ExecContext(ctx, query, stats, time.Now(), lineupID, playerID)
	return err
}

// scanLineup scans a database row into a lineup domain object
func (r *PostgresLineupRepository) scanLineup(scanner interface{}) (*match.Lineup, error) {
	var l match.Lineup
	var formation string

	var scan func(...interface{}) error
	switch s := scanner.(type) {
	case *sqlx.Row:
		scan = s.Scan
	case *sqlx.Rows:
		scan = s.Scan
	default:
		return nil, fmt.Errorf("unsupported scanner type: %T", scanner)
	}

	err := scan(
		&l.ID,
		&l.MatchID,
		&l.TeamID,
		&formation,
		&l.CreatedAt,
		&l.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	l.Formation = match.Formation(formation)
	return &l, nil
}

// scanLineups scans multiple rows into Lineup structs
func (r *PostgresLineupRepository) scanLineups(rows *sqlx.Rows) ([]*match.Lineup, error) {
	var lineups []*match.Lineup

	for rows.Next() {
		l, err := r.scanLineup(rows)
		if err != nil {
			return nil, err
		}
		lineups = append(lineups, l)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return lineups, nil
}
