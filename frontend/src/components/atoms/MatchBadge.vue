<template>
  <q-badge :color="color" class="match-badge">
    <slot></slot>
  </q-badge>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>

<style scoped>
.match-badge {
  font-size: 0.8rem;
  padding: 4px 8px;
}
</style>
