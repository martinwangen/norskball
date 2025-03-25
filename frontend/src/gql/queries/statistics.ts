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
