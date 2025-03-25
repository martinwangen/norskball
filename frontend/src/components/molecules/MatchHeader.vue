<template>
  <div class="match-header q-pa-md bg-primary text-white rounded-borders">
    <div class="row items-center justify-between q-col-gutter-md">
      <div class="col-auto">
        <match-badge :color="getStatusColor(status)">
          {{ getStatusText(status) }}
        </match-badge>
        <match-badge v-if="status === Status.InProgress" color="red" class="q-ml-xs">
          LIVE
        </match-badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Status } from '../../gql/__generated__/graphql';
import MatchBadge from '../atoms/MatchBadge.vue';

defineProps<{
  status: Status;
}>();

// Get status text
const getStatusText = (status: Status): string => {
  switch (status) {
    case Status.Scheduled: return 'Scheduled';
    case Status.InProgress: return 'Live';
    case Status.Completed: return 'Finished';
    case Status.Postponed: return 'Postponed';
    case Status.Cancelled: return 'Cancelled';
    default: return 'Unknown';
  }
};

// Get status color
const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.Scheduled: return 'blue';
    case Status.InProgress: return 'red';
    case Status.Completed: return 'green';
    case Status.Postponed: return 'orange';
    case Status.Cancelled: return 'grey';
    default: return 'grey';
  }
};


</script>

<style scoped>
.match-header {
  width: 100%;
}
</style>
