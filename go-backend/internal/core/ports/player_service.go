package ports

//go:generate mockgen -source=service.go -destination=mocks/player_service_mock.go -package=mocks

import (
	"context"

	"github.com/martinwangen/norskball/apps/backend/internal/core/domain/player"
)

type PlayerService interface {
	CreatePlayer(ctx context.Context, p *player.Player) (*player.Player, error)
	GetPlayer(ctx context.Context, id string) (*player.Player, error)
	ListPlayers(ctx context.Context, pageSize int32, pageToken string) ([]*player.Player, string, error)
	UpdatePlayer(ctx context.Context, p *player.Player) (*player.Player, error)
	DeletePlayer(ctx context.Context, id string) error
	GetPlayersByTeamId(ctx context.Context, teamId string) ([]*player.Player, error)
}
