import{a8 as y,r as g,d as S,a7 as h,a9 as p}from"./index-BZVgHBzg.js";import{g as f}from"./index-C5X_dtXV.js";const T=y("teams",()=>{const n=g([]),r=g(!1),s=g(null),d=S(()=>t=>n.value.find(a=>String(a.id)===String(t)));function l(){return o()}function o(){r.value=!0,s.value=null;try{const{teams:t}=E.useTeams();return t.value}catch(t){throw s.value=t instanceof Error?t.message:"Failed to fetch teams",t}finally{r.value=!1}}function m(t){r.value=!0,s.value=null;try{const a=d.value(t);if(a)return a;const{team:i}=E.useTeam(t);if(i.value){const c=n.value.findIndex(x=>String(x.id)===String(t));c!==-1?n.value[c]=i.value:n.value.push(i.value)}return i.value}catch(a){throw s.value=a instanceof Error?a.message:"Failed to fetch team",a}finally{r.value=!1}}async function u(t,a){r.value=!0,s.value=null;try{const i=n.value.findIndex(c=>String(c.id)===String(t));if(i!==-1){const c={...n.value[i],...a,id:t};return n.value[i]=c,await Promise.resolve(),c}throw new Error("Team not found")}catch(i){throw s.value=i instanceof Error?i.message:"Failed to update team",i}finally{r.value=!1}}async function e(t){r.value=!0,s.value=null;try{if(n.value.findIndex(i=>String(i.id)===String(t))===-1)throw new Error("Team not found");n.value=n.value.filter(i=>String(i.id)!==String(t)),await Promise.resolve()}catch(a){throw s.value=a instanceof Error?a.message:"Failed to delete team",a}finally{r.value=!1}}return{teams:n,isLoading:r,error:s,getTeamById:d,init:l,fetchTeams:o,fetchTeamById:m,updateTeam:u,deleteTeam:e}}),v=f`
  fragment TeamFields on Team {
    id
    name
    shortName
    logo
    website
    stadium {
      name
      city
      surface
    }
    players {
      id
      firstName
      lastName
      position
      nationality
      dateOfBirth
      imageUrl
    }
  }
`,w=f`
  mutation CreateTeam($input: TeamInput!) {
    addTeam(team: $input) {
      ...TeamFields
    }
  }
  ${v}
`,I=f`
  mutation UpdateTeam($input: TeamInput!) {
    updateTeam(team: $input) {
      ...TeamFields
    }
  }
  ${v}
`,$=f`
  mutation DeleteTeam($id: String!) {
    deleteTeam(id: $id) {
      id
    }
  }
`,F=f`
  query GetTeams($first: Int = 10, $after: String) {
    teams(first: $first, after: $after) {
      nodes {
        ...TeamFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${v}
`,A=f`
  query GetTeam($filter: TeamFilterInput) {
    teams(first: 1, where: $filter) {
      nodes {
        ...TeamFields
      }
    }
  }
  ${v}
`,E={useTeams(n=16,r){const{result:s,loading:d,error:l,refetch:o,onResult:m}=p(F,{first:n,after:r}),u=T();return m(e=>{var t,a;(a=(t=e.data)==null?void 0:t.teams)!=null&&a.nodes&&(u.teams=e.data.teams.nodes)}),{teams:s,loading:d,error:l,refetch:o}},useTeam(n){var m,u,e;const{result:r,loading:s,error:d,refetch:l}=p(A,{id:n}),o=T();if((e=(u=(m=r.value)==null?void 0:m.teams)==null?void 0:u.nodes)!=null&&e[0]){const t=o.teams.findIndex(a=>a.id===n);t!==-1?o.teams[t]=r.value.teams.nodes[0]:o.teams.push(r.value.teams.nodes[0])}return{team:r,loading:s,error:d,refetch:l}},useCreateTeam(){const{mutate:n,loading:r,error:s}=h(w),d=T();return{createTeam:async o=>{var m,u;try{const e=await n({input:o});return(m=e==null?void 0:e.data)!=null&&m.addTeam&&d.teams.push(e.data.addTeam),(u=e==null?void 0:e.data)==null?void 0:u.addTeam}catch(e){throw console.error("Error creating team:",e),e}},loading:r,error:s}},useUpdateTeam(){const{mutate:n,loading:r,error:s}=h(I),d=T();return{updateTeam:async o=>{var m,u;try{const e=await n({input:o});if((m=e==null?void 0:e.data)!=null&&m.updateTeam){const t=d.teams.findIndex(a=>a.id===o.id);t!==-1&&(d.teams[t]=e.data.updateTeam)}return(u=e==null?void 0:e.data)==null?void 0:u.updateTeam}catch(e){throw console.error("Error updating team:",e),e}},loading:r,error:s}},useDeleteTeam(){const{mutate:n,loading:r,error:s}=h($),d=T();return{deleteTeam:async o=>{var m,u;try{const e=await n({id:o});if((m=e==null?void 0:e.data)!=null&&m.deleteTeam){const t=d.teams.findIndex(a=>a.id===o);t!==-1&&d.teams.splice(t,1)}return(u=e==null?void 0:e.data)==null?void 0:u.deleteTeam}catch(e){throw console.error("Error deleting team:",e),e}},loading:r,error:s}}};export{E as t,T as u};
