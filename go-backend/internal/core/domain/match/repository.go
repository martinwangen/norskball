package match

import (
	"context"
)

// Repository defines the interface for match persistence operations
type Repository interface {
	List(ctx context.Context, pageSize int32, pageToken string) ([]*Match, string, error)
	Get(ctx context.Context, id string) (*Match, error)
	Create(ctx context.Context, match *Match) (*Match, error)
	Update(ctx context.Context, match *Match) (*Match, error)
	Delete(ctx context.Context, id string) error
}
