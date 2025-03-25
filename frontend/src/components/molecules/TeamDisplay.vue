<template>
  <div class="team-display text-center">
    <team-logo
      :logo-url="team?.logo"
      :team-name="team?.name"
      :size="logoSize || '80px'"
      class="q-mb-sm"
    />
    <div class="text-h6 text-weight-bold">
      {{ team?.name }}
    </div>
    <q-btn
      v-if="team"
      flat
      no-caps
      color="primary"
      :to="`/teams/${team.id}`"
      :label="buttonLabel"
      class="q-mt-sm"
    />
  </div>
</template>

<script setup lang="ts">
import TeamLogo from '../atoms/TeamLogo.vue';
import type { Team } from '../../gql/__generated__/graphql';

withDefaults(defineProps<{
  team?: Team | undefined;
  logoSize?: string | undefined;
  buttonLabel?: string;
}>(), {
  logoSize: '80px',
  buttonLabel: 'View Team'
});
</script>

<style scoped>
.team-display {
  width: 100%;
}
</style>
