<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Statistics</h1>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-2">Top Scorer</h3>
        <div v-if="topScorer" class="text-2xl font-bold">{{ topScorer.playerName }}</div>
        <div class="text-gray-600">{{ topScorer?.goals || 0 }} goals</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-2">Most Assists</h3>
        <div v-if="topAssister" class="text-2xl font-bold">{{ topAssister.playerName }}</div>
        <div class="text-gray-600">{{ topAssister?.assists || 0 }} assists</div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-2">Best Rated Player</h3>
        <div v-if="bestRated" class="text-2xl font-bold">{{ bestRated.playerName }}</div>
        <div class="text-gray-600">Rating: {{ bestRated?.averageRating?.toFixed(1) || 0 }}</div>
      </div>
    </div>

    <!-- Detailed Player Statistics -->
    <DetailedPlayerStats />

    <!-- Team Statistics -->
    <TeamStatistics />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TeamStatistics from 'src/components/statistics/TeamStatistics.vue'
import DetailedPlayerStats from 'src/components/statistics/DetailedPlayerStats.vue'
import { statisticsService } from 'src/services/statisticsService'

// Get detailed stats for quick stats cards
const { detailedPlayerStats: goalsStats } = statisticsService.useDetailedPlayerStats({
  sortBy: 'goals',
  sortOrder: 'desc',
  limit: 1
})

const { detailedPlayerStats: assistStats } = statisticsService.useDetailedPlayerStats({
  sortBy: 'assists',
  sortOrder: 'desc',
  limit: 1
})

const { detailedPlayerStats: ratingStats } = statisticsService.useDetailedPlayerStats({
  sortBy: 'averageRating',
  sortOrder: 'desc',
  limit: 1
})

const topScorer = computed(() => goalsStats?.[0] || null)
const topAssister = computed(() => assistStats?.[0] || null)
const bestRated = computed(() => ratingStats?.[0] || null)
</script>
