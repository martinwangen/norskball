import { useQuery, useMutation } from '@vue/apollo-composable';
import type { Player } from '../gql/__generated__/graphql';
import { Position } from '../gql/__generated__/graphql';
import {
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER
} from '../gql/mutations/player';
import {
  GET_PLAYERS,
  GET_PLAYER,
  GET_PLAYERS_BY_TEAM
} from '../gql/queries/player';

// Helper functions
export const getPlayerFullName = (player: Player): string => {
  return `${player.firstName} ${player.lastName}`.trim();
};

export const getPositionColor = (position: Position): string => {
  const colors = {
    [Position.Goalkeeper]: 'purple',
    [Position.Defender]: 'blue',
    [Position.Midfielder]: 'green',
    [Position.Forward]: 'orange'
  };
  return colors[position];
};

export const getPositionSortOrder = (position: Position): number => {
  const order = {
    [Position.Goalkeeper]: 1,
    [Position.Defender]: 2,
    [Position.Midfielder]: 3,
    [Position.Forward]: 4
  };
  return order[position];
};

// Service functions
export const playerService = {
  usePlayers(first = 34, after?: string) {
    return useQuery(GET_PLAYERS, {
      first,
      after
    });
  },

  usePlayer(id: string) {
    return useQuery(GET_PLAYER, {
      id
    });
  },

  usePlayersByTeam(teamId: string) {
    return useQuery(GET_PLAYERS_BY_TEAM, {
      filter: {
        "teamId": {
          "eq": teamId
        }
      }
    });
  },

  useCreatePlayer() {
    return useMutation(CREATE_PLAYER);
  },

  useUpdatePlayer() {
    return useMutation(UPDATE_PLAYER);
  },

  useDeletePlayer() {
    return useMutation(DELETE_PLAYER);
  }
};
