<template>
  <q-card class="player-card" @click="navigateToPlayer">
    <q-card-section class="player-header">
      <div class="row items-center no-wrap">
        <div class="col-auto">
          <q-avatar size="70px" class="player-avatar">
            <q-img
              :src="player.imageUrl || 'https://via.placeholder.com/70?text=' + player.lastName.charAt(0)"
              :ratio="1"
              fit="cover"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="person" size="40px" color="grey-7" />
                </div>
              </template>
            </q-img>
          </q-avatar>
        </div>
        <div class="col q-ml-md">
          <div class="text-h6 ellipsis-2-lines">{{ player.lastName }}</div>
          <div class="q-mt-xs">
            <q-badge :color="getPositionColor(player.position)">
              {{ player.position }}
            </q-badge>
            <q-badge outline class="q-ml-sm" color="grey">
              {{ player.nationality || 'Unknown' }}
            </q-badge>
          </div>
          <div class="text-caption q-mt-xs">
            <q-icon name="groups" size="xs" />
            <span class="q-ml-xs">{{ player.team.name }}</span>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat color="primary" label="View Profile" :to="'/players/' + player.id" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Player } from '../../gql/__generated__/graphql';


const props = defineProps<{
  player: Player;
}>();
const router = useRouter();


const navigateToPlayer = () => {
  void router.push(`/players/${props.player.id}`);
};

const getPositionColor = (position: string): string => {
  switch (position?.toLowerCase()) {
    case 'goalkeeper':
    case 'gk':
      return 'yellow';
    case 'defender':
    case 'defence':
    case 'cb':
    case 'rb':
    case 'lb':
      return 'blue';
    case 'midfielder':
    case 'midfield':
    case 'cm':
    case 'cdm':
    case 'cam':
    case 'rm':
    case 'lm':
      return 'green';
    case 'forward':
    case 'attack':
    case 'st':
    case 'cf':
    case 'rw':
    case 'lw':
      return 'red';
    default:
      return 'grey';
  }
};
</script>

<style scoped>
.player-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.player-avatar {
  background-color: white;
  border: 1px solid #eee;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
