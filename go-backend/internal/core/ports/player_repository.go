package ports

//go:generate mockgen -source=repository.go -destination=mocks/player_repository_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
)

type PlayerRepository interface {
	Create(ctx context.Context, player *player.Player) (*player.Player, error)
	Get(ctx context.Context, id string) (*player.Player, error)
	List(ctx context.Context, pageSize int32, pageToken string) ([]*player.Player, string, error)
	Update(ctx context.Context, player *player.Player) (*player.Player, error)
	Delete(ctx context.Context, id string) error
	GetPlayersByTeamId(ctx context.Context, teamId string) ([]*player.Player, error)
}
