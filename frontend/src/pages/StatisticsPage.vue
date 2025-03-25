<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Statistics</h1>
    <TopPlayers />
    <TeamStatistics />
  </div>
</template>

<script setup lang="ts">
import TopPlayers from 'src/components/statistics/TopPlayers.vue'
import TeamStatistics from 'src/components/statistics/TeamStatistics.vue'
</script>
