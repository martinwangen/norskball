import { gql } from '@apollo/client';
import { PLAYER_FIELDS } from '../fragments/player';

export const GET_PLAYERS = gql`
  query GetPlayers($first: Int = 34, $after: String) {
    players(first: $first, after: $after) {
      nodes {
        ...PlayerFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${PLAYER_FIELDS}
`;

export const GET_PLAYER = gql`
  query GetPlayer($filter: PlayerFilterInput) {
    players(first: 1, where: $filter) {
      nodes {
        ...PlayerFields
      }
    }
  }
  ${PLAYER_FIELDS}
`;

export const GET_PLAYERS_BY_TEAM = gql`
  query GetPlayersByTeam($filter: PlayerFilterInput) {
    players(first: 35, where: $filter) {
      nodes {
        ...PlayerFields
      }
    }
  }
  ${PLAYER_FIELDS}
`;
