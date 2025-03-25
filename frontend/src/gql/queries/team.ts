import { gql } from '@apollo/client';
import { TEAM_FIELDS } from '../fragments/team';

export const GET_TEAMS = gql`
  query GetTeams($first: Int = 10, $after: String) {
    teams(first: $first, after: $after) {
      nodes {
        ...TeamFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${TEAM_FIELDS}
`;

export const GET_TEAM = gql`
  query GetTeam($filter: TeamFilterInput) {
    teams(first: 1, where: $filter) {
      nodes {
        ...TeamFields
      }
    }
  }
  ${TEAM_FIELDS}
`;
