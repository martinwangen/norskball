<template>
  <q-page padding>
    <div class="text-center q-pa-md">
      <h1 class="text-h3 q-mb-md">{{ $t('index.welcome') }}</h1>
      <p class="text-subtitle1 q-mb-xl">{{ $t('index.subtitle') }}</p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="cursor-pointer" @click="$router.push('/teams')">
          <q-card-section class="text-center">
            <q-icon name="groups" size="4em" color="primary" />
            <h2 class="text-h5 q-mt-sm">{{ $t('index.teams.title') }}</h2>
            <p class="text-grey-7">{{ $t('index.teams.description') }}</p>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="cursor-pointer" @click="$router.push('/players')">
          <q-card-section class="text-center">
            <q-icon name="sports" size="4em" color="primary" />
            <h2 class="text-h5 q-mt-sm">{{ $t('index.players.title') }}</h2>
            <p class="text-grey-7">{{ $t('index.players.description') }}</p>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="cursor-pointer" @click="$router.push('/matches')">
          <q-card-section class="text-center">
            <q-icon name="sports_soccer" size="4em" color="primary" />
            <h2 class="text-h5 q-mt-sm">{{ $t('index.matches.title') }}</h2>
            <p class="text-grey-7">{{ $t('index.matches.description') }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-mt-xl">
      <div class="col-12 col-md-8 text-center">
        <q-card flat bordered>
          <q-card-section>
            <h3 class="text-h6">{{ $t('index.quickStats.title') }}</h3>
            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-4">
                <div class="text-h4 text-primary">{{ stats.teams }}</div>
                <div class="text-caption">{{ $t('index.quickStats.teams') }}</div>
              </div>
              <div class="col-4">
                <div class="text-h4 text-primary">{{ stats.players }}</div>
                <div class="text-caption">{{ $t('index.quickStats.players') }}</div>
              </div>
              <div class="col-4">
                <div class="text-h4 text-primary">{{ stats.matches }}</div>
                <div class="text-caption">{{ $t('index.quickStats.matches') }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { teamService } from '../services/teamService';
import { usePlayerStore } from 'src/stores/players';
import { matchService } from '../services/matchService';

const stats = ref({
  teams: 0,
  players: 0,
  matches: 0,
});

const playerStore = usePlayerStore();

const loadStats = async () => {
  try {
    const [teamsResponse, , matchesResponse] = await Promise.all([
      teamService.useTeams(),
      playerStore.fetchPlayers(),
      matchService.useMatches()
    ]);

    stats.value = {
      teams: teamsResponse.teams.value?.nodes?.length ?? 0,
      players: playerStore.players.length,
      matches: matchesResponse.matches.value?.length ?? 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};

onMounted(async () => {
  await loadStats();
});
</script>

<style scoped>
.q-card {
  transition: transform 0.2s;
}

.q-card:hover {
  transform: translateY(-5px);
}
</style>
