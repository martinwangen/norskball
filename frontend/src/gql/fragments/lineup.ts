import { gql } from '@apollo/client';

export const LINEUP_FIELDS = gql`
  fragment LineupFields on Lineup {
    id
    teamId
    formation
    isStarting
    players {
      id
      player {
        id
        firstName
        lastName
        position
      }
      isStarter
      position
      substitutedInAt
      substitutedOutAt
      averageRating
      ratings {
        id
        score
        userId
      }
    }
    team {
      id
      name
      shortName
    }
    createdAt
    updatedAt
  }
`;
