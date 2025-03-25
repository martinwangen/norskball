import { useQuery, useMutation } from '@vue/apollo-composable';
import { computed } from 'vue';
import { useMatchesStore } from '../stores/matches';
import type { Match, Status, ScoreInput, MatchPlayerInput, RatingInput } from '../gql/__generated__/graphql';
import {
  CREATE_MATCH,
  UPDATE_MATCH,
  DELETE_MATCH,
  UPDATE_MATCH_STATUS,
  UPDATE_MATCH_SCORE
} from '../gql/mutations/match';
import { UPDATE_MATCH_PLAYER } from '../gql/mutations/lineup';
import { ADD_RATING, ADD_SIMPLE_RATING } from '../gql/mutations/rating';

import {
  GET_MATCHES,
  GET_MATCH_DETAILS
} from '../gql/queries/match';

export const matchService = {
  useMatches(first = 20, after?: string) {
    const { result, loading, error, refetch } = useQuery(GET_MATCHES, {
      first,
      after,
      sortBy: {
        scheduledDate: 'ASC'
      }
    });

    // Update store when data changes
    const matchStore = useMatchesStore();
    if (result.value?.matches?.nodes) {
      matchStore.matches = result.value.matches.nodes;
    }

    return {
      matches: result,
      loading,
      error,
      refetch
    };
  },

  useMatch(id: string) {
    const filter = { id: { eq: id } };
    const { result, loading, error, refetch } = useQuery(GET_MATCH_DETAILS, {
      filter
    });

    // Update store when data changes
    const matchStore = useMatchesStore();
    if (result.value?.matches?.nodes?.[0]) {
      const existingIndex = matchStore.matches.findIndex(m => m.id === id);
      if (existingIndex !== -1) {
        matchStore.matches[existingIndex] = result.value.matches.nodes[0];
      } else {
        matchStore.matches.push(result.value.matches.nodes[0]);
      }
    }

    return {
      match: computed(() => result.value?.matches?.nodes?.[0]),
      loading,
      error,
      refetch
    };
  },

  useCreateMatch() {
    const { mutate: createMatch, loading, error } = useMutation(CREATE_MATCH);
    const matchStore = useMatchesStore();

    const execute = async (input: Match) => {
      try {
        const result = await createMatch({ input });
        if (result?.data?.addMatch) {
          matchStore.matches.push(result.data.addMatch);
        }
        return result?.data?.addMatch;
      } catch (err) {
        console.error('Error creating match:', err);
        throw err;
      }
    };

    return {
      createMatch: execute,
      loading,
      error
    };
  },

  useUpdateMatch() {
    const { mutate: updateMatch, loading, error } = useMutation(UPDATE_MATCH);
    const matchStore = useMatchesStore();

    const execute = async (input: Match) => {
      try {
        input.__typename = undefined;
        input.score = undefined
        input.homeTeam = null
        input.awayTeam = null
        input.homeTeamLineup = null
        input.awayTeamLineup = null

        const result = await updateMatch({ input });
        if (result?.data?.updateMatch) {
          const index = matchStore.matches.findIndex(m => m.id === input.id);
          if (index !== -1) {
            matchStore.matches[index] = result.data.updateMatch;
          }
        }
        return result?.data?.updateMatch;
      } catch (err) {
        console.error('Error updating match:', err);
        throw err;
      }
    };

    return {
      updateMatch: execute,
      loading,
      error
    };
  },

  useDeleteMatch() {
    const { mutate: deleteMatch, loading, error } = useMutation(DELETE_MATCH);
    const matchStore = useMatchesStore();

    const execute = async (id: string) => {
      try {
        const result = await deleteMatch({ id });
        if (result?.data?.deleteMatch) {
          const index = matchStore.matches.findIndex(m => m.id === id);
          if (index !== -1) {
            matchStore.matches.splice(index, 1);
          }
        }
        return result?.data?.deleteMatch;
      } catch (err) {
        console.error('Error deleting match:', err);
        throw err;
      }
    };

    return {
      deleteMatch: execute,
      loading,
      error
    };
  },

  useUpdateMatchStatus() {
    const { mutate: updateStatus, loading, error } = useMutation(UPDATE_MATCH_STATUS);
    const matchStore = useMatchesStore();

    const execute = async (id: string, status: Status) => {
      try {
        const result = await updateStatus({ id, status });
        if (result?.data?.updateMatchStatus) {
          const index = matchStore.matches.findIndex(m => m.id === id);
          if (index !== -1) {
            matchStore.matches[index] = result.data.updateMatchStatus;
          }
        }
        return result?.data?.updateMatchStatus;
      } catch (err) {
        console.error('Error updating match status:', err);
        throw err;
      }
    };

    return {
      updateMatchStatus: execute,
      loading,
      error
    };
  },

  useUpdateMatchScore() {
    const { mutate: updateScore, loading, error } = useMutation(UPDATE_MATCH_SCORE);
    const matchStore = useMatchesStore();

    const execute = async (id: string, score: ScoreInput) => {
      try {
        const result = await updateScore({ id, score });
        if (result?.data?.updateMatchScore) {
          const index = matchStore.matches.findIndex(m => m.id === id);
          if (index !== -1) {
            matchStore.matches[index] = result.data.updateMatchScore;
          }
        }
        return result?.data?.updateMatchScore;
      } catch (err) {
        console.error('Error updating match score:', err);
        throw err;
      }
    };

    return {
      updateMatchScore: execute,
      loading,
      error
    };
  },

  useUpdatePlayerRating() {
    const { mutate: updatePlayerRating, loading, error } = useMutation(UPDATE_MATCH_PLAYER);
    const matchStore = useMatchesStore();

    const execute = async (input: MatchPlayerInput) => {
      try {
        const result = await updatePlayerRating({ input });
        if (result?.data?.updateMatchPlayer) {
          // Update the match in the store
          const matchIndex = matchStore.matches.findIndex(m =>
            m.homeTeamLineup?.id === input.lineupId || m.awayTeamLineup?.id === input.lineupId
          );
          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            // Update player in both home and away team lineups if they exist
            if (match.homeTeamLineup) {
              const homePlayerIndex = match.homeTeamLineup.players.findIndex(p => p.id === input.id);
              if (homePlayerIndex !== -1) {
                match.homeTeamLineup.players[homePlayerIndex] = result.data.updateMatchPlayer;
              }
            }
            if (match.awayTeamLineup) {
              const awayPlayerIndex = match.awayTeamLineup.players.findIndex(p => p.id === input.id);
              if (awayPlayerIndex !== -1) {
                match.awayTeamLineup.players[awayPlayerIndex] = result.data.updateMatchPlayer;
              }
            }
          }
        }
        return result?.data?.updateMatchPlayer;
      } catch (err) {
        console.error('Error updating player rating:', err);
        throw err;
      }
    };

    return {
      updatePlayerRating: execute,
      loading,
      error
    };
  },

  useAddRating() {
    const { mutate: addRating, loading, error } = useMutation(ADD_RATING);
    const matchStore = useMatchesStore();

    const execute = async (input: RatingInput) => {
      try {
        console.log('Adding rating with input:', input);
        const result = await addRating({ input });
        console.log('Rating result:', result);

        if (result?.data?.addRating) {
          // Update the match in the store
          const matchIndex = matchStore.matches.findIndex(m =>
            m.homeTeamLineup?.players.some(p => p.id === input.matchPlayerId) ||
            m.awayTeamLineup?.players.some(p => p.id === input.matchPlayerId)
          );

          if (matchIndex !== -1) {
            const match = matchStore.matches[matchIndex];
            // Update player in both home and away team lineups if they exist
            if (match.homeTeamLineup) {
              const homePlayerIndex = match.homeTeamLineup.players.findIndex(p => p.id === input.matchPlayerId);
              if (homePlayerIndex !== -1) {
                if (!match.homeTeamLineup.players[homePlayerIndex].ratings) {
                  match.homeTeamLineup.players[homePlayerIndex].ratings = [];
                }
                match.homeTeamLineup.players[homePlayerIndex].ratings.push(result.data.addRating);
              }
            }
            if (match.awayTeamLineup) {
              const awayPlayerIndex = match.awayTeamLineup.players.findIndex(p => p.id === input.matchPlayerId);
              if (awayPlayerIndex !== -1) {
                if (!match.awayTeamLineup.players[awayPlayerIndex].ratings) {
                  match.awayTeamLineup.players[awayPlayerIndex].ratings = [];
                }
                match.awayTeamLineup.players[awayPlayerIndex].ratings.push(result.data.addRating);
              }
            }
          }
        }
        return result?.data?.addRating;
      } catch (err) {
        console.error('Error adding rating:', err);
        throw err;
      }
    };

    return {
      addRating: execute,
      loading,
      error
    };
  },

  useAddSimpleRating() {
    return useMutation(ADD_SIMPLE_RATING);
  }
};
