import { useQuery } from '@vue/apollo-composable';
import {
  GET_TOP_PLAYERS,
  GET_TEAM_RATINGS,
  GET_DETAILED_PLAYER_STATS
} from '../gql/queries/statistics';

export interface PlayerStats {
  playerId: string;
  playerName: string;
  averageRating: number;
  ratingCount: number;
  matchesPlayed: number;
}

export interface DetailedPlayerStatsQueryVariables {
  sortBy?: string;
  sortOrder?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface DetailedPlayerStats {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  points: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  averageRating: number;
  highestRating: number;
  ratingCount: number;
}

export interface DetailedPlayerStatsResponse {
  detailedPlayerStats: DetailedPlayerStats[];
}

export const statisticsService = {
  useTopPlayers(limit = 10) {
    const { result, loading, error, refetch } = useQuery(GET_TOP_PLAYERS, {
      limit
    });

    return {
      topPlayers: result.value?.topPlayers || [],
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
      teamRatings: result.value?.teamRatings || [],
      loading,
      error,
      refetch
    };
  },

  useDetailedPlayerStats(options: DetailedPlayerStatsQueryVariables = {}) {
    const { result, loading, error, refetch } = useQuery<DetailedPlayerStatsResponse>(GET_DETAILED_PLAYER_STATS, {
      variables: {
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
        startDate: options.startDate,
        endDate: options.endDate,
        limit: options.limit
      }
    });

    return {
      detailedPlayerStats: result.value?.detailedPlayerStats || [],
      loading,
      error,
      refetch
    };
  }
};
