import { gql } from '@apollo/client';
import { LINEUP_FIELDS } from './lineup';

export const MATCH_FIELDS = gql`
  fragment MatchFields on Match {
    id
    homeTeamId
    awayTeamId
    homeTeamLineupId
    awayTeamLineupId
    scheduledDate
    status
    score {
      homeTeamScore
      awayTeamScore
    }
    homeTeam {
      id
      name
      shortName
      logo
    }
    awayTeam {
      id
      name
      shortName
      logo
    }
    homeTeamLineup {
      ...LineupFields
    }
    awayTeamLineup {
      ...LineupFields
    }
    events {
      id
      type
      timestamp
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
    }
    createdAt
    updatedAt
  }
  ${LINEUP_FIELDS}
`;
