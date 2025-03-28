import { defineStore } from 'pinia';
import type { Lineup } from 'src/gql/__generated__/graphql';

interface LineupState {
  lineups: Record<string, Lineup>;
  loading: boolean;
  error: string | null;
}

export const useLineupStore = defineStore('lineup', {
  state: (): LineupState => ({
    lineups: {},
    loading: false,
    error: null,
  }),

  getters: {
    getLineupByTeamAndMatch: (state) => (teamId: string, matchId: string) => {
      return Object.values(state.lineups).find(lineup =>
        lineup.teamId === teamId && lineup.matchId === matchId
      );
    },
    getLineupById: (state) => (id: string) => {
      return state.lineups[id];
    },
  },

  actions: {
    setLineup(lineup: Lineup) {
      if (lineup.id) {
        this.lineups[String(lineup.id)] = lineup;
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    removeLineup(id: string) {
      delete this.lineups[id];
    },
  },
});
