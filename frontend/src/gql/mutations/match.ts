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

export const ADD_MATCH_EVENT = gql`
  mutation AddMatchEvent($matchEvent: MatchEventInput!) {
    addMatchEvent(matchEvent: $matchEvent) {
      id
      type
      minuteOfMatch
      player {
        id
        firstName
        lastName
      }
      secondaryPlayer {
        id
        firstName
        lastName
      }
      team {
        id
        name
      }
      description
      timestamp
    }
  }
`;

export const ADD_GOAL_EVENT = gql`
  mutation AddGoalEvent(
    $matchId: String!
    $scorerId: String!
    $assisterId: String
    $teamId: String!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
    $isOwnGoal: Boolean! = false
  ) {
    addGoalEvent(
      matchId: $matchId
      scorerId: $scorerId
      assisterId: $assisterId
      teamId: $teamId
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
      isOwnGoal: $isOwnGoal
    ) {
      id
      type
      minuteOfMatch
      playerId
      secondaryPlayerId
      teamId
      description
      timestamp
    }
  }
`;

export const ADD_CARD_EVENT = gql`
  mutation AddCardEvent(
    $matchId: String!
    $playerId: String!
    $teamId: String!
    $cardType: EventType!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
  ) {
    addCardEvent(
      matchId: $matchId
      playerId: $playerId
      teamId: $teamId
      cardType: $cardType
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
    ) {
      id
      type
      minuteOfMatch
      playerId
      teamId
      description
      timestamp
    }
  }
`;

export const ADD_SUBSTITUTION_EVENT = gql`
  mutation AddSubstitutionEvent(
    $matchId: String!
    $playerOutId: String!
    $playerInId: String!
    $teamId: String!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
  ) {
    addSubstitutionEvent(
      matchId: $matchId
      playerOutId: $playerOutId
      playerInId: $playerInId
      teamId: $teamId
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
    ) {
      id
      type
      minuteOfMatch
      playerId
      secondaryPlayerId
      teamId
      description
      timestamp
    }
  }
`;

export const ADD_HALFTIME_EVENT = gql`
  mutation AddHalftimeEvent(
    $matchId: String!
    $timestamp: DateTime!
    $addedMinutes: Int!
  ) {
    addHalftimeEvent(
      matchId: $matchId
      timestamp: $timestamp
      addedMinutes: $addedMinutes
    ) {
      id
      type
      minuteOfMatch
      description
      timestamp
    }
  }
`;
