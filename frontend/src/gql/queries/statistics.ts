import { gql } from '@apollo/client/core';

export const GET_TOP_PLAYERS = gql`
  query GetTopPlayers($limit: Int) {
    topPlayers(limit: $limit) {
      playerId
      playerName
      averageRating
      ratingCount
      matchesPlayed
    }
  }
`;

export const GET_TEAM_RATINGS = gql`
  query GetTeamRatings($teamId: String!) {
    teamRatings(teamId: $teamId) {
      playerId
      playerName
      averageRating
      ratingCount
      matchesPlayed
    }
  }
`;

export const GET_DETAILED_PLAYER_STATS = gql`
  query GetDetailedPlayerStats(
    $sortBy: String
    $sortOrder: String
    $startDate: DateTime
    $endDate: DateTime
    $limit: Int
  ) {
    detailedPlayerStats(
      sortBy: $sortBy
      sortOrder: $sortOrder
      startDate: $startDate
      endDate: $endDate
      limit: $limit
    ) {
      playerId
      playerName
      goals
      assists
      yellowCards
      redCards
      matchesPlayed
      averageRating
      highestRating
      ratingCount
    }
  }
`;
