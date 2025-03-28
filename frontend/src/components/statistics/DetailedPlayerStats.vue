<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Player Statistics</h2>
      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Sort by:</label>
          <select v-model="sortBy" class="border rounded px-2 py-1">
            <option value="goals">Goals</option>
            <option value="assists">Assists</option>
            <option value="goalsAndAssists">Goals + Assists</option>
            <option value="yellowCards">Yellow Cards</option>
            <option value="redCards">Red Cards</option>
            <option value="averageRating">Average Rating</option>
            <option value="highestRating">Highest Rating</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Order:</label>
          <select v-model="sortOrder" class="border rounded px-2 py-1">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Time period:</label>
          <select v-model="timePeriod" class="border rounded px-2 py-1">
            <option value="all">All time</option>
            <option value="season">This season</option>
            <option value="month">Last 30 days</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error.message }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goals</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assists</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yellow Cards</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Red Cards</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Rating</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Rating</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="player in stats" :key="player.playerId" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ player.playerName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.matchesPlayed }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.goals }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.assists }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.yellowCards }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.redCards }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.averageRating.toFixed(1) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ player.highestRating }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { statisticsService, type DetailedPlayerStatsQueryVariables } from 'src/services/statisticsService'

const sortBy = ref<DetailedPlayerStatsQueryVariables['sortBy']>('averageRating')
const sortOrder = ref<DetailedPlayerStatsQueryVariables['sortOrder']>('desc')
const timePeriod = ref<'all' | 'season' | 'month'>('all')
const limit = ref<number | undefined>(10)

const dateRange = computed(() => {
  const now = new Date()
  let startDate: Date | undefined
  let endDate: Date | undefined

  switch (timePeriod.value) {
    case 'season':
      // Assuming season starts in August
      startDate = new Date(now.getFullYear(), 7, 1)
      endDate = now
      break
    case 'month':
      startDate = new Date(now.setDate(now.getDate() - 30))
      endDate = new Date()
      break
    default:
      startDate = undefined
      endDate = undefined
  }

  return { startDate, endDate }
})

const { detailedPlayerStats, loading, error } = statisticsService.useDetailedPlayerStats({
  sortBy: sortBy.value,
  sortOrder: sortOrder.value,
  startDate: dateRange.value.startDate,
  endDate: dateRange.value.endDate,
  limit: limit.value
})

const stats = computed(() => detailedPlayerStats || [])
</script>
