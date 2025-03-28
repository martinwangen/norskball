import { gql } from "@apollo/client";

export const GetMatchRatingsOnlyRatedPlayers = gql`
query GetMatchRatingsOnlyRatedPlayers($matchId: String!) {
  matchRatingsOnlyRatedPlayers(matchId: $matchId) {
    id
    homeTeam {
      name
    }
    awayTeam {
      name
    }
    homeTeamLineup {
      players {
        player {
          firstName
          lastName
          id
        }
        ratings{
          score
        }
        position
      }
      }
  awayTeamLineup {
        players {
          player {
           firstName
          lastName
          }
          ratings{
              score
          }
          position
        }
      }

  }
}
`;

export const GetAllMatchRatingsOnlyRatedPlayers = gql`
query GetAllMatchRatingsOnlyRatedPlayers($beforeDate: DateTime) {
  allMatchRatingsOnlyRatedPlayers(beforeDate: $beforeDate, order: {scheduledDate: ASC}) {
    nodes {
      id
      scheduledDate
      homeTeam {
        name
      }
      awayTeam {
        name
      }
      homeTeamLineup {
        players {
          player {
            firstName
            lastName
            id
          }
          ratings {
            score
          }
          position
        }
      }
      awayTeamLineup {
        players {
          player {
            firstName
            lastName
          }
          ratings {
            score
          }
          position
        }
      }
    }
  }
}
`;
