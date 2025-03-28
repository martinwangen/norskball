<template>
  <div class="match-detail-header">
    <q-card flat bordered>
      <q-card-section>
        <match-header
          :status="match.status"
          :is-admin="isAdmin"
          :editable="editable"
          @update:status="updateMatchStatus"
        />
      </q-card-section>

      <q-separator />

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
            <div class="row justify-center q-mt-sm">
              <dice-rating
                :model-value="match.rating"
                :editable="editable"
                @update:model-value="updateMatchRating"
              />
            </div>
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
import { computed } from 'vue';
import type { Match, Status } from '../../gql/__generated__/graphql';
import MatchHeader from '../molecules/MatchHeader.vue';
import TeamDisplay from '../molecules/TeamDisplay.vue';
import MatchScore from '../molecules/MatchScore.vue';
import DiceRating from '../atoms/DiceRating.vue';
import { useAuthStore } from '../../stores/auth';

const props = defineProps<{
  match: Match;
  editable?: boolean;
}>();

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAuthenticated); // TODO: Fix this

const emit = defineEmits<{
  (e: 'update:match', match: Match): void;
}>();

const updateMatchRating = (rating: number) => {
  emit('update:match', { ...props.match, rating });
};

const updateMatchStatus = (status: Status) => {
  emit('update:match', { ...props.match, status });
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    // Add 1 hour for timezone
    date.setHours(date.getHours() + 1);
    const formattedDate = date.toLocaleString('nb-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    // Remove "kl." and replace comma+space with line break
    return formattedDate.replace('kl.', '').replace(', ', '\n').trim();
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
