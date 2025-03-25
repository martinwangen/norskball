import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Player } from '../gql/__generated__/graphql';
import { playerService } from '../services/playerService';

export const usePlayerStore = defineStore('players', () => {
  const players = ref<Player[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const playersByTeam = ref<Record<string, Player[]>>({});

  const getPlayerById = computed(() => (id: string) => {
    return players.value.find(player => player.id === id);
  });

  const getPlayersByteam_id = computed(() => (team_id: string) => {
    const key = String(team_id);
    if (!playersByTeam.value[key] || playersByTeam.value[key].length === 0) {
      return fetchPlayersByTeam(team_id);
    }
    return Promise.resolve(playersByTeam.value[key] || []);
  });

  function init() {
    return fetchPlayers();
  }

  function fetchPlayers() {
    isLoading.value = true;
    error.value = null;
    try {
      const { players: fetchedPlayers } = playerService.usePlayers();
      players.value = fetchedPlayers.value;
      return fetchedPlayers.value;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch players';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function fetchPlayerById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      // Check cache first
      const player = getPlayerById.value(id);
      if (player) return player;

      // If not in cache, fetch from API
      const { player: playerData } = playerService.usePlayer(id);
      if (playerData.value) {
        // Ensure we don't add duplicate players
        const existingIndex = players.value.findIndex(p => p.id === id);
        if (existingIndex !== -1) {
          players.value[existingIndex] = playerData.value;
        } else {
          players.value.push(playerData.value);
        }
        return playerData.value;
      }
      return null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch player';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function fetchPlayersByTeam(team_id: string): Promise<Player[]> {
    isLoading.value = true;
    error.value = null;
    const key = String(team_id);

    // If we already have the data, return it immediately
    if (playersByTeam.value[key]) {
      isLoading.value = false;
      return Promise.resolve(playersByTeam.value[key]);
    }

    // Initialize the query to trigger data fetching
    playerService.usePlayersByTeam(team_id);

    // Return a promise that resolves when the data is available
    return new Promise((resolve, reject) => {
      const checkData = () => {
        if (playersByTeam.value[key]) {
          isLoading.value = false;
          resolve(playersByTeam.value[key]);
        } else if (error.value) {
          isLoading.value = false;
          reject(new Error(error.value));
        } else {
          // Check again in a short while
          setTimeout(checkData, 100);
        }
      };
      checkData();
    });
  }

  return {
    players,
    isLoading,
    error,
    playersByTeam,
    getPlayerById,
    getPlayersByteam_id,
    init,
    fetchPlayers,
    fetchPlayerById,
    fetchPlayersByTeam
  };
});
