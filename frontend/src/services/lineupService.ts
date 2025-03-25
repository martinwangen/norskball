import { useQuery, useMutation } from '@vue/apollo-composable';
import { useLineupStore } from '../stores/lineups';
import { useMatchesStore } from '../stores/matches';
import type { LineupInput, Match } from '../gql/__generated__/graphql';
import { GET_LINEUP, GET_TEAM_LINEUPS } from '../gql/queries/lineup';
import { SAVE_LINEUP, DELETE_LINEUP } from '../gql/mutations/lineup';

export const lineupService = {
  useLineup(id: string) {
    const { result, loading, error, refetch } = useQuery(GET_LINEUP, {
      id
    });

    // Update store when data changes
    const lineupStore = useLineupStore();
    if (result.value?.lineup) {
      lineupStore.setLineup(result.value.lineup);
    }

    return {
      lineup: result,
      loading,
      error,
      refetch
    };
  },

  useTeamLineups(teamId: string, matchId?: string) {
    const { result, loading, error, refetch } = useQuery(GET_TEAM_LINEUPS, {
      teamId,
      matchId
    });

    // Update store when data changes
    const lineupStore = useLineupStore();
    if (result.value?.teamLineups) {
      result.value.teamLineups.forEach(lineup => {
        lineupStore.setLineup(lineup);
      });
    }

    return {
      lineups: result,
      loading,
      error,
      refetch
    };
  },

  useSaveLineup() {
    const { mutate: saveLineup, loading, error } = useMutation(SAVE_LINEUP);
    const lineupStore = useLineupStore();
    const matchStore = useMatchesStore();

    const execute = async (input: LineupInput) => {
      try {
        const result = await saveLineup({ lineup: input });
        if (result?.data?.saveLineup) {
          const savedLineup = result.data.saveLineup;
          lineupStore.setLineup(savedLineup);

          // Update the match in the store with the new lineup
          const matchIndex = matchStore.matches.findIndex(m => m.id === input.matchId);
          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            const updatedMatch: Match = {
              ...match,
              homeTeamLineupId: match.homeTeamId === input.teamId ? savedLineup.id : match.homeTeamLineupId,
              awayTeamLineupId: match.awayTeamId === input.teamId ? savedLineup.id : match.awayTeamLineupId,
              homeTeamLineup: match.homeTeamId === input.teamId ? savedLineup : match.homeTeamLineup,
              awayTeamLineup: match.awayTeamId === input.teamId ? savedLineup : match.awayTeamLineup
            };
            matchStore.updateMatch(updatedMatch);
          }
        }
        return result?.data?.saveLineup;
      } catch (err) {
        console.error('Error saving lineup:', err);
        throw err;
      }
    };

    return {
      saveLineup: execute,
      loading,
      error
    };
  },

  useDeleteLineup() {
    const { mutate: deleteLineup, loading, error } = useMutation(DELETE_LINEUP);
    const lineupStore = useLineupStore();
    const matchStore = useMatchesStore();

    const execute = async (id: string) => {
      try {
        const result = await deleteLineup({ id });
        if (result?.data?.deleteLineup) {
          lineupStore.removeLineup(id);

          // Update the match in the store to remove the lineup reference
          const matchIndex = matchStore.matches.findIndex(m =>
            m.homeTeamLineupId === id || m.awayTeamLineupId === id
          );
          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            const updatedMatch: Match = {
              ...match,
              homeTeamLineupId: match.homeTeamLineupId === id ? null : match.homeTeamLineupId,
              awayTeamLineupId: match.awayTeamLineupId === id ? null : match.awayTeamLineupId,
              homeTeamLineup: match.homeTeamLineupId === id ? null : match.homeTeamLineup,
              awayTeamLineup: match.awayTeamLineupId === id ? null : match.awayTeamLineup
            };
            matchStore.updateMatch(updatedMatch);
          }
        }
        return result?.data?.deleteLineup;
      } catch (err) {
        console.error('Error deleting lineup:', err);
        throw err;
      }
    };

    return {
      deleteLineup: execute,
      loading,
      error
    };
  }
};
