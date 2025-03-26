import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Player, PlayerInput } from '../gql/__generated__/graphql';
import { playerService } from '../services/playerService';

export const usePlayerStore = defineStore('players', () => {
  // State
  const players = ref<Player[]>([]);
  const playersByTeam = ref<Record<string, Player[]>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const totalPlayers = ref(0);

  // Getters
  const getPlayerById = computed(() => (id: string) => {
    return players.value.find(player => player.id === id);
  });

  const getPlayersByTeam = computed(() => (teamId: string) => {
    return playersByTeam.value[teamId] || [];
  });

  // Actions
  async function init() {
    return fetchPlayers();
  }

  async function fetchPlayers() {
    isLoading.value = true;
    error.value = null;
    try {
      const { onResult } = playerService.usePlayers();

      return new Promise<Player[]>((resolve, reject) => {
        onResult((queryResult) => {
          if (queryResult.data?.players?.nodes) {
            players.value = queryResult.data.players.nodes;
            totalPlayers.value = queryResult.data.players.totalCount || 0;
            resolve(queryResult.data.players.nodes);
          } else if (queryResult.error) {
            reject(new Error(queryResult.error.message));
          }
        });
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch players';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPlayerById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      // Check cache first
      const player = getPlayerById.value(id);
      if (player) return player;

      // If not in cache, fetch from API
      const { onResult } = playerService.usePlayer(id);

      return new Promise<Player>((resolve, reject) => {
        onResult((queryResult) => {
          if (queryResult.data?.players?.nodes?.[0]) {
            const playerData = queryResult.data.players.nodes[0];
            // Update cache
            const existingIndex = players.value.findIndex(p => p.id === id);
            if (existingIndex !== -1) {
              players.value[existingIndex] = playerData;
            } else {
              players.value.push(playerData);
            }
            resolve(playerData);
          } else if (queryResult.error) {
            reject(new Error(queryResult.error.message));
          }
        });
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch player';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchPlayersByTeam(teamId: string) {
    isLoading.value = true;
    error.value = null;
    const key = String(teamId);

    try {
      // Check cache first
      if (playersByTeam.value[key]) {
        players.value = playersByTeam.value[key];
        return playersByTeam.value[key];
      }

      // Fetch new data
      const { onResult } = playerService.usePlayersByTeam(teamId);

      return new Promise<Player[]>((resolve, reject) => {
        onResult((queryResult) => {
          if (queryResult.data?.players?.nodes) {
            const teamPlayers = queryResult.data.players.nodes;
            // Update both caches
            playersByTeam.value[key] = teamPlayers;
            players.value = teamPlayers;
            resolve(teamPlayers);
          } else if (queryResult.error) {
            reject(new Error(queryResult.error.message));
          }
        });
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch players';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function createPlayer(input: Omit<PlayerInput, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true;
    error.value = null;
    try {
      const { mutate: createPlayer } = playerService.useCreatePlayer();
      const result = await createPlayer({ input });

      if (result?.data?.addPlayer) {
        players.value.push(result.data.addPlayer);
        return result.data.addPlayer;
      }
      throw new Error('Failed to create player');
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create player';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function updatePlayer(input: PlayerInput) {
    isLoading.value = true;
    error.value = null;
    try {
      const { mutate: updatePlayer } = playerService.useUpdatePlayer();
      const result = await updatePlayer({ input });

      if (result?.data?.updatePlayer) {
        const index = players.value.findIndex(p => p.id === input.id);
        if (index !== -1) {
          players.value[index] = result.data.updatePlayer;
        }
        return result.data.updatePlayer;
      }
      throw new Error('Failed to update player');
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update player';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deletePlayer(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const { mutate: deletePlayer } = playerService.useDeletePlayer();
      const result = await deletePlayer({ id });

      if (result?.data?.deletePlayer) {
        const index = players.value.findIndex(p => p.id === id);
        if (index !== -1) {
          players.value.splice(index, 1);
        }
        return result.data.deletePlayer;
      }
      throw new Error('Failed to delete player');
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete player';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    players,
    playersByTeam,
    isLoading,
    error,
    totalPlayers,

    // Getters
    getPlayerById,
    getPlayersByTeam,

    // Actions
    init,
    fetchPlayers,
    fetchPlayerById,
    fetchPlayersByTeam,
    createPlayer,
    updatePlayer,
    deletePlayer
  };
});
