<template>
  <q-item>
    <q-item-section avatar>
      <player-avatar
        :photo-url="player.photo_url"
        :player-name="player.name"
        :size="avatarSize || '40px'"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ player.name }}</q-item-label>
      <q-item-label caption>{{ player.position }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-chip dense :color="teamColor" text-color="white">{{ player.number }}</q-chip>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import PlayerAvatar from '../atoms/PlayerAvatar.vue';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  team_id: number;
  photo_url?: string | undefined;
}

withDefaults(defineProps<{
  player: Player;
  teamColor: string;
  avatarSize?: string | undefined;
}>(), {
  avatarSize: '40px'
});
</script>
