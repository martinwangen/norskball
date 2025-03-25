import { gql } from '@apollo/client';

export const TEAM_FIELDS = gql`
  fragment TeamFields on Team {
    id
    name
    shortName
    logo
    website
    stadium {
      name
      city
      surface
    }
    players {
      id
      firstName
      lastName
      position
      nationality
      dateOfBirth
      imageUrl
    }
  }
`;
