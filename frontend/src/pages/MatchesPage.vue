<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="text-h4 q-mb-md">Matches</div>

      <div v-if="loading" class="flex justify-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="error" class="text-negative q-pa-md">
        {{ error }}
      </div>

      <div v-else>
        <!-- Live Matches -->
        <div v-if="liveMatches.length > 0" class="q-mb-xl">
          <div class="text-h5 q-mb-md">Live Matches</div>
          <div class="row q-col-gutter-md">
            <div v-for="match in liveMatches" :key="match.id" class="col-12 col-md-6">
              <q-card flat bordered class="match-card" @click="goToMatch(match.id)">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col-5 text-right">
                      <div class="text-subtitle1">{{ match.homeTeam.name }}</div>
                    </div>
                    <div class="col-2 text-center">
                      <div class="text-h6">
                        {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
                      </div>
                      <div class="text-caption text-red">LIVE</div>
                    </div>
                    <div class="col-5">
                      <div class="text-subtitle1">{{ match.awayTeam.name }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Matches by Date -->
        <div v-for="(matches, date) in groupedMatches" :key="date" class="q-mb-xl">
          <div class="text-h5 q-mb-md">{{ formatDateHeader(date) }}</div>
          <div class="row q-col-gutter-md">
            <div v-for="match in matches" :key="match.id" class="col-12 col-md-6">
              <q-card flat bordered class="match-card" @click="goToMatch(match.id)">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col-5 text-right">
                      <div class="text-subtitle1">{{ match.homeTeam.name }}</div>
                    </div>
                    <div class="col-2 text-center">
                      <template v-if="match.status === Status.Completed">
                        <div class="text-h6">
                          {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
                        </div>
                        <div class="text-caption">FT</div>
                      </template>
                      <template v-else>
                        <div class="text-caption">{{ formatTime(match.scheduledDate) }}</div>
                      </template>
                    </div>
                    <div class="col-5">
                      <div class="text-subtitle1">{{ match.awayTeam.name }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { matchService } from 'src/services/matchService';
import { Status } from '../gql/__generated__/graphql';

const router = useRouter();

// Use the matches query composable
const { matches, loading, error } = matchService.useMatches(20);

const liveMatches = computed(() =>
  matches.value?.matches.nodes.filter(m => m.status === Status.InProgress) || []
);

const nonLiveMatches = computed(() =>
  matches.value?.matches.nodes.filter(m => m.status !== Status.InProgress) || []
);

const groupedMatches = computed(() => {
  const groups: { [key: string]: typeof nonLiveMatches.value } = {};

  nonLiveMatches.value?.forEach(match => {
    const matchDate = new Date(match.scheduledDate);
    const dateKey = matchDate.toISOString().split('T')[0];

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(match);
  });

  // Sort dates in ascending order
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  );
});

const formatDateHeader = (dateStr: string | number): string => {
  if (!dateStr) return 'N/A';
  try {
    const dateObj = new Date(dateStr);
    return date.formatDate(dateObj, 'MMMM D, YYYY');
  } catch {
    return String(dateStr);
  }
};

const formatTime = (dateStr: string | number): string => {
  if (!dateStr) return 'N/A';
  try {
    const dateObj = new Date(dateStr);
    return date.formatDate(dateObj, 'h:mm A');
  } catch {
    return String(dateStr);
  }
};

const goToMatch = async (id: string) => {
  await router.push(`/matches/${id}`);
};
</script>

<style scoped>
.match-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
</style>
