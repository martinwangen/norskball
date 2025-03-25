import { gql } from '@apollo/client';
import { PLAYER_FIELDS } from '../fragments/player';

export const CREATE_PLAYER = gql`
  mutation CreatePlayer($input: PlayerInput!) {
    addPlayer(player: $input) {
      ...PlayerFields
    }
  }
  ${PLAYER_FIELDS}
`;

export const UPDATE_PLAYER = gql`
  mutation UpdatePlayer($input: PlayerInput!) {
    updatePlayer(player: $input) {
      ...PlayerFields
    }
  }
  ${PLAYER_FIELDS}
`;

export const DELETE_PLAYER = gql`
  mutation DeletePlayer($id: String!) {
    deletePlayer(id: $id) {
      id
    }
  }
`;
