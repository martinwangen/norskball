import{ae as L,r as I,ab as y,af as T,c as $}from"./index-DgHSpM2q.js";import{S as f}from"./graphql-DMYS3sVo.js";import{g as m}from"./_plugin-vue_export-helper-IL-jyuH0.js";const l=L("matches",()=>{const s=I([]),u=I(!1),d=I(null);return{matches:s,loading:u,error:d,setMatches:t=>{s.value=t},addMatch:t=>{s.value.push(t)},updateMatch:t=>{const n=s.value.findIndex(h=>h.id===t.id);n!==-1&&(s.value[n]=t)},deleteMatch:t=>{s.value=s.value.filter(n=>n.id!==t)},getLiveMatches:()=>s.value.filter(t=>t.status===f.InProgress),getUpcomingMatches:()=>s.value.filter(t=>t.status===f.Scheduled),getFinishedMatches:()=>s.value.filter(t=>t.status===f.Completed)}}),S=m`
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
`,M=m`
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
  ${S}
`,A=m`
  mutation CreateMatch($input: MatchInput!) {
    addMatch(match: $input) {
      ...MatchFields
    }
  }
  ${M}
`,P=m`
  mutation UpdateMatch($input: MatchInput!) {
    updateMatch(match: $input) {
      ...MatchFields
    }
  }
  ${M}
`,x=m`
  mutation DeleteMatch($id: String!) {
    deleteMatch(id: $id) {
      id
    }
  }
`,w=m`
  mutation UpdateMatchStatus($id: String!, $status: Status!) {
    updateMatchStatus(id: $id, status: $status) {
      ...MatchFields
    }
  }
  ${M}
`,E=m`
  mutation UpdateMatchScore($id: String!, $score: ScoreInput!) {
    updateMatchScore(id: $id, score: $score) {
      ...MatchFields
    }
  }
  ${M}
`,v=m`
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
`;m`
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
`;const H=m`
  mutation SaveLineup($lineup: LineupInput!) {
    saveLineup(lineup: $lineup) {
      ...LineupFields
    }
  }
  ${S}
`,b=m`
  mutation DeleteLineup($id: String!) {
    deleteLineup(id: $id) {
      ...LineupFields
    }
  }
  ${S}
`,R=m`
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
`,N=m`
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
`,D=m`
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
  ${M}
`,_=m`
  query GetMatchDetails($filter: MatchFilterInput) {
    matches(first: 1, where: $filter) {
      nodes {
        ...MatchFields
      }
    }
  }
  ${M}
`;m`
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
`;const G={useMatches(s=20,u){var c,e;const{result:d,loading:o,error:p,refetch:a}=T(D,{first:s,after:u,sortBy:{scheduledDate:"ASC"}}),i=l();return(e=(c=d.value)==null?void 0:c.matches)!=null&&e.nodes&&(i.matches=d.value.matches.nodes),{matches:d,loading:o,error:p,refetch:a}},useMatch(s){var c,e,r;const u={id:{eq:s}},{result:d,loading:o,error:p,refetch:a}=T(_,{filter:u}),i=l();if((r=(e=(c=d.value)==null?void 0:c.matches)==null?void 0:e.nodes)!=null&&r[0]){const t=i.matches.findIndex(n=>n.id===s);t!==-1?i.matches[t]=d.value.matches.nodes[0]:i.matches.push(d.value.matches.nodes[0])}return{match:$(()=>{var t,n,h;return(h=(n=(t=d.value)==null?void 0:t.matches)==null?void 0:n.nodes)==null?void 0:h[0]}),loading:o,error:p,refetch:a}},useCreateMatch(){const{mutate:s,loading:u,error:d}=y(A),o=l();return{createMatch:async a=>{var i,c;try{const e=await s({input:a});return(i=e==null?void 0:e.data)!=null&&i.addMatch&&o.matches.push(e.data.addMatch),(c=e==null?void 0:e.data)==null?void 0:c.addMatch}catch(e){throw console.error("Error creating match:",e),e}},loading:u,error:d}},useUpdateMatch(){const{mutate:s,loading:u,error:d}=y(P),o=l();return{updateMatch:async a=>{var i,c;try{a.__typename=void 0,a.score=void 0,a.homeTeam=null,a.awayTeam=null,a.homeTeamLineup=null,a.awayTeamLineup=null;const e=await s({input:a});if((i=e==null?void 0:e.data)!=null&&i.updateMatch){const r=o.matches.findIndex(t=>t.id===a.id);r!==-1&&(o.matches[r]=e.data.updateMatch)}return(c=e==null?void 0:e.data)==null?void 0:c.updateMatch}catch(e){throw console.error("Error updating match:",e),e}},loading:u,error:d}},useDeleteMatch(){const{mutate:s,loading:u,error:d}=y(x),o=l();return{deleteMatch:async a=>{var i,c;try{const e=await s({id:a});if((i=e==null?void 0:e.data)!=null&&i.deleteMatch){const r=o.matches.findIndex(t=>t.id===a);r!==-1&&o.matches.splice(r,1)}return(c=e==null?void 0:e.data)==null?void 0:c.deleteMatch}catch(e){throw console.error("Error deleting match:",e),e}},loading:u,error:d}},useUpdateMatchStatus(){const{mutate:s,loading:u,error:d}=y(w),o=l();return{updateMatchStatus:async(a,i)=>{var c,e;try{const r=await s({id:a,status:i});if((c=r==null?void 0:r.data)!=null&&c.updateMatchStatus){const t=o.matches.findIndex(n=>n.id===a);t!==-1&&(o.matches[t]=r.data.updateMatchStatus)}return(e=r==null?void 0:r.data)==null?void 0:e.updateMatchStatus}catch(r){throw console.error("Error updating match status:",r),r}},loading:u,error:d}},useUpdateMatchScore(){const{mutate:s,loading:u,error:d}=y(E),o=l();return{updateMatchScore:async(a,i)=>{var c,e;try{const r=await s({id:a,score:i});if((c=r==null?void 0:r.data)!=null&&c.updateMatchScore){const t=o.matches.findIndex(n=>n.id===a);t!==-1&&(o.matches[t]=r.data.updateMatchScore)}return(e=r==null?void 0:r.data)==null?void 0:e.updateMatchScore}catch(r){throw console.error("Error updating match score:",r),r}},loading:u,error:d}},useUpdatePlayerRating(){const{mutate:s,loading:u,error:d}=y(v),o=l();return{updatePlayerRating:async a=>{var i,c;try{const e=await s({input:a});if((i=e==null?void 0:e.data)!=null&&i.updateMatchPlayer){const r=o.matches.findIndex(t=>{var n,h;return((n=t.homeTeamLineup)==null?void 0:n.id)===a.lineupId||((h=t.awayTeamLineup)==null?void 0:h.id)===a.lineupId});if(r!==-1){const t=o.matches[r];if(t.homeTeamLineup){const n=t.homeTeamLineup.players.findIndex(h=>h.id===a.id);n!==-1&&(t.homeTeamLineup.players[n]=e.data.updateMatchPlayer)}if(t.awayTeamLineup){const n=t.awayTeamLineup.players.findIndex(h=>h.id===a.id);n!==-1&&(t.awayTeamLineup.players[n]=e.data.updateMatchPlayer)}}}return(c=e==null?void 0:e.data)==null?void 0:c.updateMatchPlayer}catch(e){throw console.error("Error updating player rating:",e),e}},loading:u,error:d}},useAddRating(){const{mutate:s,loading:u,error:d}=y(R),o=l();return{addRating:async a=>{var i,c;try{console.log("Adding rating with input:",a);const e=await s({input:a});if(console.log("Rating result:",e),(i=e==null?void 0:e.data)!=null&&i.addRating){const r=o.matches.findIndex(t=>{var n,h;return((n=t.homeTeamLineup)==null?void 0:n.players.some(g=>g.id===a.matchPlayerId))||((h=t.awayTeamLineup)==null?void 0:h.players.some(g=>g.id===a.matchPlayerId))});if(r!==-1){const t=o.matches[r];if(t.homeTeamLineup){const n=t.homeTeamLineup.players.findIndex(h=>h.id===a.matchPlayerId);n!==-1&&(t.homeTeamLineup.players[n].ratings||(t.homeTeamLineup.players[n].ratings=[]),t.homeTeamLineup.players[n].ratings.push(e.data.addRating))}if(t.awayTeamLineup){const n=t.awayTeamLineup.players.findIndex(h=>h.id===a.matchPlayerId);n!==-1&&(t.awayTeamLineup.players[n].ratings||(t.awayTeamLineup.players[n].ratings=[]),t.awayTeamLineup.players[n].ratings.push(e.data.addRating))}}}return(c=e==null?void 0:e.data)==null?void 0:c.addRating}catch(e){throw console.error("Error adding rating:",e),e}},loading:u,error:d}},useAddSimpleRating(){return y(N)}};export{N as A,b as D,S as L,H as S,R as a,G as m,l as u};
