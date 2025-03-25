import { gql } from '@apollo/client';
import { MATCH_FIELDS } from '../fragments/match';

export const CREATE_MATCH = gql`
  mutation CreateMatch($input: MatchInput!) {
    addMatch(match: $input) {
      ...MatchFields
    }
  }
  ${MATCH_FIELDS}
`;

export const UPDATE_MATCH = gql`
  mutation UpdateMatch($input: MatchInput!) {
    updateMatch(match: $input) {
      ...MatchFields
    }
  }
  ${MATCH_FIELDS}
`;

export const DELETE_MATCH = gql`
  mutation DeleteMatch($id: String!) {
    deleteMatch(id: $id) {
      id
    }
  }
`;

export const UPDATE_MATCH_STATUS = gql`
  mutation UpdateMatchStatus($id: String!, $status: Status!) {
    updateMatchStatus(id: $id, status: $status) {
      ...MatchFields
    }
  }
  ${MATCH_FIELDS}
`;

export const UPDATE_MATCH_SCORE = gql`
  mutation UpdateMatchScore($id: String!, $score: ScoreInput!) {
    updateMatchScore(id: $id, score: $score) {
      ...MatchFields
    }
  }
  ${MATCH_FIELDS}
`;
