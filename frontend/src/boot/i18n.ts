import { createI18n } from 'vue-i18n';
import { boot } from 'quasar/wrappers';
import enUS from 'src/i18n/en-US';
import nbNO from 'src/i18n/nb-NO';
export type MessageSchema = {
  app: {
    title: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    notFound: string;
    back: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    all: string;
    noResults: string;
    unknown: string;
    language: string;
  };
  languages: {
    english: string;
    norwegian: string;
  };
  navigation: {
    home: string;
    matches: string;
    teams: string;
    players: string;
    ratings: string;
    settings: string;
  };
  auth: {
    login: string;
    logout: string;
    username: string;
    password: string;
    forgotPassword: string;
  };
  player: {
    name: string;
    position: string;
    team: string;
    rating: string;
    stats: string;
    avatar: string;
  };
  match: {
    date: string;
    teams: string;
    score: string;
    venue: string;
    competition: string;
    information: string;
    status: {
      title: string;
      scheduled: string;
      live: string;
      finished: string;
      postponed: string;
      cancelled: string;
    };
    events: {
      title: string;
      noEvents: string;
      noEventsDescription: string;
      goal: string;
      ownGoal: string;
      yellowCard: string;
      redCard: string;
      substitution: string;
      halftime: string;
      fullTime: string;
      goalBy: string;
      assistBy: string;
      yellowCardTo: string;
      redCardTo: string;
      substitutionEvent: string;
      event: string;
    };
    lineups: string;
    startMatch: string;
    resumeMatch: string;
    endMatch: string;
    addGoal: string;
    addOwnGoal: string;
    addYellowCard: string;
    addRedCard: string;
    addSubstitution: string;
    addHalftime: string;
  };
  rating: {
    overall: string;
    performance: string;
    comments: string;
    submit: string;
    clickToRate: string;
  };
  matches: {
    title: string;
    upcoming: string;
    live: string;
    recent: string;
    all: string;
    details: string;
    statistics: string;
    events: {
      title: string;
      noEvents: string;
      noEventsDescription: string;
      goal: string;
      ownGoal: string;
      yellowCard: string;
      redCard: string;
      substitution: string;
      halftime: string;
      fullTime: string;
      goalBy: string;
      assistBy: string;
      yellowCardTo: string;
      redCardTo: string;
      substitutionEvent: string;
      event: string;
    };
    information: string;
    lineups: string;
    status: {
      scheduled: string;
      live: string;
      finished: string;
      postponed: string;
      cancelled: string;
    };
    startMatch: string;
    resumeMatch: string;
    endMatch: string;
    addGoal: string;
    addOwnGoal: string;
    addYellowCard: string;
    addRedCard: string;
    addSubstitution: string;
    addHalftime: string;
    editDetails: string;
    viewDetails: string;
    vs: string;
    tbd: string;
    homeTeam: string;
    awayTeam: string;
    keyEvents: string;
    moreEvents: string;
  };
  teams: {
    title: string;
    details: string;
    roster: string;
    statistics: string;
    matches: string;
    viewTeam: string;
    logo: string;
    table: {
      team: string;
      league: string;
      loadMore: string;
    };
  };
  players: {
    title: string;
    details: string;
    statistics: string;
    position: string;
    nationality: string;
    age: string;
    height: string;
    weight: string;
    foot: string;
    viewProfile: string;
    avatar: string;
    addPlayer: string;
    editPlayer: string;
    filterByTeam: string;
    allTeams: string;
    form: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      position: string;
      nationality: string;
      team: string;
      firstNameRequired: string;
      lastNameRequired: string;
      dateOfBirthRequired: string;
      positionRequired: string;
      nationalityRequired: string;
      teamRequired: string;
    };
    table: {
      team: string;
      name: string;
      position: string;
      nationality: string;
      dateOfBirth: string;
      jersey: string;
      actions: string;
    };
    positions: {
      goalkeeper: string;
      gk: string;
      defender: string;
      defence: string;
      cb: string;
      rb: string;
      lb: string;
      midfielder: string;
      midfield: string;
      cm: string;
      cdm: string;
      cam: string;
      rm: string;
      lm: string;
      forward: string;
      attack: string;
      st: string;
      cf: string;
      rw: string;
      lw: string;
    };
    detail: {
      backToPlayers: string;
      noPhoto: string;
      birthDate: string;
      team: string;
      viewTeam: string;
      ratePlayer: string;
      yourRating: string;
      playerNotFound: string;
      rating: string;
      submitRating: string;
      ratingSubmitted: string;
    };
  };
  stats: {
    possession: string;
    shots: string;
    shotsOnTarget: string;
    corners: string;
    fouls: string;
    yellowCards: string;
    redCards: string;
    goals: string;
    assists: string;
    appearances: string;
  };
  index: {
    welcome: string;
    subtitle: string;
    teams: {
      title: string;
      description: string;
    };
    players: {
      title: string;
      description: string;
    };
    matches: {
      title: string;
      description: string;
    };
    quickStats: {
      title: string;
      teams: string;
      players: string;
      matches: string;
    };
  };
  layout: {
    appName: string;
    navigation: string;
    leagues: string;
    copyright: string;
    darkMode: {
      switchToLight: string;
      switchToDark: string;
    };
    menu: {
      home: string;
      teams: string;
      players: string;
      matches: string;
      statistics: string;
      ratings: string;
      eliteserien: string;
    };
  };
};

declare module 'vue-i18n' {
  // Define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {
    // Add any additional properties that might be needed by vue-i18n
    [key: string]: string | Record<string, unknown>;
  }

  // Define the datetime format schema
  export interface DefineDateTimeFormat {
    short: {
      year: 'numeric';
      month: 'short';
      day: 'numeric';
    };
    long: {
      year: 'numeric';
      month: 'long';
      day: 'numeric';
      weekday: 'long';
    };
  }

  // Define the number format schema
  export interface DefineNumberFormat {
    currency: {
      style: 'currency';
      currency: string;
    };
    decimal: {
      minimumFractionDigits: number;
      maximumFractionDigits: number;
    };
  }
}

export default boot(({ app }) => {
  // Create i18n instance
  const i18n = createI18n<false>({
    locale: 'nb-NO',
    fallbackLocale: 'en-US',
    legacy: false,
    messages: {
      'en-US': enUS,
      'nb-NO': nbNO,
    },
    datetimeFormats: {
      'en-US': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }
      },
      'nb-NO': {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }
      }
    },
    numberFormats: {
      'en-US': {
        currency: {
          style: 'currency',
          currency: 'USD'
        },
        decimal: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      },
      'nb-NO': {
        currency: {
          style: 'currency',
          currency: 'NOK'
        },
        decimal: {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      }
    }
  });

  // Set i18n instance on app
  app.use(i18n);

  // Ensure locale is set correctly
  i18n.global.locale.value = 'nb-NO';
});
