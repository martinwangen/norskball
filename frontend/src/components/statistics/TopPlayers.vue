<template>
  <q-card class="top-players-card">
    <q-card-section>
      <div class="text-h6">Top Players</div>
    </q-card-section>

    <q-card-section>
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="3em" />
        <div class="text-subtitle1 q-mt-sm">Loading top players...</div>
      </div>

      <div v-else-if="error" class="text-center q-pa-md">
        <q-icon name="error" color="negative" size="3em" />
        <div class="text-subtitle1 q-mt-sm text-negative">{{ error?.message || 'Failed to load top players' }}</div>
      </div>

      <statistics-table
        v-else
        :players="topPlayers || []"
        class="q-mt-md"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import StatisticsTable from './StatisticsTable.vue'
import { statisticsService } from 'src/services/statisticsService'

const { topPlayers, loading, error } = statisticsService.useTopPlayers(10)

onMounted(() => {
  // The query will automatically run when the component is mounted
})
</script>

<style lang="scss" scoped>
.top-players-card {
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
}
</style>
