import{ah as _,r as E,af as y,ai as D,c as R}from"./index-B7v1RYUg.js";import{S as w,E as f}from"./graphql-BhlZu-4f.js";import{g as u}from"./_plugin-vue_export-helper-ySNUC0R3.js";const M=_("matches",()=>{const s=E([]),h=E(!1),o=E(null);return{matches:s,loading:h,error:o,setMatches:e=>{s.value=e},addMatch:e=>{s.value.push(e)},updateMatch:e=>{const d=s.value.findIndex(l=>l.id===e.id);d!==-1&&(s.value[d]=e)},deleteMatch:e=>{s.value=s.value.filter(d=>d.id!==e)},getLiveMatches:()=>s.value.filter(e=>e.status===w.InProgress),getUpcomingMatches:()=>s.value.filter(e=>e.status===w.Scheduled),getFinishedMatches:()=>s.value.filter(e=>e.status===w.Completed)}}),L=u`
  fragment LineupFields on Lineup {
    id
    teamId
    matchId
    formation
    isStarting
    players {
      id
      playerId
      lineupId
      teamId
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
`,g=u`
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
  ${L}
`,C=u`
  mutation CreateMatch($input: MatchInput!) {
    addMatch(match: $input) {
      ...MatchFields
    }
  }
  ${g}
`,U=u`
  mutation UpdateMatch($input: MatchInput!) {
    updateMatch(match: $input) {
      ...MatchFields
    }
  }
  ${g}
`,G=u`
  mutation DeleteMatch($id: String!) {
    deleteMatch(id: $id) {
      id
    }
  }
`,b=u`
  mutation UpdateMatchStatus($id: String!, $status: Status!) {
    updateMatchStatus(id: $id, status: $status) {
      ...MatchFields
    }
  }
  ${g}
`,F=u`
  mutation UpdateMatchScore($id: String!, $score: ScoreInput!) {
    updateMatchScore(id: $id, score: $score) {
      ...MatchFields
    }
  }
  ${g}
`,H=u`
  mutation AddMatchEvent($matchEvent: MatchEventInput!) {
    addMatchEvent(matchEvent: $matchEvent) {
      id
      type
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
      timestamp
    }
  }
`,q=u`
  mutation AddGoalEvent(
    $matchId: String!
    $scorerId: String!
    $assisterId: String
    $teamId: String!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
    $isOwnGoal: Boolean! = false
  ) {
    addGoalEvent(
      matchId: $matchId
      scorerId: $scorerId
      assisterId: $assisterId
      teamId: $teamId
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
      isOwnGoal: $isOwnGoal
    ) {
      id
      type
      minuteOfMatch
      playerId
      secondaryPlayerId
      teamId
      description
      timestamp
    }
  }
`,B=u`
  mutation AddCardEvent(
    $matchId: String!
    $playerId: String!
    $teamId: String!
    $cardType: EventType!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
  ) {
    addCardEvent(
      matchId: $matchId
      playerId: $playerId
      teamId: $teamId
      cardType: $cardType
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
    ) {
      id
      type
      minuteOfMatch
      playerId
      teamId
      description
      timestamp
    }
  }
`,k=u`
  mutation AddSubstitutionEvent(
    $matchId: String!
    $playerOutId: String!
    $playerInId: String!
    $teamId: String!
    $timestamp: DateTime!
    $minuteOfMatch: Int!
  ) {
    addSubstitutionEvent(
      matchId: $matchId
      playerOutId: $playerOutId
      playerInId: $playerInId
      teamId: $teamId
      timestamp: $timestamp
      minuteOfMatch: $minuteOfMatch
    ) {
      id
      type
      minuteOfMatch
      playerId
      secondaryPlayerId
      teamId
      description
      timestamp
    }
  }
`,V=u`
  mutation AddHalftimeEvent(
    $matchId: String!
    $timestamp: DateTime!
    $addedMinutes: Int!
  ) {
    addHalftimeEvent(
      matchId: $matchId
      timestamp: $timestamp
      addedMinutes: $addedMinutes
    ) {
      id
      type
      minuteOfMatch
      description
      timestamp
    }
  }
`,Y=u`
  mutation UpdateMatchPlayer($input: MatchPlayerInput!) {
    updateMatchPlayer(matchPlayer: $input) {
      id
      lineupId
      playerId
      isStarter
      position
      substitutedInAt
      substitutedOutAt
      player {
        id
        firstName
        lastName
        position
      }
      averageRating
      ratings {
        id
        score
        userId
      }
    }
  }
`;u`
  mutation AddMatchPlayer($input: MatchPlayerInput!) {
    addMatchPlayer(matchPlayer: $input) {
      id
      matchId
      playerId
      isStarter
      position
      teamType
      substitutedInAt
      substitutedOutAt
      player {
        id
        firstName
        lastName
        position
      }
    }
  }
`;const tt=u`
  mutation SaveLineup($lineup: LineupInput!) {
    saveLineup(lineup: $lineup) {
      ...LineupFields
    }
  }
  ${L}
`,et=u`
  mutation DeleteLineup($id: String!) {
    deleteLineup(id: $id) {
      ...LineupFields
    }
  }
  ${L}
`,j=u`
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
`,Q=u`
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
`,z=u`
  query GetMatches($first: Int = 20, $after: String, $sortBy: [MatchSortInput!]) {
    matches(first: $first, after: $after, order: $sortBy) {
      nodes {
        ...MatchFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${g}
`,J=u`
  query GetMatchDetails($filter: MatchFilterInput) {
    matches(first: 1, where: $filter) {
      nodes {
        ...MatchFields
      }
    }
  }
  ${g}
`;u`
  query GetMatchesList($first: Int = 20, $sortBy: [MatchSortInput!]) {
    matches(first: $first, order: $sortBy) {
      nodes {
        id
        homeTeam {
          name
          shortName
        }
        awayTeam {
          name
          shortName
        }
        scheduledDate
        status
        score {
          homeTeamScore
          awayTeamScore
        }
        homeTeamLineup {
          formation
        }
        awayTeamLineup {
          formation
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;const at={useMatches(s=20,h){var i,t;const{result:o,loading:m,error:I,refetch:a}=D(z,{first:s,after:h,sortBy:{scheduledDate:"ASC"}}),c=M();return(t=(i=o.value)==null?void 0:i.matches)!=null&&t.nodes&&(c.matches=o.value.matches.nodes),{matches:o,loading:m,error:I,refetch:a}},useMatch(s){var i,t,r;const h={id:{eq:s}},{result:o,loading:m,error:I,refetch:a}=D(J,{filter:h}),c=M();if((r=(t=(i=o.value)==null?void 0:i.matches)==null?void 0:t.nodes)!=null&&r[0]){const e=c.matches.findIndex(d=>d.id===s);e!==-1?c.matches[e]=o.value.matches.nodes[0]:c.matches.push(o.value.matches.nodes[0])}return{match:R(()=>{var e,d,l;return(l=(d=(e=o.value)==null?void 0:e.matches)==null?void 0:d.nodes)==null?void 0:l[0]}),loading:m,error:I,refetch:a}},useCreateMatch(){const{mutate:s,loading:h,error:o}=y(C),m=M();return{createMatch:async a=>{var c,i;try{const t=await s({input:a});return(c=t==null?void 0:t.data)!=null&&c.addMatch&&m.matches.push(t.data.addMatch),(i=t==null?void 0:t.data)==null?void 0:i.addMatch}catch(t){throw console.error("Error creating match:",t),t}},loading:h,error:o}},useUpdateMatch(){const{mutate:s,loading:h,error:o}=y(U),m=M();return{updateMatch:async a=>{var c,i;try{a.__typename=void 0,a.score=void 0,a.homeTeam=null,a.awayTeam=null,a.homeTeamLineup=null,a.awayTeamLineup=null;const t=await s({input:a});if((c=t==null?void 0:t.data)!=null&&c.updateMatch){const r=m.matches.findIndex(e=>e.id===a.id);r!==-1&&(m.matches[r]=t.data.updateMatch)}return(i=t==null?void 0:t.data)==null?void 0:i.updateMatch}catch(t){throw console.error("Error updating match:",t),t}},loading:h,error:o}},useDeleteMatch(){const{mutate:s,loading:h,error:o}=y(G),m=M();return{deleteMatch:async a=>{var c,i;try{const t=await s({id:a});if((c=t==null?void 0:t.data)!=null&&c.deleteMatch){const r=m.matches.findIndex(e=>e.id===a);r!==-1&&m.matches.splice(r,1)}return(i=t==null?void 0:t.data)==null?void 0:i.deleteMatch}catch(t){throw console.error("Error deleting match:",t),t}},loading:h,error:o}},useUpdateMatchStatus(){const{mutate:s,loading:h,error:o}=y(b),m=M();return{updateMatchStatus:async(a,c)=>{var i,t;try{const r=await s({id:a,status:c});if((i=r==null?void 0:r.data)!=null&&i.updateMatchStatus){const e=m.matches.findIndex(d=>d.id===a);e!==-1&&(m.matches[e]=r.data.updateMatchStatus)}return(t=r==null?void 0:r.data)==null?void 0:t.updateMatchStatus}catch(r){throw console.error("Error updating match status:",r),r}},loading:h,error:o}},useUpdateMatchScore(){const{mutate:s,loading:h,error:o}=y(F),m=M();return{updateMatchScore:async(a,c)=>{var i,t;try{const r=await s({id:a,score:c});if((i=r==null?void 0:r.data)!=null&&i.updateMatchScore){const e=m.matches.findIndex(d=>d.id===a);e!==-1&&(m.matches[e]=r.data.updateMatchScore)}return(t=r==null?void 0:r.data)==null?void 0:t.updateMatchScore}catch(r){throw console.error("Error updating match score:",r),r}},loading:h,error:o}},useUpdatePlayerRating(){const{mutate:s,loading:h,error:o}=y(Y),m=M();return{updatePlayerRating:async a=>{var c,i;try{const t=await s({input:a});if((c=t==null?void 0:t.data)!=null&&c.updateMatchPlayer){const r=m.matches.findIndex(e=>{var d,l;return((d=e.homeTeamLineup)==null?void 0:d.id)===a.lineupId||((l=e.awayTeamLineup)==null?void 0:l.id)===a.lineupId});if(r!==-1){const e=m.matches[r];if(e.homeTeamLineup){const d=e.homeTeamLineup.players.findIndex(l=>l.id===a.id);d!==-1&&(e.homeTeamLineup.players[d]=t.data.updateMatchPlayer)}if(e.awayTeamLineup){const d=e.awayTeamLineup.players.findIndex(l=>l.id===a.id);d!==-1&&(e.awayTeamLineup.players[d]=t.data.updateMatchPlayer)}}}return(i=t==null?void 0:t.data)==null?void 0:i.updateMatchPlayer}catch(t){throw console.error("Error updating player rating:",t),t}},loading:h,error:o}},useAddRating(){const{mutate:s,loading:h,error:o}=y(j),m=M();return{addRating:async a=>{var c,i;try{console.log("Adding rating with input:",a);const t=await s({input:a});if(console.log("Rating result:",t),(c=t==null?void 0:t.data)!=null&&c.addRating){const r=m.matches.findIndex(e=>{var d,l;return((d=e.homeTeamLineup)==null?void 0:d.players.some($=>$.id===a.matchPlayerId))||((l=e.awayTeamLineup)==null?void 0:l.players.some($=>$.id===a.matchPlayerId))});if(r!==-1){const e=m.matches[r];if(e.homeTeamLineup){const d=e.homeTeamLineup.players.findIndex(l=>l.id===a.matchPlayerId);d!==-1&&(e.homeTeamLineup.players[d].ratings||(e.homeTeamLineup.players[d].ratings=[]),e.homeTeamLineup.players[d].ratings.push(t.data.addRating))}if(e.awayTeamLineup){const d=e.awayTeamLineup.players.findIndex(l=>l.id===a.matchPlayerId);d!==-1&&(e.awayTeamLineup.players[d].ratings||(e.awayTeamLineup.players[d].ratings=[]),e.awayTeamLineup.players[d].ratings.push(t.data.addRating))}}}return(i=t==null?void 0:t.data)==null?void 0:i.addRating}catch(t){throw console.error("Error adding rating:",t),t}},loading:h,error:o}},useAddSimpleRating(){return y(Q)},useAddMatchEvent(){const{mutate:s,loading:h,error:o}=y(q),{mutate:m,loading:I,error:a}=y(B),{mutate:c,loading:i,error:t}=y(k),{mutate:r,loading:e,error:d}=y(V),{mutate:l,loading:$,error:O}=y(H),A=M();return{addMatchEvent:async n=>{var v,P;try{let p,S;switch(n.type){case f.Goal:case f.OwnGoal:if(!n.playerId||!n.teamId)throw new Error("Player ID and Team ID are required for goals");p=await s({matchId:n.matchId,scorerId:n.playerId,assisterId:n.secondaryPlayerId,teamId:n.teamId,timestamp:n.timestamp,minuteOfMatch:n.minuteOfMatch,isOwnGoal:n.type===f.OwnGoal});break;case f.YellowCard:case f.RedCard:if(!n.playerId||!n.teamId)throw new Error("Player ID and Team ID are required for cards");p=await m({matchId:n.matchId,playerId:n.playerId,teamId:n.teamId,cardType:n.type,timestamp:n.timestamp,minuteOfMatch:n.minuteOfMatch});break;case f.Substitution:if(!n.playerId||!n.teamId||!n.secondaryPlayerId)throw new Error("Player ID, Team ID, and Secondary Player ID are required for substitutions");p=await c({matchId:n.matchId,playerOutId:n.playerId,playerInId:n.secondaryPlayerId,teamId:n.teamId,timestamp:n.timestamp,minuteOfMatch:n.minuteOfMatch});break;case f.HalfTimeStart:S=parseInt(((v=n.description)==null?void 0:v.split(": ")[1])||"0"),p=await r({matchId:n.matchId,timestamp:n.timestamp,addedMinutes:S});break;case f.GameEnd:S=parseInt(((P=n.description)==null?void 0:P.split(": ")[1])||"0"),p=await l({matchId:n.matchId,type:f.GameEnd,minuteOfMatch:90,timestamp:n.timestamp,description:`Added minutes: ${S}`});break;default:throw new Error(`Unsupported event type: ${n.type}`)}if(p!=null&&p.data){const N=p.data[Object.keys(p.data)[0]],x=A.matches.findIndex(T=>T.id===n.matchId);if(x!==-1){const T=A.matches[x];T.events||(T.events=[]),T.events.push(N)}}return p==null?void 0:p.data}catch(p){throw console.error("Error adding match event:",p),p}},loading:h||I||i||e||$,error:o||a||t||d||O}}};export{Q as A,et as D,L,tt as S,j as a,at as m,M as u};
