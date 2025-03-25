import { gql } from '@apollo/client';
import { LINEUP_FIELDS } from '../fragments/lineup';

export const GET_MATCH_LINEUPS = gql`
  query GetMatchLineups($filter: MatchFilterInput) {
    matches(first: 1, where: $filter) {
      nodes {
        ...LineupFields
      }
    }
  }
  ${LINEUP_FIELDS}
`;

export const GET_LINEUP = gql`
  query GetLineup($id: String!) {
    lineup(id: $id) {
      ...LineupFields
    }
  }
  ${LINEUP_FIELDS}
`;

export const GET_TEAM_LINEUPS = gql`
  query GetTeamLineups($teamId: String!, $matchId: String) {
    teamLineups(teamId: $teamId, matchId: $matchId) {
      nodes {
        ...LineupFields
      }
    }
  }
  ${LINEUP_FIELDS}
`;
