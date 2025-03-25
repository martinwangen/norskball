import { gql } from '@apollo/client';

export const PLAYER_FIELDS = gql`
  fragment PlayerFields on Player {
    id
    firstName
    lastName
    position
    nationality
    dateOfBirth
    imageUrl
    team {
      id
      name
      shortName
    }
  }
`;
