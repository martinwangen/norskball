<template>
  <div class="match-detail-header">
    <q-card flat bordered>
      <match-header
        :status="match.status"
      />
    </q-card>

    <q-card flat bordered class="q-mt-md">
      <q-card-section>
        <div class="row items-center q-col-gutter-lg">
          <!-- Home Team -->
          <div class="col-xs-12 col-sm-5">
            <team-display
              :team="match.homeTeam"
            />
          </div>

          <!-- Score -->
          <div class="col-xs-12 col-sm-2">
            <match-score
              :home-score="match.score?.homeTeamScore"
              :away-score="match.score?.awayTeamScore"
              :status="match.status"
              :formatted-date="formatDate(match.scheduledDate)"
            />
          </div>

          <!-- Away Team -->
          <div class="col-xs-12 col-sm-5">
            <team-display
              :team="match.awayTeam"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import type { Match } from '../../gql/__generated__/graphql';
import MatchHeader from '../molecules/MatchHeader.vue';
import TeamDisplay from '../molecules/TeamDisplay.vue';
import MatchScore from '../molecules/MatchScore.vue';

defineProps<{
  match: Match;
}>();

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return date.formatDate(dateStr, 'MMMM D, YYYY [at] h:mm A');
  } catch {
    return dateStr;
  }
};
</script>

<style scoped>
.match-detail-header {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
