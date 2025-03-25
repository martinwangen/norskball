import { gql } from '@apollo/client';
import { MATCH_FIELDS } from '../fragments/match';

export const GET_MATCHES = gql`
  query GetMatches($first: Int = 20, $after: String, $sortBy: [MatchSortInput!]) {
    matches(first: $first, after: $after, order: $sortBy) {
      nodes {
        ...MatchFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${MATCH_FIELDS}
`;

export const GET_MATCH_DETAILS = gql`
  query GetMatchDetails($filter: MatchFilterInput) {
    matches(first: 1, where: $filter) {
      nodes {
        ...MatchFields
      }
    }
  }
  ${MATCH_FIELDS}
`;

export const GET_MATCHES_LIST = gql`
  query GetMatchesList($first: Int = 20, $sortBy: [MatchSortInput!]) {
    matches(first: $first, order: $sortBy) {
      nodes {
        id
        homeTeam {
          name
          shortName
        }
        awayTeam {
          name
          shortName
        }
        scheduledDate
        status
        score {
          homeTeamScore
          awayTeamScore
        }
        homeTeamLineup {
          formation
        }
        awayTeamLineup {
          formation
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;
