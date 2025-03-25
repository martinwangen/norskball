import { useQuery } from '@vue/apollo-composable';
import {
  GET_TOP_PLAYERS,
  GET_TEAM_RATINGS
} from '../gql/queries/statistics';

export interface PlayerStats {
  playerId: string;
  playerName: string;
  averageRating: number;
  ratingCount: number;
  matchesPlayed: number;
}

export const statisticsService = {
  useTopPlayers(limit = 10) {
    const { result, loading, error, refetch } = useQuery(GET_TOP_PLAYERS, {
      limit
    });

    return {
      topPlayers: result,
      loading,
      error,
      refetch
    };
  },

  useTeamRatings(teamId: string) {
    const { result, loading, error, refetch } = useQuery(GET_TEAM_RATINGS, {
      teamId
    });

    return {
      teamRatings: result,
      loading,
      error,
      refetch
    };
  }
};
