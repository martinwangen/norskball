import{af as g,ai as h,ah as G,r as v,c as T}from"./index-B7v1RYUg.js";import{P as y}from"./graphql-BhlZu-4f.js";import{g as d}from"./_plugin-vue_export-helper-ySNUC0R3.js";const m=d`
  fragment PlayerFields on Player {
    id
    firstName
    lastName
    position
    nationality
    dateOfBirth
    imageUrl
    teamId
  }
`,Y=d`
  mutation CreatePlayer($input: PlayerInput!) {
    addPlayer(player: $input) {
      ...PlayerFields
    }
  }
  ${m}
`,N=d`
  mutation UpdatePlayer($input: PlayerInput!) {
    updatePlayer(player: $input) {
      ...PlayerFields
    }
  }
  ${m}
`,U=d`
  mutation DeletePlayer($id: String!) {
    deletePlayer(id: $id) {
      id
    }
  }
`,M=d`
  query GetPlayers($first: Int = 34, $after: String) {
    players(first: $first, after: $after) {
      nodes {
        ...PlayerFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${m}
`,k=d`
  query GetPlayer($filter: PlayerFilterInput) {
    players(first: 1, where: $filter) {
      nodes {
        ...PlayerFields
      }
    }
  }
  ${m}
`,b=d`
  query GetPlayersByTeam($filter: PlayerFilterInput) {
    players(first: 35, where: $filter) {
      nodes {
        ...PlayerFields
      }
      totalCount
    }
  }
  ${m}
`,z=r=>`${r.firstName} ${r.lastName}`.trim(),H=r=>({[y.Goalkeeper]:"purple",[y.Defender]:"blue",[y.Midfielder]:"green",[y.Forward]:"orange"})[r],J=r=>({[y.Goalkeeper]:1,[y.Defender]:2,[y.Midfielder]:3,[y.Forward]:4})[r],f={usePlayers(r=34,u){return h(M,{first:r,after:u})},usePlayer(r){return h(k,{id:r})},usePlayersByTeam(r){return h(b,{filter:{teamId:{eq:r}}})},useCreatePlayer(){return g(Y)},useUpdatePlayer(){return g(N)},useDeletePlayer(){return g(U)}},K=G("players",()=>{const r=v([]),u=v({}),s=v(!1),o=v(null),w=v(0),F=T(()=>t=>r.value.find(l=>l.id===t)),A=T(()=>t=>u.value[t]||[]);async function B(){return $()}async function $(){s.value=!0,o.value=null;try{const{onResult:t}=f.usePlayers();return new Promise((l,e)=>{t(a=>{var i,n;(n=(i=a.data)==null?void 0:i.players)!=null&&n.nodes?(r.value=a.data.players.nodes,w.value=a.data.players.totalCount||0,l(a.data.players.nodes)):a.error&&e(new Error(a.error.message))})})}catch(t){throw o.value=t instanceof Error?t.message:"Failed to fetch players",t}finally{s.value=!1}}async function L(t){s.value=!0,o.value=null;try{const l=F.value(t);if(l)return l;const{onResult:e}=f.usePlayer(t);return new Promise((a,i)=>{e(n=>{var P,p,c;if((c=(p=(P=n.data)==null?void 0:P.players)==null?void 0:p.nodes)!=null&&c[0]){const E=n.data.players.nodes[0],I=r.value.findIndex(_=>_.id===t);I!==-1?r.value[I]=E:r.value.push(E),a(E)}else n.error&&i(new Error(n.error.message))})})}catch(l){throw o.value=l instanceof Error?l.message:"Failed to fetch player",l}finally{s.value=!1}}async function S(t){s.value=!0,o.value=null;const l=String(t);try{if(u.value[l])return r.value=u.value[l],u.value[l];const{onResult:e}=f.usePlayersByTeam(t);return new Promise((a,i)=>{e(n=>{var P,p;if((p=(P=n.data)==null?void 0:P.players)!=null&&p.nodes){const c=n.data.players.nodes;u.value[l]=c,r.value=c,a(c)}else n.error&&i(new Error(n.error.message))})})}catch(e){throw o.value=e instanceof Error?e.message:"Failed to fetch players",e}finally{s.value=!1}}async function x(t){var l;s.value=!0,o.value=null;try{const{mutate:e}=f.useCreatePlayer(),a=await e({input:t});if((l=a==null?void 0:a.data)!=null&&l.addPlayer)return r.value.push(a.data.addPlayer),a.data.addPlayer;throw new Error("Failed to create player")}catch(e){throw o.value=e instanceof Error?e.message:"Failed to create player",e}finally{s.value=!1}}async function C(t){var l;s.value=!0,o.value=null;try{const{mutate:e}=f.useUpdatePlayer(),a=await e({input:t});if((l=a==null?void 0:a.data)!=null&&l.updatePlayer){const i=r.value.findIndex(n=>n.id===t.id);return i!==-1&&(r.value[i]=a.data.updatePlayer),a.data.updatePlayer}throw new Error("Failed to update player")}catch(e){throw o.value=e instanceof Error?e.message:"Failed to update player",e}finally{s.value=!1}}async function D(t){var l;s.value=!0,o.value=null;try{const{mutate:e}=f.useDeletePlayer(),a=await e({id:t});if((l=a==null?void 0:a.data)!=null&&l.deletePlayer){const i=r.value.findIndex(n=>n.id===t);return i!==-1&&r.value.splice(i,1),a.data.deletePlayer}throw new Error("Failed to delete player")}catch(e){throw o.value=e instanceof Error?e.message:"Failed to delete player",e}finally{s.value=!1}}return{players:r,playersByTeam:u,isLoading:s,error:o,totalPlayers:w,getPlayerById:F,getPlayersByTeam:A,init:B,fetchPlayers:$,fetchPlayerById:L,fetchPlayersByTeam:S,createPlayer:x,updatePlayer:C,deletePlayer:D}});export{H as a,J as b,z as g,K as u};
