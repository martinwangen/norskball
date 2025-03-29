// This is just an example,
// so you can safely delete all default props below
import type { MessageSchema } from 'src/boot/i18n';

export default {
  app: {
    title: 'NorskBall'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    notFound: 'Not Found',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    noResults: 'No Results',
    unknown: 'Unknown',
    language: 'Language'
  },
  languages: {
    english: 'English',
    norwegian: 'Norwegian'
  },
  navigation: {
    home: 'Home',
    matches: 'Matches',
    teams: 'Teams',
    players: 'Players',
    ratings: 'Ratings',
    settings: 'Settings',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
  },
  player: {
    name: 'Name',
    position: 'Position',
    team: 'Team',
    rating: 'Rating',
    stats: 'Statistics',
    avatar: 'Player Avatar'
  },
  match: {
    date: 'Date',
    teams: 'Teams',
    score: 'Score',
    venue: 'Venue',
    competition: 'Competition',
    information: 'Match Information',
    status: {
      title: 'Status',
      scheduled: 'Scheduled',
      live: 'Live',
      finished: 'Finished',
      postponed: 'Postponed',
      cancelled: 'Cancelled'
    },
    events: {
      title: 'Match Events',
      noEvents: 'No Events',
      noEventsDescription: 'No events have been recorded for this match yet.',
      goal: 'Goal',
      ownGoal: 'Own Goal',
      yellowCard: 'Yellow Card',
      redCard: 'Red Card',
      substitution: 'Substitution',
      halftime: 'Half Time',
      fullTime: 'Full Time',
      goalBy: '{player} ({team}) {assist}',
      assistBy: 'assisted by {player}',
      yellowCardTo: 'Yellow card to {player} ({team})',
      redCardTo: 'Red card to {player} ({team})',
      substitutionEvent: '{playerOut} replaced by {playerIn} ({team})',
      event: 'Match Event'
    },
    lineups: 'Lineups',
    startMatch: 'Start Match',
    resumeMatch: 'Resume Match',
    endMatch: 'End Match',
    addGoal: 'Add Goal',
    addOwnGoal: 'Add Own Goal',
    addYellowCard: 'Add Yellow Card',
    addRedCard: 'Add Red Card',
    addSubstitution: 'Add Substitution',
    addHalftime: 'Add Halftime'
  },
  matches: {
    title: 'Matches',
    upcoming: 'Upcoming',
    live: 'Live',
    recent: 'Recent',
    all: 'All Matches',
    details: 'Match Details',
    statistics: 'Match Statistics',
    events: {
      title: 'Match Events',
      noEvents: 'No Events',
      noEventsDescription: 'No events have been recorded for this match yet.',
      goal: 'Goal',
      ownGoal: 'Own Goal',
      yellowCard: 'Yellow Card',
      redCard: 'Red Card',
      substitution: 'Substitution',
      halftime: 'Half Time',
      fullTime: 'Full Time',
      goalBy: '{player} ({team}) {assist}',
      assistBy: 'assisted by {player}',
      yellowCardTo: 'Yellow card to {player} ({team})',
      redCardTo: 'Red card to {player} ({team})',
      substitutionEvent: '{playerOut} replaced by {playerIn} ({team})',
      event: 'Match Event'
    },
    information: 'Match Information',
    lineups: 'Match Lineups',
    status: {
      scheduled: 'Scheduled',
      live: 'Live',
      finished: 'Finished',
      postponed: 'Postponed',
      cancelled: 'Cancelled'
    },
    startMatch: 'Start Match',
    resumeMatch: 'Resume Match',
    endMatch: 'End Match',
    addGoal: 'Add Goal',
    addOwnGoal: 'Add Own Goal',
    addYellowCard: 'Add Yellow Card',
    addRedCard: 'Add Red Card',
    addSubstitution: 'Add Substitution',
    addHalftime: 'Add Halftime',
    editDetails: 'Edit Details',
    viewDetails: 'View Details',
    vs: 'vs',
    tbd: 'TBD',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    keyEvents: 'Key Events',
    moreEvents: 'more events'
  },
  rating: {
    overall: 'Overall Rating',
    performance: 'Performance',
    comments: 'Comments',
    submit: 'Submit Rating',
    clickToRate: 'Click to rate'
  },
  teams: {
    title: 'Teams',
    details: 'Team Details',
    roster: 'Team Roster',
    statistics: 'Team Statistics',
    matches: 'Team Matches',
    viewTeam: 'View Team',
    logo: 'Team Logo',
    table: {
      team: 'Team',
      league: 'League',
      loadMore: 'Load More'
    }
  },
  players: {
    title: 'Players',
    details: 'Player Details',
    statistics: 'Player Statistics',
    position: 'Position',
    nationality: 'Nationality',
    age: 'Age',
    height: 'Height',
    weight: 'Weight',
    foot: 'Preferred Foot',
    viewProfile: 'View Profile',
    avatar: 'Player Avatar',
    addPlayer: 'Add Player',
    editPlayer: 'Edit Player',
    filterByTeam: 'Filter by Team',
    allTeams: 'All Teams',
    form: {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      position: 'Position',
      nationality: 'Nationality',
      team: 'Team',
      firstNameRequired: 'First name is required',
      lastNameRequired: 'Last name is required',
      dateOfBirthRequired: 'Date of birth is required',
      positionRequired: 'Position is required',
      nationalityRequired: 'Nationality is required',
      teamRequired: 'Team is required'
    },
    table: {
      team: 'Team',
      name: 'Name',
      position: 'Position',
      nationality: 'Nationality',
      dateOfBirth: 'Date of Birth',
      jersey: 'Jersey',
      actions: 'Actions'
    },
    positions: {
      goalkeeper: 'Goalkeeper',
      gk: 'Goalkeeper',
      defender: 'Defender',
      defence: 'Defender',
      cb: 'Center Back',
      rb: 'Right Back',
      lb: 'Left Back',
      midfielder: 'Midfielder',
      midfield: 'Midfielder',
      cm: 'Central Midfielder',
      cdm: 'Defensive Midfielder',
      cam: 'Attacking Midfielder',
      rm: 'Right Midfielder',
      lm: 'Left Midfielder',
      forward: 'Forward',
      attack: 'Forward',
      st: 'Striker',
      cf: 'Center Forward',
      rw: 'Right Wing',
      lw: 'Left Wing'
    },
    detail: {
      backToPlayers: 'Back to Players',
      noPhoto: 'No Photo',
      birthDate: 'Birth Date',
      team: 'Team',
      viewTeam: 'View Team',
      ratePlayer: 'Rate Player',
      yourRating: 'Your rating: {rating}',
      playerNotFound: 'Player not found',
      rating: 'Rating: {rating}',
      submitRating: 'Submit Rating',
      ratingSubmitted: 'Thank you for rating {name}!'
    }
  },
  stats: {
    possession: 'Possession',
    shots: 'Shots',
    shotsOnTarget: 'Shots on Target',
    corners: 'Corners',
    fouls: 'Fouls',
    yellowCards: 'Yellow Cards',
    redCards: 'Red Cards',
    goals: 'Goals',
    assists: 'Assists',
    appearances: 'Appearances'
  },
  index: {
    welcome: 'Welcome to Norskball',
    subtitle: 'Manage Norwegian football data with ease',
    teams: {
      title: 'Teams',
      description: 'Manage football teams and their details'
    },
    players: {
      title: 'Players',
      description: 'Manage player profiles and statistics'
    },
    matches: {
      title: 'Matches',
      description: 'Track matches and their results'
    },
    quickStats: {
      title: 'Quick Stats',
      teams: 'Teams',
      players: 'Players',
      matches: 'Matches'
    }
  },
  layout: {
    appName: 'Norskball',
    navigation: 'Navigation',
    leagues: 'Leagues',
    copyright: '© {year} Football Ratings App',
    darkMode: {
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode'
    },
    menu: {
      home: 'Home',
      teams: 'Teams',
      players: 'Players',
      matches: 'Matches',
      statistics: 'Statistics',
      ratings: 'Ratings',
      eliteserien: 'Eliteserien'
    }
  }
} satisfies MessageSchema;
