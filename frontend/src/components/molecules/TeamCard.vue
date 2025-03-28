<template>
  <q-card class="team-card" @click="handleNavigateToTeam">
    <q-card-section class="team-header">
      <team-logo :team-id="team.id" />
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat color="primary" :label="$t('teams.viewTeam')" :to="'/teams/' + team.id" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Team } from '../../gql/__generated__/graphql';
import { navigateToTeam } from 'src/utils/navigation';

interface Props {
  team: Team;
}

const props = defineProps<Props>();
const router = useRouter();

// Use the utility function to navigate to the team
const handleNavigateToTeam = () => {
  navigateToTeam(router, props.team.id);
};
</script>

<style scoped>
.team-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
