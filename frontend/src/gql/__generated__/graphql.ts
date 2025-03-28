/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

/** A connection to a list of items. */
export type AllMatchRatingsOnlyRatedPlayersConnection = {
  __typename?: 'AllMatchRatingsOnlyRatedPlayersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<AllMatchRatingsOnlyRatedPlayersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Match>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type AllMatchRatingsOnlyRatedPlayersEdge = {
  __typename?: 'AllMatchRatingsOnlyRatedPlayersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Match;
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DetailedPlayerStats = {
  __typename?: 'DetailedPlayerStats';
  assists: Scalars['Int']['output'];
  averageRating: Scalars['Float']['output'];
  goals: Scalars['Int']['output'];
  highestRating: Scalars['Float']['output'];
  matchesPlayed: Scalars['Int']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  points: Scalars['Int']['output'];
  ratingCount: Scalars['Int']['output'];
  redCards: Scalars['Int']['output'];
  yellowCards: Scalars['Int']['output'];
};

export enum EventType {
  GameEnd = 'GAME_END',
  GameStart = 'GAME_START',
  Goal = 'GOAL',
  HalfTimeEnd = 'HALF_TIME_END',
  HalfTimeStart = 'HALF_TIME_START',
  OwnGoal = 'OWN_GOAL',
  PenaltyMissed = 'PENALTY_MISSED',
  PenaltyScored = 'PENALTY_SCORED',
  RedCard = 'RED_CARD',
  Substitution = 'SUBSTITUTION',
  YellowCard = 'YELLOW_CARD'
}

export type EventTypeOperationFilterInput = {
  eq?: InputMaybe<EventType>;
  in?: InputMaybe<Array<EventType>>;
  neq?: InputMaybe<EventType>;
  nin?: InputMaybe<Array<EventType>>;
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

export enum Formation {
  /** 3-4-3 */
  Formation343 = 'FORMATION343',
  /** 3-5-2 */
  Formation352 = 'FORMATION352',
  /** 4-3-3 */
  Formation433 = 'FORMATION433',
  /** 4-4-2 */
  Formation442 = 'FORMATION442',
  /** 4-5-1 */
  Formation451 = 'FORMATION451',
  /** 5-2-3 */
  Formation523 = 'FORMATION523',
  /** 5-3-2 */
  Formation532 = 'FORMATION532',
  /** 5-4-1 */
  Formation541 = 'FORMATION541',
  /** 3-1-4-2 */
  Formation3142 = 'FORMATION3142',
  /** 4-1-4-1 */
  Formation4141 = 'FORMATION4141',
  /** 4-2-3-1 */
  Formation4231 = 'FORMATION4231',
  /** 4-3-2-1 */
  Formation4321 = 'FORMATION4321',
  /** Custom */
  FormationCustom = 'FORMATION_CUSTOM'
}

export type FormationOperationFilterInput = {
  eq?: InputMaybe<Formation>;
  in?: InputMaybe<Array<Formation>>;
  neq?: InputMaybe<Formation>;
  nin?: InputMaybe<Array<Formation>>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents a lineup in a match. */
export type Lineup = {
  __typename?: 'Lineup';
  createdAt: Scalars['DateTime']['output'];
  formation: Formation;
  id: Scalars['String']['output'];
  isStarting: Scalars['Boolean']['output'];
  match?: Maybe<Match>;
  matchId: Scalars['String']['output'];
  players: Array<MatchPlayer>;
  team?: Maybe<Team>;
  teamId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Represents a lineup in a match. */
export type LineupFilterInput = {
  and?: InputMaybe<Array<LineupFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  formation?: InputMaybe<FormationOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isStarting?: InputMaybe<BooleanOperationFilterInput>;
  match?: InputMaybe<MatchFilterInput>;
  matchId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LineupFilterInput>>;
  players?: InputMaybe<ListFilterInputTypeOfMatchPlayerFilterInput>;
  team?: InputMaybe<TeamFilterInput>;
  teamId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

/** Represents a lineup in a match. */
export type LineupInput = {
  createdAt: Scalars['DateTime']['input'];
  formation: Formation;
  id: Scalars['String']['input'];
  isStarting: Scalars['Boolean']['input'];
  match?: InputMaybe<MatchInput>;
  matchId: Scalars['String']['input'];
  players: Array<MatchPlayerInput>;
  team?: InputMaybe<TeamInput>;
  teamId: Scalars['String']['input'];
  updatedAt: Scalars['DateTime']['input'];
};

/** Represents a lineup in a match. */
export type LineupSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  formation?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isStarting?: InputMaybe<SortEnumType>;
  match?: InputMaybe<MatchSortInput>;
  matchId?: InputMaybe<SortEnumType>;
  team?: InputMaybe<TeamSortInput>;
  teamId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type ListFilterInputTypeOfMatchEventFilterInput = {
  all?: InputMaybe<MatchEventFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MatchEventFilterInput>;
  some?: InputMaybe<MatchEventFilterInput>;
};

export type ListFilterInputTypeOfMatchFilterInput = {
  all?: InputMaybe<MatchFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MatchFilterInput>;
  some?: InputMaybe<MatchFilterInput>;
};

export type ListFilterInputTypeOfMatchPlayerFilterInput = {
  all?: InputMaybe<MatchPlayerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<MatchPlayerFilterInput>;
  some?: InputMaybe<MatchPlayerFilterInput>;
};

export type ListFilterInputTypeOfPlayerFilterInput = {
  all?: InputMaybe<PlayerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PlayerFilterInput>;
  some?: InputMaybe<PlayerFilterInput>;
};

export type ListFilterInputTypeOfRatingFilterInput = {
  all?: InputMaybe<RatingFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<RatingFilterInput>;
  some?: InputMaybe<RatingFilterInput>;
};

export type Match = {
  __typename?: 'Match';
  awayTeam?: Maybe<Team>;
  awayTeamId: Scalars['String']['output'];
  awayTeamLineup?: Maybe<Lineup>;
  awayTeamLineupId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  events?: Maybe<Array<MatchEvent>>;
  homeTeam?: Maybe<Team>;
  homeTeamId: Scalars['String']['output'];
  homeTeamLineup?: Maybe<Lineup>;
  homeTeamLineupId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  referee?: Maybe<Referee>;
  refereeId?: Maybe<Scalars['UUID']['output']>;
  scheduledDate: Scalars['DateTime']['output'];
  score?: Maybe<Score>;
  status: Status;
  updatedAt: Scalars['DateTime']['output'];
};

export type MatchEvent = {
  __typename?: 'MatchEvent';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  match?: Maybe<Match>;
  matchId: Scalars['String']['output'];
  minuteOfMatch: Scalars['Int']['output'];
  player?: Maybe<Player>;
  playerId?: Maybe<Scalars['String']['output']>;
  secondaryPlayer?: Maybe<Player>;
  secondaryPlayerId?: Maybe<Scalars['String']['output']>;
  team?: Maybe<Team>;
  teamId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  type: EventType;
};

export type MatchEventFilterInput = {
  and?: InputMaybe<Array<MatchEventFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  match?: InputMaybe<MatchFilterInput>;
  matchId?: InputMaybe<StringOperationFilterInput>;
  minuteOfMatch?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<MatchEventFilterInput>>;
  player?: InputMaybe<PlayerFilterInput>;
  playerId?: InputMaybe<StringOperationFilterInput>;
  secondaryPlayer?: InputMaybe<PlayerFilterInput>;
  secondaryPlayerId?: InputMaybe<StringOperationFilterInput>;
  team?: InputMaybe<TeamFilterInput>;
  teamId?: InputMaybe<StringOperationFilterInput>;
  timestamp?: InputMaybe<DateTimeOperationFilterInput>;
  type?: InputMaybe<EventTypeOperationFilterInput>;
};

export type MatchEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  match?: InputMaybe<MatchInput>;
  matchId: Scalars['String']['input'];
  minuteOfMatch: Scalars['Int']['input'];
  player?: InputMaybe<PlayerInput>;
  playerId?: InputMaybe<Scalars['String']['input']>;
  secondaryPlayer?: InputMaybe<PlayerInput>;
  secondaryPlayerId?: InputMaybe<Scalars['String']['input']>;
  team?: InputMaybe<TeamInput>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  timestamp: Scalars['DateTime']['input'];
  type: EventType;
};

export type MatchEventSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  match?: InputMaybe<MatchSortInput>;
  matchId?: InputMaybe<SortEnumType>;
  minuteOfMatch?: InputMaybe<SortEnumType>;
  player?: InputMaybe<PlayerSortInput>;
  playerId?: InputMaybe<SortEnumType>;
  secondaryPlayer?: InputMaybe<PlayerSortInput>;
  secondaryPlayerId?: InputMaybe<SortEnumType>;
  team?: InputMaybe<TeamSortInput>;
  teamId?: InputMaybe<SortEnumType>;
  timestamp?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type MatchEventsConnection = {
  __typename?: 'MatchEventsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MatchEventsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<MatchEvent>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MatchEventsEdge = {
  __typename?: 'MatchEventsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: MatchEvent;
};

export type MatchFilterInput = {
  and?: InputMaybe<Array<MatchFilterInput>>;
  awayTeam?: InputMaybe<TeamFilterInput>;
  awayTeamId?: InputMaybe<StringOperationFilterInput>;
  awayTeamLineup?: InputMaybe<LineupFilterInput>;
  awayTeamLineupId?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  events?: InputMaybe<ListFilterInputTypeOfMatchEventFilterInput>;
  homeTeam?: InputMaybe<TeamFilterInput>;
  homeTeamId?: InputMaybe<StringOperationFilterInput>;
  homeTeamLineup?: InputMaybe<LineupFilterInput>;
  homeTeamLineupId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MatchFilterInput>>;
  rating?: InputMaybe<IntOperationFilterInput>;
  referee?: InputMaybe<RefereeFilterInput>;
  refereeId?: InputMaybe<UuidOperationFilterInput>;
  scheduledDate?: InputMaybe<DateTimeOperationFilterInput>;
  score?: InputMaybe<ScoreFilterInput>;
  status?: InputMaybe<StatusOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type MatchInput = {
  awayTeam?: InputMaybe<TeamInput>;
  awayTeamId: Scalars['String']['input'];
  awayTeamLineup?: InputMaybe<LineupInput>;
  awayTeamLineupId?: InputMaybe<Scalars['String']['input']>;
  createdAt: Scalars['DateTime']['input'];
  events?: InputMaybe<Array<MatchEventInput>>;
  homeTeam?: InputMaybe<TeamInput>;
  homeTeamId: Scalars['String']['input'];
  homeTeamLineup?: InputMaybe<LineupInput>;
  homeTeamLineupId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  referee?: InputMaybe<RefereeInput>;
  refereeId?: InputMaybe<Scalars['UUID']['input']>;
  scheduledDate: Scalars['DateTime']['input'];
  score?: InputMaybe<ScoreInput>;
  status: Status;
  updatedAt: Scalars['DateTime']['input'];
};

export type MatchPlayer = {
  __typename?: 'MatchPlayer';
  averageRating?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  isStarter: Scalars['Boolean']['output'];
  lineup?: Maybe<Lineup>;
  lineupId: Scalars['String']['output'];
  player?: Maybe<Player>;
  playerId: Scalars['String']['output'];
  position: Scalars['String']['output'];
  ratings?: Maybe<Array<Rating>>;
  substitutedInAt?: Maybe<Scalars['DateTime']['output']>;
  substitutedOutAt?: Maybe<Scalars['DateTime']['output']>;
  team?: Maybe<Team>;
  teamId: Scalars['String']['output'];
};

export type MatchPlayerFilterInput = {
  and?: InputMaybe<Array<MatchPlayerFilterInput>>;
  averageRating?: InputMaybe<FloatOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  isStarter?: InputMaybe<BooleanOperationFilterInput>;
  lineup?: InputMaybe<LineupFilterInput>;
  lineupId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MatchPlayerFilterInput>>;
  player?: InputMaybe<PlayerFilterInput>;
  playerId?: InputMaybe<StringOperationFilterInput>;
  position?: InputMaybe<StringOperationFilterInput>;
  ratings?: InputMaybe<ListFilterInputTypeOfRatingFilterInput>;
  substitutedInAt?: InputMaybe<DateTimeOperationFilterInput>;
  substitutedOutAt?: InputMaybe<DateTimeOperationFilterInput>;
  team?: InputMaybe<TeamFilterInput>;
  teamId?: InputMaybe<StringOperationFilterInput>;
};

export type MatchPlayerInput = {
  id: Scalars['String']['input'];
  isStarter: Scalars['Boolean']['input'];
  lineup?: InputMaybe<LineupInput>;
  lineupId: Scalars['String']['input'];
  player?: InputMaybe<PlayerInput>;
  playerId: Scalars['String']['input'];
  position: Scalars['String']['input'];
  ratings?: InputMaybe<Array<RatingInput>>;
  substitutedInAt?: InputMaybe<Scalars['DateTime']['input']>;
  substitutedOutAt?: InputMaybe<Scalars['DateTime']['input']>;
  team?: InputMaybe<TeamInput>;
  teamId: Scalars['String']['input'];
};

export type MatchPlayerSortInput = {
  averageRating?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isStarter?: InputMaybe<SortEnumType>;
  lineup?: InputMaybe<LineupSortInput>;
  lineupId?: InputMaybe<SortEnumType>;
  player?: InputMaybe<PlayerSortInput>;
  playerId?: InputMaybe<SortEnumType>;
  position?: InputMaybe<SortEnumType>;
  substitutedInAt?: InputMaybe<SortEnumType>;
  substitutedOutAt?: InputMaybe<SortEnumType>;
  team?: InputMaybe<TeamSortInput>;
  teamId?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type MatchPlayersConnection = {
  __typename?: 'MatchPlayersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MatchPlayersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<MatchPlayer>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MatchPlayersEdge = {
  __typename?: 'MatchPlayersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: MatchPlayer;
};

export type MatchSortInput = {
  awayTeam?: InputMaybe<TeamSortInput>;
  awayTeamId?: InputMaybe<SortEnumType>;
  awayTeamLineup?: InputMaybe<LineupSortInput>;
  awayTeamLineupId?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  homeTeam?: InputMaybe<TeamSortInput>;
  homeTeamId?: InputMaybe<SortEnumType>;
  homeTeamLineup?: InputMaybe<LineupSortInput>;
  homeTeamLineupId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  referee?: InputMaybe<RefereeSortInput>;
  refereeId?: InputMaybe<SortEnumType>;
  scheduledDate?: InputMaybe<SortEnumType>;
  score?: InputMaybe<ScoreSortInput>;
  status?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type MatchesConnection = {
  __typename?: 'MatchesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MatchesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Match>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MatchesEdge = {
  __typename?: 'MatchesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Match;
};

/** Represents the mutations available. */
export type Mutation = {
  __typename?: 'Mutation';
  addCardEvent: MatchEvent;
  addGoalEvent: MatchEvent;
  addHalftimeEvent: MatchEvent;
  addMatch: Match;
  addMatchEvent: MatchEvent;
  addMatchPlayer: MatchPlayer;
  addPlayer: Player;
  addRating: Rating;
  addSimpleRating: Rating;
  addSubstitutionEvent: MatchEvent;
  addTeam: Team;
  createReferee: Referee;
  deleteLineup: Lineup;
  deleteMatch: Match;
  deleteMatchEvent: MatchEvent;
  deleteMatchPlayer: MatchPlayer;
  deletePlayer: Player;
  deleteRating: Rating;
  deleteReferee: Scalars['Boolean']['output'];
  deleteTeam: Team;
  saveLineup: Lineup;
  substitutePlayer: MatchPlayer;
  updateMatch: Match;
  updateMatchEvent: MatchEvent;
  updateMatchPlayer: MatchPlayer;
  updateMatchScore: Match;
  updateMatchStatus: Match;
  updatePlayer: Player;
  updateRating: Rating;
  updateReferee?: Maybe<Referee>;
  updateTeam: Team;
};


/** Represents the mutations available. */
export type MutationAddCardEventArgs = {
  cardType: EventType;
  matchId: Scalars['String']['input'];
  minuteOfMatch: Scalars['Int']['input'];
  playerId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  timestamp: Scalars['DateTime']['input'];
};


/** Represents the mutations available. */
export type MutationAddGoalEventArgs = {
  assisterId?: InputMaybe<Scalars['String']['input']>;
  isOwnGoal?: Scalars['Boolean']['input'];
  matchId: Scalars['String']['input'];
  minuteOfMatch: Scalars['Int']['input'];
  scorerId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  timestamp: Scalars['DateTime']['input'];
};


/** Represents the mutations available. */
export type MutationAddHalftimeEventArgs = {
  addedMinutes: Scalars['Int']['input'];
  matchId: Scalars['String']['input'];
  timestamp: Scalars['DateTime']['input'];
};


/** Represents the mutations available. */
export type MutationAddMatchArgs = {
  match: MatchInput;
};


/** Represents the mutations available. */
export type MutationAddMatchEventArgs = {
  matchEvent: MatchEventInput;
};


/** Represents the mutations available. */
export type MutationAddMatchPlayerArgs = {
  matchPlayer: MatchPlayerInput;
};


/** Represents the mutations available. */
export type MutationAddPlayerArgs = {
  player: PlayerInput;
};


/** Represents the mutations available. */
export type MutationAddRatingArgs = {
  rating: RatingInput;
};


/** Represents the mutations available. */
export type MutationAddSimpleRatingArgs = {
  matchPlayerId: Scalars['String']['input'];
  score: Scalars['Int']['input'];
};


/** Represents the mutations available. */
export type MutationAddSubstitutionEventArgs = {
  matchId: Scalars['String']['input'];
  minuteOfMatch: Scalars['Int']['input'];
  playerInId: Scalars['String']['input'];
  playerOutId: Scalars['String']['input'];
  teamId: Scalars['String']['input'];
  timestamp: Scalars['DateTime']['input'];
};


/** Represents the mutations available. */
export type MutationAddTeamArgs = {
  team: TeamInput;
};


/** Represents the mutations available. */
export type MutationCreateRefereeArgs = {
  input: RefereeInput;
};


/** Represents the mutations available. */
export type MutationDeleteLineupArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteMatchArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteMatchEventArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteMatchPlayerArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeletePlayerArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteRatingArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteRefereeArgs = {
  id: Scalars['UUID']['input'];
};


/** Represents the mutations available. */
export type MutationDeleteTeamArgs = {
  id: Scalars['String']['input'];
};


/** Represents the mutations available. */
export type MutationSaveLineupArgs = {
  lineup: LineupInput;
};


/** Represents the mutations available. */
export type MutationSubstitutePlayerArgs = {
  matchPlayerId: Scalars['String']['input'];
  substitutionTime: Scalars['DateTime']['input'];
};


/** Represents the mutations available. */
export type MutationUpdateMatchArgs = {
  match: MatchInput;
};


/** Represents the mutations available. */
export type MutationUpdateMatchEventArgs = {
  matchEvent: MatchEventInput;
};


/** Represents the mutations available. */
export type MutationUpdateMatchPlayerArgs = {
  matchPlayer: MatchPlayerInput;
};


/** Represents the mutations available. */
export type MutationUpdateMatchScoreArgs = {
  id: Scalars['String']['input'];
  score: ScoreInput;
};


/** Represents the mutations available. */
export type MutationUpdateMatchStatusArgs = {
  id: Scalars['String']['input'];
  status: Status;
};


/** Represents the mutations available. */
export type MutationUpdatePlayerArgs = {
  player: PlayerInput;
};


/** Represents the mutations available. */
export type MutationUpdateRatingArgs = {
  rating: RatingInput;
};


/** Represents the mutations available. */
export type MutationUpdateRefereeArgs = {
  input: RefereeInput;
};


/** Represents the mutations available. */
export type MutationUpdateTeamArgs = {
  team: TeamInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Player = {
  __typename?: 'Player';
  createdAt: Scalars['DateTime']['output'];
  dateOfBirth?: Maybe<Scalars['DateTime']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  nationality?: Maybe<Scalars['String']['output']>;
  position: Position;
  team?: Maybe<Team>;
  teamId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PlayerFilterInput = {
  and?: InputMaybe<Array<PlayerFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  dateOfBirth?: InputMaybe<DateTimeOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  lastName?: InputMaybe<StringOperationFilterInput>;
  nationality?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PlayerFilterInput>>;
  position?: InputMaybe<PositionOperationFilterInput>;
  team?: InputMaybe<TeamFilterInput>;
  teamId?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type PlayerInput = {
  createdAt: Scalars['DateTime']['input'];
  dateOfBirth?: InputMaybe<Scalars['DateTime']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  nationality?: InputMaybe<Scalars['String']['input']>;
  position: Position;
  team?: InputMaybe<TeamInput>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  updatedAt: Scalars['DateTime']['input'];
};

export type PlayerSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  dateOfBirth?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageUrl?: InputMaybe<SortEnumType>;
  lastName?: InputMaybe<SortEnumType>;
  nationality?: InputMaybe<SortEnumType>;
  position?: InputMaybe<SortEnumType>;
  team?: InputMaybe<TeamSortInput>;
  teamId?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type PlayerStats = {
  __typename?: 'PlayerStats';
  averageRating: Scalars['Float']['output'];
  matchesPlayed: Scalars['Int']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  ratingCount: Scalars['Int']['output'];
};

/** A connection to a list of items. */
export type PlayersConnection = {
  __typename?: 'PlayersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<PlayersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Player>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type PlayersEdge = {
  __typename?: 'PlayersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Player;
};

export enum Position {
  Defender = 'DEFENDER',
  Forward = 'FORWARD',
  Goalkeeper = 'GOALKEEPER',
  Midfielder = 'MIDFIELDER',
  Undefined = 'UNDEFINED'
}

export type PositionOperationFilterInput = {
  eq?: InputMaybe<Position>;
  in?: InputMaybe<Array<Position>>;
  neq?: InputMaybe<Position>;
  nin?: InputMaybe<Array<Position>>;
};

/** Represents the queries available. */
export type Query = {
  __typename?: 'Query';
  allMatchRatingsOnlyRatedPlayers?: Maybe<AllMatchRatingsOnlyRatedPlayersConnection>;
  /** Get detailed player statistics with flexible sorting and time period filtering */
  detailedPlayerStats: Array<DetailedPlayerStats>;
  lineup?: Maybe<Lineup>;
  matchEvents?: Maybe<MatchEventsConnection>;
  matchPlayers?: Maybe<MatchPlayersConnection>;
  matchRatingsOnlyRatedPlayers: Array<Match>;
  matches?: Maybe<MatchesConnection>;
  players?: Maybe<PlayersConnection>;
  ratings?: Maybe<RatingsConnection>;
  referee?: Maybe<Referee>;
  referees: Array<Referee>;
  teamLineups?: Maybe<TeamLineupsConnection>;
  /** Get average ratings for a team across all matches */
  teamRatings: Array<TeamPlayerStats>;
  teams?: Maybe<TeamsConnection>;
  /** Get top rated players across all matches */
  topPlayers: Array<PlayerStats>;
};


/** Represents the queries available. */
export type QueryAllMatchRatingsOnlyRatedPlayersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  beforeDate?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MatchSortInput>>;
  where?: InputMaybe<MatchFilterInput>;
};


/** Represents the queries available. */
export type QueryDetailedPlayerStatsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


/** Represents the queries available. */
export type QueryLineupArgs = {
  id: Scalars['String']['input'];
};


/** Represents the queries available. */
export type QueryMatchEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MatchEventSortInput>>;
  where?: InputMaybe<MatchEventFilterInput>;
};


/** Represents the queries available. */
export type QueryMatchPlayersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MatchPlayerSortInput>>;
  where?: InputMaybe<MatchPlayerFilterInput>;
};


/** Represents the queries available. */
export type QueryMatchRatingsOnlyRatedPlayersArgs = {
  matchId: Scalars['String']['input'];
};


/** Represents the queries available. */
export type QueryMatchesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<MatchSortInput>>;
  where?: InputMaybe<MatchFilterInput>;
};


/** Represents the queries available. */
export type QueryPlayersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<PlayerSortInput>>;
  where?: InputMaybe<PlayerFilterInput>;
};


/** Represents the queries available. */
export type QueryRatingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<RatingSortInput>>;
  where?: InputMaybe<RatingFilterInput>;
};


/** Represents the queries available. */
export type QueryRefereeArgs = {
  id: Scalars['UUID']['input'];
};


/** Represents the queries available. */
export type QueryTeamLineupsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  matchId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<LineupSortInput>>;
  teamId: Scalars['String']['input'];
  where?: InputMaybe<LineupFilterInput>;
};


/** Represents the queries available. */
export type QueryTeamRatingsArgs = {
  teamId: Scalars['String']['input'];
};


/** Represents the queries available. */
export type QueryTeamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<TeamSortInput>>;
  where?: InputMaybe<TeamFilterInput>;
};


/** Represents the queries available. */
export type QueryTopPlayersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Rating = {
  __typename?: 'Rating';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  matchPlayer: MatchPlayer;
  matchPlayerId: Scalars['String']['output'];
  score: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
};

export type RatingFilterInput = {
  and?: InputMaybe<Array<RatingFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  matchPlayer?: InputMaybe<MatchPlayerFilterInput>;
  matchPlayerId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RatingFilterInput>>;
  score?: InputMaybe<IntOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type RatingInput = {
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['String']['input'];
  matchPlayer: MatchPlayerInput;
  matchPlayerId: Scalars['String']['input'];
  score: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};

export type RatingSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  matchPlayer?: InputMaybe<MatchPlayerSortInput>;
  matchPlayerId?: InputMaybe<SortEnumType>;
  score?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type RatingsConnection = {
  __typename?: 'RatingsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<RatingsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Rating>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type RatingsEdge = {
  __typename?: 'RatingsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Rating;
};

export type Referee = {
  __typename?: 'Referee';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  matches: Array<Match>;
  name: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RefereeFilterInput = {
  and?: InputMaybe<Array<RefereeFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  matches?: InputMaybe<ListFilterInputTypeOfMatchFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<RefereeFilterInput>>;
  photoUrl?: InputMaybe<StringOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type RefereeInput = {
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['UUID']['input'];
  matches: Array<MatchInput>;
  name: Scalars['String']['input'];
  photoUrl?: InputMaybe<Scalars['String']['input']>;
  updatedAt: Scalars['DateTime']['input'];
};

export type RefereeSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  photoUrl?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
};

export type Score = {
  __typename?: 'Score';
  awayTeamScore: Scalars['Int']['output'];
  homeTeamScore: Scalars['Int']['output'];
};

export type ScoreFilterInput = {
  and?: InputMaybe<Array<ScoreFilterInput>>;
  awayTeamScore?: InputMaybe<IntOperationFilterInput>;
  homeTeamScore?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<ScoreFilterInput>>;
};

export type ScoreInput = {
  awayTeamScore: Scalars['Int']['input'];
  homeTeamScore: Scalars['Int']['input'];
};

export type ScoreSortInput = {
  awayTeamScore?: InputMaybe<SortEnumType>;
  homeTeamScore?: InputMaybe<SortEnumType>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Stadium = {
  __typename?: 'Stadium';
  city: Scalars['String']['output'];
  name: Scalars['String']['output'];
  surface: Scalars['String']['output'];
};

export type StadiumFilterInput = {
  and?: InputMaybe<Array<StadiumFilterInput>>;
  city?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StadiumFilterInput>>;
  surface?: InputMaybe<StringOperationFilterInput>;
};

export type StadiumInput = {
  city: Scalars['String']['input'];
  name: Scalars['String']['input'];
  surface: Scalars['String']['input'];
};

export type StadiumSortInput = {
  city?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  surface?: InputMaybe<SortEnumType>;
};

export enum Status {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Postponed = 'POSTPONED',
  Scheduled = 'SCHEDULED'
}

export type StatusOperationFilterInput = {
  eq?: InputMaybe<Status>;
  in?: InputMaybe<Array<Status>>;
  neq?: InputMaybe<Status>;
  nin?: InputMaybe<Array<Status>>;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  players?: Maybe<Array<Player>>;
  shortName: Scalars['String']['output'];
  stadium?: Maybe<Stadium>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type TeamFilterInput = {
  and?: InputMaybe<Array<TeamFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  logo?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TeamFilterInput>>;
  players?: InputMaybe<ListFilterInputTypeOfPlayerFilterInput>;
  shortName?: InputMaybe<StringOperationFilterInput>;
  stadium?: InputMaybe<StadiumFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  website?: InputMaybe<StringOperationFilterInput>;
};

export type TeamInput = {
  createdAt: Scalars['DateTime']['input'];
  id: Scalars['String']['input'];
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  players?: InputMaybe<Array<PlayerInput>>;
  shortName: Scalars['String']['input'];
  stadium?: InputMaybe<StadiumInput>;
  updatedAt: Scalars['DateTime']['input'];
  website?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of items. */
export type TeamLineupsConnection = {
  __typename?: 'TeamLineupsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TeamLineupsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Lineup>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TeamLineupsEdge = {
  __typename?: 'TeamLineupsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Lineup;
};

export type TeamPlayerStats = {
  __typename?: 'TeamPlayerStats';
  averageRating: Scalars['Float']['output'];
  matchesPlayed: Scalars['Int']['output'];
  playerId: Scalars['String']['output'];
  playerName: Scalars['String']['output'];
  ratingCount: Scalars['Int']['output'];
};

export type TeamSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  logo?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  shortName?: InputMaybe<SortEnumType>;
  stadium?: InputMaybe<StadiumSortInput>;
  updatedAt?: InputMaybe<SortEnumType>;
  website?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type TeamsConnection = {
  __typename?: 'TeamsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TeamsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Team>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TeamsEdge = {
  __typename?: 'TeamsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Team;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};
