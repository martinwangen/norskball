import { gql } from '@apollo/client';
import { LINEUP_FIELDS } from '../fragments/lineup';

export const UPDATE_MATCH_PLAYER = gql`
  mutation UpdateMatchPlayer($input: MatchPlayerInput!) {
    updateMatchPlayer(matchPlayer: $input) {
      id
      lineupId
      playerId
      isStarter
      position
      substitutedInAt
      substitutedOutAt
      player {
        id
        firstName
        lastName
        position
      }
      averageRating
      ratings {
        id
        score
        userId
      }
    }
  }
`;

export const ADD_MATCH_PLAYER = gql`
  mutation AddMatchPlayer($input: MatchPlayerInput!) {
    addMatchPlayer(matchPlayer: $input) {
      id
      matchId
      playerId
      isStarter
      position
      teamType
      substitutedInAt
      substitutedOutAt
      player {
        id
        firstName
        lastName
        position
      }
    }
  }
`;

export const SAVE_LINEUP = gql`
  mutation SaveLineup($lineup: LineupInput!) {
    saveLineup(lineup: $lineup) {
      ...LineupFields
    }
  }
  ${LINEUP_FIELDS}
`;

export const DELETE_LINEUP = gql`
  mutation DeleteLineup($id: String!) {
    deleteLineup(id: $id) {
      ...LineupFields
    }
  }
  ${LINEUP_FIELDS}
`;
