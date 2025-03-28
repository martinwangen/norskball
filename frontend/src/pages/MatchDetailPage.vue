<template>
  <div class="match-detail">
    <div v-if="loading" class="flex justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="error" class="text-negative q-pa-md">
      {{ error.message }}
    </div>

    <div v-else class="match-content">
      <match-detail-header
        :match="match"
        :loading="loading"
        :error="error?.message"
        @update:match="updateMatch"
      />

      <match-event-bar
        :match="match"
        @update:match="updateMatch"
      />

      <match-lineups
        :match="match"
        :loading="loading"
        :error="error?.message"
        @update:match="updateMatch"
      />

      <match-info
        :match="match"
      />

      <div v-if="isAdmin" class="row justify-end q-mb-md">
        <q-btn
          color="primary"
          icon="add"
          label="Add Event"
          @click="showEventForm = true"
        />
      </div>

      <q-dialog v-model="showEventForm" persistent>
        <q-card style="min-width: 500px">
          <match-event-form
            :match="match"
            :event-type="selectedEventType"
            @event-added="handleEventAdded"
            @cancel="showEventForm = false"
          />
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { matchService } from 'src/services/matchService';
import { useAuthStore } from 'src/stores/auth';
import type { Match } from 'src/gql/__generated__/graphql';
import { EventType } from 'src/gql/__generated__/graphql';
import MatchDetailHeader from 'src/components/organisms/MatchDetailHeader.vue';
import MatchEventBar from 'src/components/molecules/MatchEventBar.vue';
import MatchLineups from 'src/components/organisms/MatchLineups.vue';
import MatchInfo from 'src/components/organisms/MatchInfo.vue';
import MatchEventForm from 'src/components/organisms/MatchEventForm.vue';

const route = useRoute();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAuthenticated);
const showEventForm = ref(false);
const selectedEventType = ref<EventType>(EventType.Goal); // Default to Goal event type

const { match, loading, error, refetch } = matchService.useMatch(route.params.id as string);

const updateMatch = async (updatedMatch: Match) => {
  try {
    const { updateMatch } = matchService.useUpdateMatch();
    await updateMatch(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
  }
};

const handleEventAdded = async () => {
  showEventForm.value = false;
  await refetch();
};
</script>

<style scoped>
.match-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.match-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
