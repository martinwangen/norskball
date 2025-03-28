<template>
  <div class="team-display text-center">
    <team-logo
      :team-id="team?.id"
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
      :label="$t('teams.viewTeam')"
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
}>(), {
  logoSize: '80px'
});
</script>

<style scoped>
.team-display {
  width: 100%;
}
</style>
