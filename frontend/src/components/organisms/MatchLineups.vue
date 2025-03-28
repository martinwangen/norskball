<template>
  <div class="match-lineups">
    <div class="text-h6 q-mb-md">Lineups</div>

    <div v-if="loading" class="flex justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="error" class="text-negative q-pa-md">
      {{ error }}
    </div>

    <div v-else class="row q-col-gutter-md">
      <!-- Home Team Lineup -->
      <div class="col-12 col-md-6">
        <lineup-card
          v-if="match?.homeTeam"
          :team="match.homeTeam"
          :lineup="match.homeTeamLineup"
          :loading="loading || !match.homeTeamLineup"
          :match-id="match.id"
        />
      </div>

      <!-- Away Team Lineup -->
      <div class="col-12 col-md-6">
        <lineup-card
          v-if="match?.awayTeam"
          :team="match.awayTeam"
          :lineup="match.awayTeamLineup"
          :loading="loading || !match.awayTeamLineup"
          :match-id="match.id"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePlayerStore } from 'src/stores/players';
import LineupCard from 'src/components/organisms/LineupCard.vue';
import type { Match } from 'src/gql/__generated__/graphql';

const props = defineProps<{
  match: Match;
  loading?: boolean;
  error?: string;
}>();


const playerStore = usePlayerStore();


// Initialize lineups
onMounted(async () => {
  try {
    // Fetch players for both teams if they don't have players
    if (props.match.homeTeam && (!props.match.homeTeam.players || props.match.homeTeam.players.length === 0)) {
      try {
        const homePlayers = await playerStore.fetchPlayersByTeam(props.match.homeTeam.id);
        if (homePlayers) {
          playerStore.playersByTeam[props.match.homeTeam.id] = homePlayers;
        }
      } catch (error) {
        console.error('Failed to fetch home team players:', error);
      }
    }

    if (props.match.awayTeam && (!props.match.awayTeam.players || props.match.awayTeam.players.length === 0)) {
      try {
        const awayPlayers = await playerStore.fetchPlayersByTeam(props.match.awayTeam.id);
        if (awayPlayers) {
          playerStore.playersByTeam[props.match.awayTeam.id] = awayPlayers;
        }
      } catch (error) {
        console.error('Failed to fetch away team players:', error);
      }
    }
  } catch (error) {
    console.error('Failed to initialize lineups:', error);
  }
});
</script>

<style scoped>
.match-lineups {
  width: 100%;
}
</style>
