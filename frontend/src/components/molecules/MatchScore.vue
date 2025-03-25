<template>
  <div class="match-score text-center">
    <div v-if="isFinishedOrLive" class="text-h3 text-weight-bold">
      {{ homeScore }} - {{ awayScore }}
    </div>
    <div v-else class="text-h3 text-weight-bold text-grey">
      vs
    </div>
    <div class="text-subtitle1 q-mt-sm">
      {{ formattedDate }}
    </div>
    <div class="text-caption" v-if="stadium">
      {{ stadium }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Status } from '../../gql/__generated__/graphql';

const props = defineProps<{
  homeScore: number;
  awayScore: number;
  status: Status;
  formattedDate: string;
  stadium?: string;
}>();

const isFinishedOrLive = computed(() => {
  return props.status === Status.InProgress || props.status === Status.Completed;
});
</script>

<style scoped>
.match-score {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
