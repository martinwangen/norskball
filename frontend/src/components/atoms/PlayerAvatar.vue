<template>
  <img
    :src="avatarUrl"
    :alt="props.alt || (props.player ? `${props.player.firstName} ${props.player.lastName}` : $t('players.avatar'))"
    :width="props.size || '40'"
    :height="props.size || '40'"
    class="player-avatar"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from  '../../gql/__generated__/graphql';
import { getPersonPlaceholder } from '../../utils/placeholders';
import { getPlayerFullName } from '../../services/playerService';

const props = defineProps<{
  player?: Player;
  photoUrl?: string;
  alt?: string;
  size?: string;
}>();

const avatarUrl = computed(() => {
  if (props.photoUrl) {
    return props.photoUrl;
  }

  if (props.player?.imageUrl) {
    return props.player.imageUrl;
  }

  const text = props.player ? getPlayerFullName(props.player).charAt(0) : 'P';
  return getPersonPlaceholder(text, parseInt(props.size || '40'));
});
</script>

<style scoped>
.player-avatar {
  object-fit: cover;
  border-radius: 50%;
}
</style>
