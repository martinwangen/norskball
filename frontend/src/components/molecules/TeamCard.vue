<template>
  <q-card class="team-card" @click="handleNavigateToTeam">
    <q-card-section class="team-header">
      <div class="row items-center no-wrap">
        <div class="col-auto">
          <q-avatar size="60px" class="team-logo">
            <q-img
              :src="teamLogoUrl"
              :ratio="1"
              fit="contain"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="sports_soccer" size="40px" color="grey-7" />
                </div>
              </template>
            </q-img>
          </q-avatar>
        </div>
        <div class="col q-ml-md">
          <div class="text-h6 ellipsis-2-lines">{{ team.name }}</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat color="primary" label="View Team" :to="'/teams/' + team.id" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import type { Team } from '../../gql/__generated__/graphql';
import { getTeamLogoUrl } from 'src/utils/teamLogos';
import { navigateToTeam } from 'src/utils/navigation';

interface Props {
  team: Team;
}

const props = defineProps<Props>();
const router = useRouter();

// Use the utility function to get the team logo URL
const teamLogoUrl = computed(() => getTeamLogoUrl(props.team.name));

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

.team-logo {
  background-color: white;
  border: 1px solid #eee;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
