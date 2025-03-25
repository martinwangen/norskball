import { gql } from '@apollo/client';

export const ADD_RATING = gql`
  mutation AddRating($input: RatingInput!) {
    addRating(rating: $input) {
      id
      matchPlayerId
      score
      userId
      createdAt
      matchPlayer {
        id
        playerId
        lineupId
        teamId
        position
        isStarter
        averageRating
        ratings {
          id
          score
          userId
        }
      }
    }
  }
`;

export const ADD_SIMPLE_RATING = gql`
  mutation AddSimpleRating($matchPlayerId: String!, $score: Int!) {
    addSimpleRating(matchPlayerId: $matchPlayerId, score: $score) {
      id
      matchPlayerId
      score
      userId
      createdAt
      matchPlayer {
        id
        playerId
        lineupId
        teamId
        position
        isStarter
        averageRating
        ratings {
          id
          score
          userId
          createdAt
        }
      }
    }
  }
`;
