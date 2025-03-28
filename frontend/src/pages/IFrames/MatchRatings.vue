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
import { ref, computed, onMounted } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GetAllMatchRatingsOnlyRatedPlayers } from '../../gql/queries/ratings';
import MatchDetails from '../../components/IFrame/MatchDetails.vue';
import MatchList from '../../components/IFrame/MatchList.vue';
import { useQuasar } from 'quasar';
import mockratings from './mockratings.json';
const $q = useQuasar();
const ratings = ref([]);
const selectedMatchId = ref<string | null>(null);

// Function to detect parent theme
const detectParentTheme = () => {
  try {
    // Check if we're in an iframe
    if (window.parent !== window) {
      // Get the parent document's body background color
      const parentBgColor = window.parent.document.body.style.backgroundColor;
      if (parentBgColor) {
        // Convert RGB to HSL to determine if it's dark or light
        const rgb = parentBgColor.match(/\d+/g)?.map(Number);
        if (rgb && rgb.length >= 3) {
          const r = rgb[0] / 255;
          const g = rgb[1] / 255;
          const b = rgb[2] / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;

          // If lightness is less than 0.5, consider it dark theme
          if (l < 0.5) {
            $q.dark.set(true);
          } else {
            $q.dark.set(false);
          }
        }
      }
    }
  } catch (error) {
    console.warn('Could not detect parent theme:', error);
  }
};

// Listen for theme changes from parent
const handleMessage = (event: MessageEvent) => {
  if (event.data && typeof event.data.theme === 'string') {
    $q.dark.set(event.data.theme === 'dark');
  }
};

onMounted(() => {
  detectParentTheme();
  window.addEventListener('message', handleMessage);
});

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

const { loading: queryLoading, onResult: onResult,onError: onError } = useQuery(GetAllMatchRatingsOnlyRatedPlayers, {
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
    }else{
      ratings.value = mockratings.data.allMatchRatingsOnlyRatedPlayers.nodes;
      selectedMatchId.value = mockratings[0].id;
    }
  }
});

onError((error) => {
  console.error('Error fetching match ratings:', error);
  ratings.value = mockratings.data.allMatchRatingsOnlyRatedPlayers.nodes;
  selectedMatchId.value = mockratings[0].id;
});
</script>

<style scoped>
.match-ratings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1800px;
  margin: 0 auto;
  overflow-y: auto;
}

.match-list-container {
  width: 100%;
}

.match-display-container {
  width: 100%;
  overflow-y: auto;

}

/* Hide scrollbar for Chrome, Safari and Opera */
.match-ratings-container::-webkit-scrollbar,
.match-display-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.match-ratings-container,
.match-display-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Theme-specific styles */
:deep(.q-card) {
  background: var(--q-color-surface);
  border: 1px solid var(--q-color-surface-variant);
}

:deep(.q-table) {
  background: var(--q-color-surface);
  border: 1px solid var(--q-color-surface-variant);
}

:deep(.q-table tbody tr) {
  background: var(--q-color-surface);
}

:deep(.q-table tbody tr:nth-child(even)) {
  background: var(--q-color-surface-variant);
}

:deep(.q-table th) {
  background: var(--q-color-surface-variant);
}

@media (max-width: 768px) {
  .match-ratings-container {
    height: calc(100vh - 1rem);
  }

  .match-display-container {
    max-height: calc(100vh - 250px);
  }
}
</style>
