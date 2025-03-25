package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // PostgreSQL driver

	"github.com/martinwangen/norskball/apps/backend/internal/config"
)

// PostgresDB represents a PostgreSQL database connection
type PostgresDB struct {
	db *sqlx.DB
}

// NewPostgresDB creates a new PostgreSQL database connection
func NewPostgresDB(cfg *config.DatabaseConfig) (*PostgresDB, error) {
	db, err := sqlx.Connect("postgres", cfg.GetDSN())
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Timeout)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &PostgresDB{db: db}, nil
}

// Close closes the database connection
func (p *PostgresDB) Close() error {
	return p.db.Close()
}

// DB returns the underlying sqlx.DB instance
func (p *PostgresDB) DB() *sqlx.DB {
	return p.db
}

// BeginTx starts a new transaction
func (p *PostgresDB) BeginTx(ctx context.Context) (*sqlx.Tx, error) {
	return p.db.BeginTxx(ctx, &sql.TxOptions{})
}

// ExecContext executes a query without returning any rows
func (p *PostgresDB) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return p.db.ExecContext(ctx, query, args...)
}

// QueryContext executes a query that returns rows
func (p *PostgresDB) QueryContext(ctx context.Context, query string, args ...interface{}) (*sqlx.Rows, error) {
	return p.db.QueryxContext(ctx, query, args...)
}

// QueryRowContext executes a query that returns a single row
func (p *PostgresDB) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	return p.db.QueryRowxContext(ctx, query, args...)
}

// NamedExecContext executes a named query without returning any rows
func (p *PostgresDB) NamedExecContext(ctx context.Context, query string, arg interface{}) (sql.Result, error) {
	return p.db.NamedExecContext(ctx, query, arg)
}

// NamedQueryContext executes a named query that returns rows
func (p *PostgresDB) NamedQueryContext(ctx context.Context, query string, arg interface{}) (*sqlx.Rows, error) {
	return p.db.NamedQueryContext(ctx, query, arg)
}

// GetContext gets a single result from a query
func (p *PostgresDB) GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return p.db.GetContext(ctx, dest, query, args...)
}

// SelectContext gets multiple results from a query
func (p *PostgresDB) SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	return p.db.SelectContext(ctx, dest, query, args...)
}
