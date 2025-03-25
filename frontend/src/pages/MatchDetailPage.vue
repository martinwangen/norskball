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

      <match-lineups
        :match="match"
        :loading="loading"
        :error="error?.message"
        @update:match="updateMatch"
      />


    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { matchService } from 'src/services/matchService';
import type { Match } from 'src/gql/__generated__/graphql';
import MatchDetailHeader from 'src/components/organisms/MatchDetailHeader.vue';
import MatchLineups from 'src/components/organisms/MatchLineups.vue';


const route = useRoute();
const { match, loading, error } = matchService.useMatch(route.params.id as string);


const updateMatch = async (updatedMatch: Match) => {
  try {
    const { updateMatch } = matchService.useUpdateMatch();
    await updateMatch(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
  }
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
