<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-btn
        icon="arrow_back"
        label="Back to Players"
        flat
        color="primary"
        to="/players"
        class="q-mb-md"
      />

      <div v-if="loading" class="flex justify-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="error" class="text-negative q-pa-md">
        {{ error }}
      </div>

      <div v-else-if="player" class="player-detail">
        <div class="row q-col-gutter-lg">
          <!-- Player Header -->
          <div class="col-xs-12 col-md-4 flex flex-center">
            <q-card flat bordered class="player-card">
              <q-img
                :src="player.imageUrl || 'https://via.placeholder.com/300?text=No+Photo'"
                style="height: 300px"
                fit="contain"
                class="player-photo"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3">
                    <q-icon name="person" size="4em" color="grey-7" />
                  </div>
                </template>

                <div class="absolute-bottom text-subtitle2 text-center bg-dark q-pa-xs">
                  <q-badge :color="getPositionColor(player.position)" class="q-mr-xs">
                    {{ player.position }}
                  </q-badge>
                </div>
              </q-img>

              <q-card-section class="text-center">
                <div class="text-h5">{{ playerFullName }}</div>
                <div class="text-subtitle1">{{ player.nationality }}</div>

                <q-rating
                  v-model="playerRating"
                  size="1.5em"
                  :max="10"
                  color="amber"
                  readonly
                  class="q-mt-sm"
                />
                <div class="text-subtitle1 q-mt-xs">
                  Rating: {{ playerRating.toFixed(1) }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-xs-12 col-md-8">
            <h1 class="text-h3 q-mt-none">{{ playerFullName }}</h1>
            <div class="text-subtitle1 q-mb-md">{{ player.nationality }}</div>

            <q-list bordered separator>
              <q-item v-if="player.dateOfBirth">
                <q-item-section>
                  <q-item-label caption>Birth Date</q-item-label>
                  <q-item-label>{{ formatDate(player.dateOfBirth) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Position</q-item-label>
                  <q-item-label>
                    <q-badge :color="getPositionColor(player.position)">
                      {{ player.position }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="player.teamId">
                <q-item-section>
                  <q-item-label caption>Team</q-item-label>
                  <q-item-label class="row items-center">
                    <team-logo
                      v-if="team"
                      :team="team"
                      size="40"
                      class="q-mr-sm"
                    />
                    <q-btn
                      flat
                      no-caps
                      color="primary"
                      :to="`/teams/${player.teamId}`"
                      :label="team?.name || 'View Team'"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Rate Player -->
        <div class="q-mt-lg">
          <h2 class="text-h5">Rate Player</h2>
          <q-card flat bordered>
            <q-card-section>
              <div class="row items-center">
                <div class="col-12 col-md-6">
                  <q-rating
                    v-model="userRating"
                    size="2em"
                    :max="10"
                    color="amber"
                    icon="star_border"
                    icon-selected="star"
                  />
                  <div class="text-subtitle1 q-mt-sm" v-if="userRating > 0">
                    Your rating: {{ userRating.toFixed(1) }}
                  </div>
                </div>

                <div class="col-12 col-md-6 q-mt-md q-mt-md-none">
                  <q-btn
                    color="primary"
                    label="Submit Rating"
                    :disable="userRating === 0"
                    @click="submitRating"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-else class="text-center q-pa-xl">
        <q-icon name="sports_soccer" size="4em" color="grey-7" />
        <p class="text-h6 text-grey-7">Player not found</p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Player, Team } from '../gql/__generated__/graphql';
import { playerService, getPlayerFullName, getPositionColor } from '../services/playerService';
import { teamService } from '../services/teamService';
import TeamLogo from '../components/atoms/TeamLogo.vue';
import { date } from 'quasar';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const player = ref<Player | null>(null);
const team = ref<Team | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const userRating = ref(0);
const playerRating = ref(0);
const $q = useQuasar();

// Format date
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return date.formatDate(dateStr, 'MMMM D, YYYY');
  } catch {
    return dateStr;
  }
};

// Submit rating
const submitRating = () => {
  if (player.value && userRating.value > 0) {
    playerRating.value = userRating.value;
    $q.notify({
      type: 'positive',
      message: `Thank you for rating ${getPlayerFullName(player.value)}!`
    });
    userRating.value = 0;
  }
};

// Add a computed property for the player's full name
const playerFullName = computed(() => player.value ? getPlayerFullName(player.value) : '');

// Fetch player and team details on component mount
onMounted(() => {
  const playerId = route.params.id as string;

  if (!playerId) {
    error.value = 'Player ID is required';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    const { player: playerData } = playerService.usePlayer(playerId);
    player.value = playerData.value;

    if (!player.value) {
      void router.push('/players');
      return;
    }

    // Fetch team data if player has a team
    if (player.value.teamId) {
      try {
        const { team: teamData } = teamService.useTeam(player.value.teamId);
        team.value = teamData.value;
      } catch (err) {
        console.error('Error loading team:', err);
      }
    }
  } catch (err) {
    console.error('Error loading player:', err);
    $q.notify({
      type: 'negative',
      message: 'Failed to load player'
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.player-card {
  width: 100%;
  max-width: 300px;
}

.player-photo {
  background-color: #f5f5f5;
}

.player-detail {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
