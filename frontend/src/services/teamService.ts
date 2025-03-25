import { useQuery, useMutation } from '@vue/apollo-composable';
import { useTeamStore } from '../stores/teams';
import type { TeamInput } from '../gql/__generated__/graphql';
import {
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM
} from '../gql/mutations/team';
import {
  GET_TEAMS,
  GET_TEAM
} from '../gql/queries/team';

export const teamService = {
  useTeams(first = 16, after?: string) {
    const { result, loading, error, refetch } = useQuery(GET_TEAMS, {
      first,
      after
    });

    // Update store when data changes
    const teamStore = useTeamStore();
    if (result.value?.teams?.nodes) {
      teamStore.teams = result.value.teams.nodes;
    }

    return {
      teams: result,
      loading,
      error,
      refetch
    };
  },

  useTeam(id: string) {
    const { result, loading, error, refetch } = useQuery(GET_TEAM, {
      id
    });

    // Update store when data changes
    const teamStore = useTeamStore();
    if (result.value?.teams?.nodes?.[0]) {
      const existingIndex = teamStore.teams.findIndex(t => t.id === id);
      if (existingIndex !== -1) {
        teamStore.teams[existingIndex] = result.value.teams.nodes[0];
      } else {
        teamStore.teams.push(result.value.teams.nodes[0]);
      }
    }

    return {
      team: result,
      loading,
      error,
      refetch
    };
  },

  useCreateTeam() {
    const { mutate: createTeam, loading, error } = useMutation(CREATE_TEAM);
    const teamStore = useTeamStore();

    const execute = async (input: Omit<TeamInput, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const result = await createTeam({ input });
        if (result?.data?.addTeam) {
          teamStore.teams.push(result.data.addTeam);
        }
        return result?.data?.addTeam;
      } catch (err) {
        console.error('Error creating team:', err);
        throw err;
      }
    };

    return {
      createTeam: execute,
      loading,
      error
    };
  },

  useUpdateTeam() {
    const { mutate: updateTeam, loading, error } = useMutation(UPDATE_TEAM);
    const teamStore = useTeamStore();

    const execute = async (input: TeamInput) => {
      try {
        const result = await updateTeam({ input });
        if (result?.data?.updateTeam) {
          const index = teamStore.teams.findIndex(t => t.id === input.id);
          if (index !== -1) {
            teamStore.teams[index] = result.data.updateTeam;
          }
        }
        return result?.data?.updateTeam;
      } catch (err) {
        console.error('Error updating team:', err);
        throw err;
      }
    };

    return {
      updateTeam: execute,
      loading,
      error
    };
  },

  useDeleteTeam() {
    const { mutate: deleteTeam, loading, error } = useMutation(DELETE_TEAM);
    const teamStore = useTeamStore();

    const execute = async (id: string) => {
      try {
        const result = await deleteTeam({ id });
        if (result?.data?.deleteTeam) {
          const index = teamStore.teams.findIndex(t => t.id === id);
          if (index !== -1) {
            teamStore.teams.splice(index, 1);
          }
        }
        return result?.data?.deleteTeam;
      } catch (err) {
        console.error('Error deleting team:', err);
        throw err;
      }
    };

    return {
      deleteTeam: execute,
      loading,
      error
    };
  }
};
