package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/match"
	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/validation"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports/"
)

// PostgresLineupPlayerRepository is a PostgreSQL implementation of the LineupPlayerRepository interface
type PostgresLineupPlayerRepository struct {
	db *database.PostgresDB
}

// NewPostgresLineupPlayerRepository creates a new PostgreSQL lineup player repository
func NewPostgresLineupPlayerRepository(db *database.PostgresDB) ports.LineupPlayerRepository {
	return &PostgresLineupPlayerRepository{db: db}
}

// Create stores a new lineup player in the database
func (r *PostgresLineupPlayerRepository) Create(ctx context.Context, lp *match.LineupPlayer) error {
	// Validate the entity before creating
	if err := validation.IsValid(ctx, lp); err != nil {
		return fmt.Errorf("validation error: %w", err)
	}

	query := `
		INSERT INTO lineup_players (
			id, lineup_id, player_id, position, stats, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7)
	`

	statsJson, err := json.Marshal(lp.Stats)
	if err != nil {
		return fmt.Errorf("failed to marshal stats: %w", err)
	}

	_, err = r.db.ExecContext(
		ctx,
		query,
		lp.ID,
		lp.LineupID,
		lp.PlayerID,
		string(lp.Position),
		statsJson,
		lp.CreatedAt,
		lp.UpdatedAt,
	)

	return err
}

// GetByID retrieves a lineup player by ID
func (r *PostgresLineupPlayerRepository) GetByID(ctx context.Context, id string) (*match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)
	return r.scanLineupPlayer(row)
}

// Update updates an existing lineup player
func (r *PostgresLineupPlayerRepository) Update(ctx context.Context, lp *match.LineupPlayer) error {
	// Validate the entity before updating
	if err := validation.IsValid(ctx, lp); err != nil {
		return fmt.Errorf("validation error: %w", err)
	}

	query := `
		UPDATE lineup_players
		SET position = $1, stats = $2, updated_at = $3
		WHERE id = $4
	`

	statsJson, err := json.Marshal(lp.Stats)
	if err != nil {
		return fmt.Errorf("failed to marshal stats: %w", err)
	}

	_, err = r.db.ExecContext(
		ctx,
		query,
		string(lp.Position),
		statsJson,
		time.Now(),
		lp.ID,
	)

	return err
}

// Delete removes a lineup player by ID
func (r *PostgresLineupPlayerRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM lineup_players WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("lineup player not found: %s", id)
	}

	return nil
}

// scanLineupPlayer scans a database row into a lineup player domain object
func (r *PostgresLineupPlayerRepository) scanLineupPlayer(scanner interface{}) (*match.LineupPlayer, error) {
	var lp match.LineupPlayer
	var position string
	var statsJson []byte

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
		&lp.ID,
		&lp.LineupID,
		&lp.PlayerID,
		&position,
		&statsJson,
		&lp.CreatedAt,
		&lp.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	lp.Position = match.PlayerPosition(position)

	// Parse the player stats JSON
	err = json.Unmarshal(statsJson, &lp.Stats)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal stats data: %w", err)
	}

	return &lp, nil
}

// scanLineupPlayers scans multiple rows into LineupPlayer structs
func (r *PostgresLineupPlayerRepository) scanLineupPlayers(rows *sqlx.Rows) ([]match.LineupPlayer, error) {
	var players []match.LineupPlayer

	for rows.Next() {
		lp, err := r.scanLineupPlayer(rows)
		if err != nil {
			return nil, err
		}
		players = append(players, *lp)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return players, nil
}

// GetTopGoalScorers retrieves players with most goals in a season
func (r *PostgresLineupPlayerRepository) GetTopGoalScorers(ctx context.Context, season string, limit int) ([]match.LineupPlayer, error) {
	query := `
		SELECT lp.id, lp.lineup_id, lp.match_id, lp.team_id, lp.player_id, lp.position, 
			   lp.jersey_num, lp.captain, lp.stats, lp.created_at, lp.updated_at
		FROM lineup_players lp
		JOIN matches m ON lp.match_id = m.id
		WHERE m.season = $1
		ORDER BY (lp.stats->>'goals')::int DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, season, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetTopAssistProviders retrieves players with most assists in a season
func (r *PostgresLineupPlayerRepository) GetTopAssistProviders(ctx context.Context, season string, limit int) ([]match.LineupPlayer, error) {
	query := `
		SELECT lp.id, lp.lineup_id, lp.match_id, lp.team_id, lp.player_id, lp.position, 
			   lp.jersey_num, lp.captain, lp.stats, lp.created_at, lp.updated_at
		FROM lineup_players lp
		JOIN matches m ON lp.match_id = m.id
		WHERE m.season = $1
		ORDER BY (lp.stats->>'assists')::int DESC
		LIMIT $2
	`

	rows, err := r.db.QueryContext(ctx, query, season, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetByLineupID retrieves lineup players by lineup ID
func (r *PostgresLineupPlayerRepository) GetByLineupID(ctx context.Context, lineupID string) ([]match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE lineup_id = $1
		ORDER BY position
	`

	rows, err := r.db.QueryContext(ctx, query, lineupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetByMatchID retrieves lineup players by match ID
func (r *PostgresLineupPlayerRepository) GetByMatchID(ctx context.Context, matchID string) ([]match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE match_id = $1
		ORDER BY lineup_id, position
	`

	rows, err := r.db.QueryContext(ctx, query, matchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetByTeamID retrieves lineup players by team ID
func (r *PostgresLineupPlayerRepository) GetByTeamID(ctx context.Context, teamID string) ([]match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE team_id = $1
		ORDER BY match_id DESC, lineup_id
	`

	rows, err := r.db.QueryContext(ctx, query, teamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetByPlayerID retrieves lineup players by player ID
func (r *PostgresLineupPlayerRepository) GetByPlayerID(ctx context.Context, playerID string) ([]match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE player_id = $1
		ORDER BY match_id DESC
	`

	rows, err := r.db.QueryContext(ctx, query, playerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanLineupPlayers(rows)
}

// GetByLineupAndPlayerID retrieves a lineup player by lineup ID and player ID
func (r *PostgresLineupPlayerRepository) GetByLineupAndPlayerID(ctx context.Context, lineupID, playerID string) (*match.LineupPlayer, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
		WHERE lineup_id = $1 AND player_id = $2
	`

	row := r.db.QueryRowContext(ctx, query, lineupID, playerID)
	return r.scanLineupPlayer(row)
}

// List retrieves all lineup players with pagination
func (r *PostgresLineupPlayerRepository) List(ctx context.Context, pageSize int32, pageToken string) ([]match.LineupPlayer, string, error) {
	query := `
		SELECT id, lineup_id, match_id, team_id, player_id, position, jersey_num, captain, stats, created_at, updated_at
		FROM lineup_players
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
		return nil, "", fmt.Errorf("failed to list lineup players: %w", err)
	}
	defer rows.Close()

	players, err := r.scanLineupPlayers(rows)
	if err != nil {
		return nil, "", fmt.Errorf("failed to scan lineup players: %w", err)
	}

	// Determine next page token
	var nextPageToken string
	if len(players) > int(pageSize) {
		nextPageToken = players[len(players)-1].ID
		players = players[:len(players)-1] // Remove the extra item
	}

	return players, nextPageToken, nil
}
