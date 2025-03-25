<template>
  <img
    :src="logoUrl"
    :alt="props.team?.name || 'Team Logo'"
    :width="logoSize"
    :height="logoSize"
    class="team-logo"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getTeamLogoUrl } from '../../utils/teamLogos';

const props = defineProps<{
  team?: {
    name: string;
    logo?: string;
  };
  size?: string | number;
}>();

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

const logoUrl = computed(() => {
  if (!props.team) return getTeamLogoUrl('', undefined, parseInt(logoSize.value));
  return getTeamLogoUrl(props.team.name, props.team.logo, parseInt(logoSize.value));
});
</script>

<style scoped>
.team-logo {
  object-fit: contain;
  border-radius: 50%;
}

</style>
