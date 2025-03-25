<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">Player Ratings</div>

    <div class="row q-col-gutter-md">
      <!-- Home Team Ratings -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 q-mb-md">Home Team</div>
            <div class="ratings-container">
              <div v-for="player in homeTeamPlayers" :key="player.id" class="rating-item">
                <div class="player-info">
                  <div class="player-name">{{ player.player.firstName }} {{ player.player.lastName }}</div>
                  <div class="player-position">{{ player.player.position }}</div>
                </div>
                <div class="rating-value">
                  <q-rating
                    v-model="player.rating"
                    size="1.5em"
                    :max="5"
                    color="amber"
                    icon="star_border"
                    icon-selected="star"
                    @update:model-value="updateRating(player.id)"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Away Team Ratings -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 q-mb-md">Away Team</div>
            <div class="ratings-container">
              <div v-for="player in awayTeamPlayers" :key="player.id" class="rating-item">
                <div class="player-info">
                  <div class="player-name">{{ player.player.firstName }} {{ player.player.lastName }}</div>
                  <div class="player-position">{{ player.player.position }}</div>
                </div>
                <div class="rating-value">
                  <q-rating
                    v-model="player.rating"
                    size="1.5em"
                    :max="5"
                    color="amber"
                    icon="star_border"
                    icon-selected="star"
                    @update:model-value="updateRating(player.id)"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MatchPlayerInput } from 'src/gql/__generated__/graphql';
import { Position } from 'src/gql/__generated__/graphql';
import { matchService } from 'src/services/matchService';

const props = defineProps<{
  matchPlayers: Array<{
    id: string;
    player: {
      id: string;
      position: Position;
      firstName: string;
      lastName: string;
    };
    lineupId: string;
    teamId: string;
    rating: number;
  }>;
  match: {
    value: {
      id: string;
      homeTeamId: string;
      awayTeamId: string;
    };
  };
}>();

const { updatePlayerRating } = matchService.useUpdatePlayerRating();

const homeTeamPlayers = computed(() =>
  props.matchPlayers.filter(p => p.teamId === props.match.value?.homeTeamId)
);

const awayTeamPlayers = computed(() =>
  props.matchPlayers.filter(p => p.teamId === props.match.value?.awayTeamId)
);

const updateRating = async (playerId: string) => {
  try {
    const matchPlayer = props.matchPlayers.find(p => p.id === playerId);
    if (!matchPlayer || !props.match.value) return;

    const playerInput: MatchPlayerInput = {
      id: playerId,
      playerId: playerId,
      position: matchPlayer.player.position || Position.Forward,
      isStarter: true,
      lineupId: matchPlayer.lineupId,
      teamId: matchPlayer.teamId,
      substitutedInAt: null,
      substitutedOutAt: null
    };

    await updatePlayerRating(playerInput);
  } catch (error) {
    console.error('Error updating rating:', error);
  }
};
</script>

<style scoped>
.ratings-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: 500;
}

.player-position {
  color: #666;
  font-size: 0.9em;
}

.rating-value {
  margin-left: 16px;
}
</style>
