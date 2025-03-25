import { useQuery, useMutation } from '@vue/apollo-composable';
import { ref } from 'vue';
import { usePlayerStore } from '../stores/players';
import type { Player, PlayerInput } from '../gql/__generated__/graphql';
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

// Helper function to get full name
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

export const playerService = {
  usePlayers(first = 34, after?: string) {
    const { result, loading, error, refetch } = useQuery(GET_PLAYERS, {
      first,
      after
    });

    // Update store when data changes
    const playerStore = usePlayerStore();
    if (result.value?.players?.nodes) {
      playerStore.players = result.value.players.nodes;
    }

    return {
      players: result,
      loading,
      error,
      refetch
    };
  },

  usePlayer(id: string) {
    const { result, loading, error, refetch } = useQuery(GET_PLAYER, {
      id
    });

    // Update store when data changes
    const playerStore = usePlayerStore();
    if (result.value?.players?.nodes?.[0]) {
      const existingIndex = playerStore.players.findIndex(p => p.id === id);
      if (existingIndex !== -1) {
        playerStore.players[existingIndex] = result.value.players.nodes[0];
      } else {
        playerStore.players.push(result.value.players.nodes[0]);
      }
    }

    return {
      player: result,
      loading,
      error,
      refetch
    };
  },

  useCreatePlayer() {
    const { mutate: createPlayer, loading, error } = useMutation(CREATE_PLAYER);
    const playerStore = usePlayerStore();

    const execute = async (input: Omit<PlayerInput, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = await createPlayer({ input });
        if (result?.data?.addPlayer) {
          playerStore.players.push(result.data.addPlayer);
        }
        return result?.data?.addPlayer;
      } catch (err) {
        console.error('Error creating player:', err);
        throw err;
      }
    };

    return {
      createPlayer: execute,
      loading,
      error
    };
  },

  useUpdatePlayer() {
    const { mutate: updatePlayer, loading, error } = useMutation(UPDATE_PLAYER);
    const playerStore = usePlayerStore();

    const execute = async (input: PlayerInput) => {
      try {
        const result = await updatePlayer({ input });
        if (result?.data?.updatePlayer) {
          const index = playerStore.players.findIndex(p => p.id === input.id);
          if (index !== -1) {
            playerStore.players[index] = result.data.updatePlayer;
          }
        }
        return result?.data?.updatePlayer;
      } catch (err) {
        console.error('Error updating player:', err);
        throw err;
      }
    };

    return {
      updatePlayer: execute,
      loading,
      error
    };
  },

  useDeletePlayer() {
    const { mutate: deletePlayer, loading, error } = useMutation(DELETE_PLAYER);
    const playerStore = usePlayerStore();

    const execute = async (id: string) => {
      try {
        const result = await deletePlayer({ id });
        if (result?.data?.deletePlayer) {
          const index = playerStore.players.findIndex(p => p.id === id);
          if (index !== -1) {
            playerStore.players.splice(index, 1);
          }
        }
        return result?.data?.deletePlayer;
      } catch (err) {
        console.error('Error deleting player:', err);
        throw err;
      }
    };

    return {
      deletePlayer: execute,
      loading,
      error
    };
  },

  usePlayersByTeam(teamId: string) {
    const { loading, error, refetch, onResult } = useQuery(GET_PLAYERS_BY_TEAM, {
      filter: {
        "teamId": {
          "eq": teamId
        }
      }
    });

    // Create a ref to store the players with the correct structure
    const players = ref<{ nodes: Player[] }>({ nodes: [] });

    // Update store when data changes
    const playerStore = usePlayerStore();
    onResult((queryResult) => {
      if (queryResult.data?.players?.nodes) {
        console.log('Players fetched:', queryResult.data.players.nodes);
        playerStore.playersByTeam[teamId] = queryResult.data.players.nodes;
        players.value = { nodes: queryResult.data.players.nodes };
      }
    });

    return {
      players,
      loading,
      error,
      refetch
    };
  }
};
