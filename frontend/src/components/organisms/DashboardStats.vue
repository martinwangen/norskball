<template>
  <div class="dashboard-stats">
    <div v-if="loading" class="row justify-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="q-ml-sm text-subtitle1">Loading stats...</div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card class="stat-card bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Total Teams</div>
            <div class="text-h2 q-mt-sm">{{ stats.teamCount }}</div>
            <q-linear-progress
              :value="stats.teamCount / 100"
              color="white"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="white" label="View Teams" to="/teams" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Total Players</div>
            <div class="text-h2 q-mt-sm">{{ stats.playerCount }}</div>
            <q-linear-progress
              :value="stats.playerCount / 1000"
              color="white"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="white" label="View Players" to="/players" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Total Matches</div>
            <div class="text-h2 q-mt-sm">{{ stats.matchCount }}</div>
            <q-linear-progress
              :value="stats.matchCount / 500"
              color="white"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="white" label="View Matches" to="/matches" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="stat-card bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Avg. Rating</div>
            <div class="text-h2 q-mt-sm">{{ stats.avgRating.toFixed(1) }}</div>
            <q-linear-progress
              :value="stats.avgRating / 10"
              color="white"
              class="q-mt-md"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="white" label="View Ratings" to="/ratings" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { playerService } from 'src/services/playerService';
import { teamService } from 'src/services/teamService';
import { matchService } from 'src/services/matchService';

interface Stats {
  teamCount: number;
  playerCount: number;
  matchCount: number;
  avgRating: number;
}

const stats = ref<Stats>({
  teamCount: 0,
  playerCount: 0,
  matchCount: 0,
  avgRating: 0
});

const loading = ref(false);

const fetchStats = () => {
  try {
    loading.value = true;

    // Fetch team count
    const teams = teamService.useTeams();
    stats.value.teamCount = teams.teams.value.length;

    // Fetch player count and calculate average rating
    const players = playerService.usePlayers();
    stats.value.playerCount = players.players.value.length;

    // Calculate average rating
    let totalRating = 0;
    let ratedPlayers = 0;

    players.players.value.forEach(player => {
      if (player.stats?.rating) {
        totalRating += player.stats.rating;
        ratedPlayers++;
      }
    });

    stats.value.avgRating = ratedPlayers > 0 ? totalRating / ratedPlayers : 0;

    // Fetch match count from API
    try {
      const matches = matchService.useMatches();
      stats.value.matchCount = matches.matches.value.length;
    } catch (err) {
      console.error('Error fetching matches:', err);
      stats.value.matchCount = 0;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void fetchStats();
});
</script>

<style scoped>
.stat-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
</style>
