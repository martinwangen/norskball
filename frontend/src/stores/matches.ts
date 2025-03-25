import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Match } from '../gql/__generated__/graphql';
import { Status } from '../gql/__generated__/graphql';

export const useMatchesStore = defineStore('matches', () => {
  const matches = ref<Match[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setMatches = (newMatches: Match[]) => {
    matches.value = newMatches;
  };

  const addMatch = (match: Match) => {
    matches.value.push(match);
  };

  const updateMatch = (updatedMatch: Match) => {
    const index = matches.value.findIndex(m => m.id === updatedMatch.id);
    if (index !== -1) {
      matches.value[index] = updatedMatch;
    }
  };

  const deleteMatch = (matchId: string) => {
    matches.value = matches.value.filter(m => m.id !== matchId);
  };

  const getLiveMatches = () => {
    return matches.value.filter(m => m.status === Status.InProgress);
  };

  const getUpcomingMatches = () => {
    return matches.value.filter(m => m.status === Status.Scheduled);
  };

  const getFinishedMatches = () => {
    return matches.value.filter(m => m.status === Status.Completed);
  };

  return {
    matches,
    loading,
    error,
    setMatches,
    addMatch,
    updateMatch,
    deleteMatch,
    getLiveMatches,
    getUpcomingMatches,
    getFinishedMatches
  };
});
