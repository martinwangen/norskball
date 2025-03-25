<template>
  <q-card class="player-stat-card">
    <q-card-section class="text-center">
      <div class="text-h6 stat-title">{{ title }}</div>
      <div class="text-h3 stat-value q-mt-sm" :class="valueClass">{{ value }}</div>
      <div class="text-caption q-mt-xs text-grey-7">{{ subtitle }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  color: 'primary'
});

const valueClass = computed(() => {
  return `text-${props.color}`;
});
</script>

<style scoped>
.player-stat-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.player-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.stat-title {
  font-weight: 500;
}

.stat-value {
  font-weight: 700;
}
</style>
