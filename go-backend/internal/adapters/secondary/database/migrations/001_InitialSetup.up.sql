create table teams
(
    id         varchar(255) not null
        primary key,
    name       varchar(255) not null,
    short_name varchar(50)  not null,
    league_id  varchar(255),
    logo       text,
    website    text,
    created_at timestamp    not null,
    updated_at timestamp    not null,
    stadium    jsonb
);

alter table teams
    owner to football;

create index idx_teams_league_id
    on teams (league_id);

create table players
(
    id            varchar(255) not null
        primary key,
    first_name    varchar(50)  not null,
    last_name     varchar(50)  not null,
    nationality   varchar(50),
    date_of_birth date         not null,
    position      varchar(20)  not null,
    image_url     text,
    created_at    timestamp    not null,
    updated_at    timestamp    not null,
    team_id       varchar
        constraint players_teams_id_fk
            references teams
);

alter table players
    owner to football;

create table matches
(
    id             varchar(255)      not null
        primary key,
    home_team_id   varchar(255)      not null
        references teams,
    away_team_id   varchar(255)      not null
        references teams,
    referee_id     varchar(255),
    scheduled_date timestamp         not null,
    status         varchar(20)       not null,
    home_score     integer default 0 not null,
    away_score     integer default 0 not null,
    created_at     timestamp         not null,
    updated_at     timestamp         not null
);

alter table matches
    owner to football;

create index idx_matches_home_team_id
    on matches (home_team_id);

create index idx_matches_away_team_id
    on matches (away_team_id);

create table lineups
(
    id          varchar(255) not null
        primary key,
    match_id    varchar(255) not null
        references matches,
    team_id     varchar(255) not null
        references teams,
    formation   varchar(10)  not null,
    description text,
    created_at  timestamp    not null,
    updated_at  timestamp    not null
);

alter table lineups
    owner to football;

create index idx_lineups_match_id
    on lineups (match_id);

create index idx_lineups_team_id
    on lineups (team_id);

create table lineup_players
(
    id         varchar(255) not null
        primary key,
    lineup_id  varchar(255) not null
        references lineups,
    player_id  varchar(255) not null
        references players,
    created_at timestamp    not null,
    updated_at timestamp    not null,
    rating     jsonb,
    stats      jsonb,
    position   varchar(20)
);

alter table lineup_players
    owner to football;

create index idx_lineup_players_lineup_id
    on lineup_players (lineup_id);

create index idx_lineup_players_player_id
    on lineup_players (player_id);

