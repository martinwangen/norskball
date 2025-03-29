import type { MessageSchema } from 'src/boot/i18n';

export default {
  app: {
    title: 'NorskBall'
  },
  common: {
    loading: 'Laster...',
    error: 'Feil',
    success: 'Vellykket',
    notFound: 'Ikke funnet',
    back: 'Tilbake',
    save: 'Lagre',
    cancel: 'Avbryt',
    delete: 'Slett',
    edit: 'Rediger',
    search: 'Søk',
    filter: 'Filtrer',
    all: 'Alle',
    noResults: 'Ingen resultater',
    unknown: 'Ukjent',
    language: 'Språk'
  },
  languages: {
    english: 'Engelsk',
    norwegian: 'Norsk'
  },
  navigation: {
    home: 'Hjem',
    matches: 'Kamper',
    teams: 'Lag',
    players: 'Spillere',
    ratings: 'Vurderinger',
    settings: 'Innstillinger',
  },
  auth: {
    login: 'Logg inn',
    logout: 'Logg ut',
    username: 'Brukernavn',
    password: 'Passord',
    forgotPassword: 'Glemt passord?',
  },
  player: {
    name: 'Navn',
    position: 'Posisjon',
    team: 'Lag',
    rating: 'Vurdering',
    stats: 'Statistikk',
    avatar: 'Spiller Avatar'
  },
  match: {
    date: 'Dato',
    teams: 'Lag',
    score: 'Resultat',
    venue: 'Arena',
    competition: 'Turnering',
    information: 'Kampinformasjon',
    status: {
      title: 'Status',
      scheduled: 'Planlagt',
      live: 'Direkte',
      finished: 'Fullført',
      postponed: 'Utsatt',
      cancelled: 'Kansellert'
    },
    events: {
      title: 'Kamphendelser',
      noEvents: 'Ingen hendelser',
      noEventsDescription: 'Ingen hendelser er registrert for denne kampen ennå.',
      goal: 'Mål',
      ownGoal: 'Selvmål',
      yellowCard: 'Gult kort',
      redCard: 'Rødt kort',
      substitution: 'Innbytting',
      halftime: 'Pause',
      fullTime: 'Full tid',
      goalBy: '{player} ({team}) {assist}',
      assistBy: 'assistert av {player}',
      yellowCardTo: 'Gult kort til {player} ({team})',
      redCardTo: 'Rødt kort til {player} ({team})',
      substitutionEvent: '{playerOut} erstattet av {playerIn} ({team})',
      event: 'Kamphendelse'
    },
    lineups: 'Tropper',
    startMatch: 'Start kamp',
    resumeMatch: 'Fortsett kamp',
    endMatch: 'Avslutt kamp',
    addGoal: 'Legg til mål',
    addOwnGoal: 'Legg til selvmål',
    addYellowCard: 'Legg til gult kort',
    addRedCard: 'Legg til rødt kort',
    addSubstitution: 'Legg til innbytter',
    addHalftime: 'Legg til pause'
  },
  rating: {
    overall: 'Samlet vurdering',
    performance: 'Prestasjon',
    comments: 'Kommentarer',
    submit: 'Send vurdering',
    clickToRate: 'Klikk for å vurdere'
  },
  matches: {
    title: 'Kamper',
    upcoming: 'Kommende',
    live: 'Direkte',
    recent: 'Nylige',
    all: 'Alle Kamper',
    details: 'Kampdetaljer',
    statistics: 'Kampstatistikk',
    events: {
      title: 'Kamphendelser',
      noEvents: 'Ingen hendelser',
      noEventsDescription: 'Ingen hendelser er registrert for denne kampen ennå.',
      goal: 'Mål',
      ownGoal: 'Selvmål',
      yellowCard: 'Gult kort',
      redCard: 'Rødt kort',
      substitution: 'Innbytting',
      halftime: 'Pause',
      fullTime: 'Full tid',
      goalBy: '{player} ({team}) {assist}',
      assistBy: 'assistert av {player}',
      yellowCardTo: 'Gult kort til {player} ({team})',
      redCardTo: 'Rødt kort til {player} ({team})',
      substitutionEvent: '{playerOut} erstattet av {playerIn} ({team})',
      event: 'Kamphendelse'
    },
    information: 'Kampinformasjon',
    lineups: 'Kampoppstillinger',
    status: {
      scheduled: 'Planlagt',
      live: 'Direkte',
      finished: 'Fullført',
      postponed: 'Utsatt',
      cancelled: 'Kansellert'
    },
    startMatch: 'Start kamp',
    resumeMatch: 'Fortsett kamp',
    endMatch: 'Avslutt kamp',
    addGoal: 'Legg til mål',
    addOwnGoal: 'Legg til selvmål',
    addYellowCard: 'Legg til gult kort',
    addRedCard: 'Legg til rødt kort',
    addSubstitution: 'Legg til innbytter',
    addHalftime: 'Legg til pause',
    editDetails: 'Rediger kampdetaljer',
    viewDetails: 'Vis detaljer',
    vs: 'mot',
    tbd: 'Ikke bestemt',
    homeTeam: 'Hjemmelag',
    awayTeam: 'Bortelag',
    keyEvents: 'Viktige hendelser',
    moreEvents: 'flere hendelser'
  },
  teams: {
    title: 'Lag',
    details: 'Lagdetaljer',
    roster: 'Tropp',
    statistics: 'Lagstatistikk',
    matches: 'Lagkamper',
    viewTeam: 'Vis lag',
    logo: 'Laglogo',
    table: {
      team: 'Lag',
      league: 'Liga',
      loadMore: 'Last flere'
    }
  },
  players: {
    title: 'Spillere',
    details: 'Spillerdetaljer',
    statistics: 'Spillerstatistikk',
    position: 'Posisjon',
    nationality: 'Nasjonalitet',
    age: 'Alder',
    height: 'Høyde',
    weight: 'Vekt',
    foot: 'Favorittfot',
    viewProfile: 'Vis profil',
    avatar: 'Spiller Avatar',
    addPlayer: 'Legg til spiller',
    editPlayer: 'Rediger spiller',
    filterByTeam: 'Filtrer etter lag',
    allTeams: 'Alle lag',
    form: {
      firstName: 'Fornavn',
      lastName: 'Etternavn',
      dateOfBirth: 'Fødselsdato',
      position: 'Posisjon',
      nationality: 'Nasjonalitet',
      team: 'Lag',
      firstNameRequired: 'Fornavn er påkrevd',
      lastNameRequired: 'Etternavn er påkrevd',
      dateOfBirthRequired: 'Fødselsdato er påkrevd',
      positionRequired: 'Posisjon er påkrevd',
      nationalityRequired: 'Nasjonalitet er påkrevd',
      teamRequired: 'Lag er påkrevd'
    },
    table: {
      team: 'Lag',
      name: 'Navn',
      position: 'Posisjon',
      nationality: 'Nasjonalitet',
      dateOfBirth: 'Fødselsdato',
      jersey: 'Draktnummer',
      actions: 'Handlinger'
    },
    positions: {
      goalkeeper: 'Målvakt',
      gk: 'Målvakt',
      defender: 'Forsvarer',
      defence: 'Forsvarer',
      cb: 'Midtstopper',
      rb: 'Høyreback',
      lb: 'Venstreback',
      midfielder: 'Midtbanespiller',
      midfield: 'Midtbanespiller',
      cm: 'Sentral midtbanespiller',
      cdm: 'Defensiv midtbanespiller',
      cam: 'Offensiv midtbanespiller',
      rm: 'Høyre midtbanespiller',
      lm: 'Venstre midtbanespiller',
      forward: 'Angrepsspiller',
      attack: 'Angrepsspiller',
      st: 'Spiss',
      cf: 'Sentral angrepsspiller',
      rw: 'Høyreving',
      lw: 'Venstreving'
    },
    detail: {
      backToPlayers: 'Tilbake til spillere',
      noPhoto: 'Ingen foto',
      birthDate: 'Fødselsdato',
      team: 'Lag',
      viewTeam: 'Vis lag',
      ratePlayer: 'Vurder spiller',
      yourRating: 'Din vurdering: {rating}',
      playerNotFound: 'Spiller ikke funnet',
      rating: 'Vurdering: {rating}',
      submitRating: 'Send vurdering',
      ratingSubmitted: 'Takk for at du vurderte {name}!'
    }
  },
  stats: {
    possession: 'Ballbesittelse',
    shots: 'Skudd',
    shotsOnTarget: 'Skudd på mål',
    corners: 'Hjørnespark',
    fouls: 'Frispark',
    yellowCards: 'Gule kort',
    redCards: 'Røde kort',
    goals: 'Mål',
    assists: 'Målgivende',
    appearances: 'Kamper'
  },
  index: {
    welcome: 'Velkommen til Norskball',
    subtitle: 'Administrer norsk fotballdata enkelt',
    teams: {
      title: 'Lag',
      description: 'Administrer fotballag og deres detaljer'
    },
    players: {
      title: 'Spillere',
      description: 'Administrer spillerprofiler og statistikk'
    },
    matches: {
      title: 'Kamper',
      description: 'Spor kamper og deres resultater'
    },
    quickStats: {
      title: 'Rask statistikk',
      teams: 'Lag',
      players: 'Spillere',
      matches: 'Kamper'
    }
  },
  layout: {
    appName: 'Norskball',
    navigation: 'Navigasjon',
    leagues: 'Ligaer',
    copyright: '© {year} Fotball Vurderinger App',
    darkMode: {
      switchToLight: 'Bytt til lyst modus',
      switchToDark: 'Bytt til mørk modus'
    },
    menu: {
      home: 'Hjem',
      teams: 'Lag',
      players: 'Spillere',
      matches: 'Kamper',
      statistics: 'Statistikk',
      ratings: 'Vurderinger',
      eliteserien: 'Eliteserien'
    }
  }
} satisfies MessageSchema;
