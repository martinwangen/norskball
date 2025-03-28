<template>
  <q-page class="q-pa-md">
    <div v-if="queryLoading" class="text-center">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!processedRatings.length" class="text-center">
      <div class="text-h6">No match ratings available</div>
    </div>

    <div v-else class="match-ratings-container">
      <div class="match-list-container">
        <MatchList
          :matches="processedRatings"
          v-model:selectedMatchId="selectedMatchId"
        />
      </div>

      <div class="match-display-container">
        <MatchDetails
          v-if="selectedMatch"
          :match="selectedMatch"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GetAllMatchRatingsOnlyRatedPlayers } from '../../gql/queries/ratings';
import MatchDetails from '../../components/IFrame/MatchDetails.vue';
import MatchList from '../../components/IFrame/MatchList.vue';

const ratings = ref([]);
const selectedMatchId = ref<string | null>(null);

const processedRatings = computed(() => {
  return ratings.value
    .filter(match => {
      // Only include matches that have at least one team with ratings
      const hasHomeRatings = match.homeTeamLineup?.players?.some(player => player?.ratings?.length > 0);
      const hasAwayRatings = match.awayTeamLineup?.players?.some(player => player?.ratings?.length > 0);
      return hasHomeRatings || hasAwayRatings;
    })
    .map(match => ({
      ...match,
      homeTeamLineup: match.homeTeamLineup ? {
        ...match.homeTeamLineup,
        players: [...(match.homeTeamLineup?.players || [])].sort((a, b) => {
          // Sort by position number if available, otherwise by position string
          const posA = parseInt(a.position) || a.position;
          const posB = parseInt(b.position) || b.position;
          return posA - posB;
        })
      } : null,
      awayTeamLineup: match.awayTeamLineup ? {
        ...match.awayTeamLineup,
        players: [...(match.awayTeamLineup?.players || [])].sort((a, b) => {
          // Sort by position number if available, otherwise by position string
          const posA = parseInt(a.position) || a.position;
          const posB = parseInt(b.position) || b.position;
          return posA - posB;
        })
      } : null
    }));
});

const selectedMatch = computed(() => {
  if (!selectedMatchId.value) {
    return processedRatings.value[0] || null;
  }
  return processedRatings.value.find(match => match.id === selectedMatchId.value) || null;
});

const { loading: queryLoading, onResult } = useQuery(GetAllMatchRatingsOnlyRatedPlayers, {
  variables: {
    beforeDate: new Date().toISOString()
  }
});

onResult(({ data }) => {
  if (data?.allMatchRatingsOnlyRatedPlayers?.nodes) {
    ratings.value = data.allMatchRatingsOnlyRatedPlayers.nodes;
    // Set the first match as selected by default
    if (processedRatings.value.length > 0) {
      selectedMatchId.value = processedRatings.value[0].id;
    }
  }
});
</script>

<style scoped>
.match-ratings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1800px;
  margin: 0 auto;
}

.match-list-container {
  width: 100%;
}

.match-display-container {
  width: 100%;
}
</style>
