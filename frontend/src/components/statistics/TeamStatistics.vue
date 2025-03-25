<template>
  <q-card class="team-statistics-card">
    <q-card-section>
      <div class="text-h6">Team Statistics</div>
    </q-card-section>

    <q-card-section>
      <q-select
        v-model="selectedTeamId"
        :options="teams"
        option-label="name"
        option-value="id"
        label="Select Team"
        outlined
        class="q-mb-md"
        @update:model-value="handleTeamSelect"
      />

      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="3em" />
        <div class="text-subtitle1 q-mt-sm">Loading team statistics...</div>
      </div>

      <div v-else-if="error" class="text-center q-pa-md">
        <q-icon name="error" color="negative" size="3em" />
        <div class="text-subtitle1 q-mt-sm text-negative">{{ error?.message || 'Failed to load team statistics' }}</div>
      </div>

      <statistics-table
        v-else
        :players="teamRatings || []"
        class="q-mt-md"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTeamStore } from 'src/stores/teams'
import StatisticsTable from './StatisticsTable.vue'
import { statisticsService } from 'src/services/statisticsService'

const teamStore = useTeamStore()
const { teams } = teamStore

const selectedTeamId = ref<string | null>(null)
const { teamRatings, loading, error } = statisticsService.useTeamRatings(selectedTeamId.value || '')

const handleTeamSelect = (teamId: string) => {
  selectedTeamId.value = teamId
}

watch(selectedTeamId, (newTeamId) => {
  if (newTeamId) {
    // The query will automatically run when selectedTeamId changes
  }
})
</script>

<style lang="scss" scoped>
.team-statistics-card {
  background: var(--q-primary);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  :deep(.q-card__section) {
    padding: 16px;
  }

  .text-h6 {
    font-weight: 600;
    margin-bottom: 8px;
  }

  :deep(.q-field) {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
}
</style>
