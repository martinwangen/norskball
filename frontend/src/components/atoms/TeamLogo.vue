<template>
  <img
    v-if="team"
    :src="team.logo || 'https://via.placeholder.com/60?text=' + (team.name?.charAt(0) || 'T')"
    :alt="team.name || $t('teams.logo')"
    :width="logoSize"
    class="team-logo"
  />
  <q-avatar v-else :size="logoSize" color="grey-3">
    <q-icon name="groups" :size="String(parseInt(logoSize) / 2)" color="grey-7" />
  </q-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTeamStore } from '../../stores/teams';
const props = defineProps<{
  teamId: string;
  size?: string | number;
}>();

const teamStore = useTeamStore();
const team = computed(() => teamStore.getTeamById(props.teamId));

const getSizeValue = (size?: string | number): string => {
  if (typeof size === 'number') return `${size}`;
  switch (size) {
    case 'sm': return '32';
    case 'md': return '48';
    case 'lg': return '64';
    case 'xl': return '96';
    default: return '60';
  }
};

const logoSize = computed(() => getSizeValue(props.size));

</script>

<style scoped>
.team-logo {
  object-fit: contain;
  width: 100%;
  max-width: v-bind(logoSize + 'px');
}

</style>
