<template>
  <div class="match-events">
    <div class="text-h6">Match Events</div>
    <q-separator class="q-my-md" />

    <q-timeline color="primary">
      <q-timeline-entry
        v-for="(event, index) in events"
        :key="index"
        :title="event"
        :subtitle="getEventTime(event)"
        icon="sports_soccer"
      >
        <div>{{ getEventDescription(event) }}</div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  events: string[];
}>();

// Get event time
const getEventTime = (event: string): string => {
  const match = event.match(/\((\d+)'\)/);
  return match ? `${match[1]} min` : '';
};

// Get event description
const getEventDescription = (event: string): string => {
  return event.replace(/\(\d+'\)/, '').trim();
};
</script>

<style scoped>
.match-events {
  width: 100%;
}
</style>
