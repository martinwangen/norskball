package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/martinwangen/norskball/apps/backend/internal/adapters/secondary/database"
	domainPlayer "github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
	"github.com/martinwangen/norskball/apps/backend/internal/core/ports"
)

// PostgresPlayerRepository is a PostgreSQL implementation of the player Repository interface
type PostgresPlayerRepository struct {
	db *database.PostgresDB
}

// NewPostgresPlayerRepository creates a new PostgreSQL player repository
func NewPostgresPlayerRepository(db *database.PostgresDB) ports.PlayerRepository {
	return &PostgresPlayerRepository{db: db}
}

// Create stores a new player in the database
func (r *PostgresPlayerRepository) Create(ctx context.Context, p *domainPlayer.Player) (*domainPlayer.Player, error) {
	// Validate the player
	if errs := p.Validate(ctx); errs.HasErrors() {
		return nil, fmt.Errorf("validation failed: %s", errs.Error())
	}

	// Generate ID if not provided
	if p.ID == "" {
		p.ID = uuid.New().String()
	}

	// Set timestamps
	now := time.Now()
	p.CreatedAt = now
	p.UpdatedAt = now

	query := `
		INSERT INTO players (
			id, first_name, last_name, nationality, date_of_birth, position,
			image_url, team_id, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10
		)
		RETURNING id
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		p.ID,
		p.FirstName,
		p.LastName,
		p.Nationality,
		p.DateOfBirth,
		p.Position,
		p.ImageURL,
		p.TeamID,
		p.CreatedAt,
		p.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create player: %w", err)
	}

	return p, nil
}

// Get retrieves a player by ID from the database
func (r *PostgresPlayerRepository) Get(ctx context.Context, id string) (*domainPlayer.Player, error) {
	query := `
		SELECT 
			id, first_name, last_name, nationality, date_of_birth, position,
			image_url, team_id, created_at, updated_at
		FROM players
		WHERE id = $1
	`

	row := r.db.QueryRowContext(ctx, query, id)
	p, err := r.scanPlayer(row)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("player not found: %s", id)
		}
		return nil, fmt.Errorf("failed to get player: %w", err)
	}

	return p, nil
}

// GetPlayersByTeamId retrieves a list of players by team ID
func (r *PostgresPlayerRepository) GetPlayersByTeamId(ctx context.Context, teamId string) ([]*domainPlayer.Player, error) {
	query := `
		SELECT 
			id, first_name, last_name, nationality, date_of_birth, position,
			image_url, team_id, created_at, updated_at
		FROM players
		WHERE team_id = $1
	`

	rows, err := r.db.QueryContext(ctx, query, teamId)
	if err != nil {
		return nil, fmt.Errorf("failed to get players by team ID: %w", err)
	}
	defer rows.Close()

	var players []*domainPlayer.Player
	for rows.Next() {
		p, err := r.scanPlayer(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan player: %w", err)
		}
		players = append(players, p)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating players: %w", err)
	}

	return players, nil
}

// List retrieves a paginated list of players from the database
func (r *PostgresPlayerRepository) List(ctx context.Context, pageSize int32, pageToken string) ([]*domainPlayer.Player, string, error) {
	query := `
		SELECT 
			id, first_name, last_name, nationality, date_of_birth, position,
			image_url, team_id, created_at, updated_at
		FROM players
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
		return nil, "", fmt.Errorf("failed to list players: %w", err)
	}
	defer rows.Close()

	var players []*domainPlayer.Player
	for rows.Next() {
		p, err := r.scanPlayer(rows)
		if err != nil {
			return nil, "", fmt.Errorf("failed to scan player: %w", err)
		}
		players = append(players, p)
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

// Update updates an existing player in the database
func (r *PostgresPlayerRepository) Update(ctx context.Context, p *domainPlayer.Player) (*domainPlayer.Player, error) {
	// Validate the player
	if errs := p.Validate(ctx); errs.HasErrors() {
		return nil, fmt.Errorf("validation failed: %s", errs.Error())
	}

	// Update timestamp
	p.UpdatedAt = time.Now()

	query := `
		UPDATE players
		SET 
			first_name = $1,
			last_name = $2,
			nationality = $3,
			date_of_birth = $4,
			position = $5,
			image_url = $6,
			team_id = $7,
			updated_at = $8
		WHERE id = $9
		RETURNING id, first_name, last_name, nationality, date_of_birth, position,
				  image_url, team_id, created_at, updated_at
	`

	row := r.db.QueryRowContext(
		ctx,
		query,
		p.FirstName,
		p.LastName,
		p.Nationality,
		p.DateOfBirth,
		p.Position,
		p.ImageURL,
		p.TeamID,
		p.UpdatedAt,
		p.ID,
	)

	updatedPlayer, err := r.scanPlayer(row)
	if err != nil {
		return nil, fmt.Errorf("failed to update player: %w", err)
	}

	return updatedPlayer, nil
}

// Delete removes a player from the database
func (r *PostgresPlayerRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM players WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete player: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("player not found: %s", id)
	}

	return nil
}

// scanPlayer scans a database row into a Player struct
func (r *PostgresPlayerRepository) scanPlayer(scanner interface{}) (*domainPlayer.Player, error) {
	var p domainPlayer.Player

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
		return nil, err
	}

	return &p, nil
}
