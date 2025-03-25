import { gql } from '@apollo/client';
import { TEAM_FIELDS } from '../fragments/team';

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: TeamInput!) {
    addTeam(team: $input) {
      ...TeamFields
    }
  }
  ${TEAM_FIELDS}
`;

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($input: TeamInput!) {
    updateTeam(team: $input) {
      ...TeamFields
    }
  }
  ${TEAM_FIELDS}
`;

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: String!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;
