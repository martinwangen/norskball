<template>
  <div class="lineup">
    <!-- Debug Info -->
    <div v-if="isEditing" class="text-caption q-mb-sm">
      Lineup ID: {{ lineup?.id || 'None' }}
      Players: {{ lineup?.players?.length || 0 }}
    </div>

    <!-- Formation Selector (Edit Mode Only) -->
    <div v-if="isEditing" class="row q-col-gutter-md">
      <div class="col-12">
        <q-select
          v-model="selectedFormation"
          :options="formationOptions"
          label="Formation"
          outlined
          dense
          emit-value
          map-options
          class="q-mb-md"
        />
      </div>
    </div>

    <!-- Team Info -->
    <q-card v-if="team">
      <q-card-section :class="[isEditing ? 'bg-primary' : 'bg-negative']" class="text-white">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h6">{{ team.name }}</div>
            <div class="text-subtitle2">Formation: {{ selectedFormation }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              v-if="!isEditing"
              color="white"
              text-color="primary"
              icon="edit"
              label="Edit Lineup"
              @click="startEditing"
            />
            <q-btn
              v-if="!isEditing && !ratingService.isRating.value"
              color="white"
              text-color="primary"
              icon="star"
              label="Rate Players"
              @click="startRating"
            />
            <q-btn
              v-if="ratingService.isRating.value"
              color="white"
              text-color="primary"
              icon="close"
              label="Close Rating"
              @click="stopRating"
            />
            <q-btn
              v-if="ratingService.isRating.value"
              color="white"
              text-color="primary"
              icon="save"
              label="Save Ratings"
              @click="saveRatings"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Starting XI -->
        <div class="text-subtitle2 q-mb-sm">Starting XI ({{ validation.starting_count }}/11)</div>
        <q-list bordered separator>
          <q-item v-for="(position, index) in startingPositions" :key="index">
            <q-item-section avatar>
              <q-avatar :color="position.player ? 'primary' : 'grey'" text-color="white">
                {{ position.number }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <template v-if="isEditing">
                <q-select
                  v-model="position.player"
                  :options="getAvailablePlayersByPosition(position.role)"
                  :option-label="(opt) => getPlayerName(opt)"
                  :label="position.role + ' - Select Player'"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Player is required']"
                  @update:model-value="updatePlayer(index, $event)"
                >
                  <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" @click="toggleOption(opt)">
                      <q-item-section>
                        <q-item-label>{{ getPlayerName(opt) }}</q-item-label>
                        <q-item-label caption>{{ opt.position }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox dense :model-value="selected" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </template>
              <template v-else>
                <div class="row items-center justify-between">
                  <div>
                    <q-item-label>{{ getPlayerName(position.player) }}</q-item-label>
                    <q-item-label caption>{{ position.role }}</q-item-label>
                  </div>
                  <div class="row items-center">
                    <q-rating
                      v-if="ratingService.isRating.value && position.player"
                      :model-value="getMatchPlayerRating(position.player.id)"
                      size="1.5em"
                      :max="10"
                      :color="getRatingColor(getMatchPlayerRating(position.player.id))"
                      icon="star_border"
                      icon-selected="star"
                      @update:model-value="(val) => {
                        console.log('Rating updated for player:', position.player.id, 'value:', val);
                        updatePlayerRating(position.player.id, val);
                      }"
                    />
                    <q-btn
                      v-if="ratingService.isRating.value && position.player && getMatchPlayerRating(position.player.id) > 0"
                      flat
                      round
                      dense
                      color="negative"
                      icon="close"
                      size="sm"
                      class="q-ml-sm"
                      @click="removePlayerRating(position.player.id)"
                    />
                  </div>
                </div>
              </template>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Substitutes -->
        <div class="text-subtitle2 q-mt-md q-mb-sm">Substitutes ({{ validation.substitute_count }}/8)</div>
        <q-list bordered separator>
          <template v-if="isEditing">
            <q-item v-for="(sub, index) in substitutes" :key="index">
              <q-item-section avatar>
                <q-avatar :color="sub.player ? 'grey-6' : 'grey'" text-color="white">
                  {{ sub.number }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="sub.player"
                  :options="availableSubstitutes"
                  :option-label="(opt) => getPlayerName(opt)"
                  label="Select Substitute"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                  :disable="validation.substitute_count >= 8 && !sub.player"
                  @update:model-value="updateSubstitute(index, $event)"
                >
                  <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" @click="toggleOption(opt)">
                      <q-item-section>
                        <q-item-label>{{ getPlayerName(opt) }}</q-item-label>
                        <q-item-label caption>{{ opt.position }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox dense :model-value="selected" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item v-for="sub in substitutePlayers" :key="sub.player_id">
              <q-item-section avatar>
                <q-avatar color="grey-4" text-color="grey-8">
                  {{ sub.shirt_number }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row items-center justify-between">
                  <div>
                    <q-item-label>{{ sub.name }}</q-item-label>
                    <q-item-label caption>{{ sub.position }}</q-item-label>
                  </div>
                  <div class="row items-center">
                    <q-rating
                      v-if="ratingService.isRating.value"
                      :model-value="getMatchPlayerRating(sub.player_id)"
                      size="1.5em"
                      :max="10"
                      :color="getRatingColor(getMatchPlayerRating(sub.player_id))"
                      icon="star_border"
                      icon-selected="star"
                      @update:model-value="(val) => {
                        console.log('Rating updated for substitute:', sub.player_id, 'value:', val);
                        updatePlayerRating(sub.player_id, val);
                      }"
                    />
                    <q-btn
                      v-if="ratingService.isRating.value && getMatchPlayerRating(sub.player_id) > 0"
                      flat
                      round
                      dense
                      color="negative"
                      icon="close"
                      size="sm"
                      class="q-ml-sm"
                      @click="removePlayerRating(sub.player_id)"
                    />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </template>
          <q-item v-if="substitutePlayers.length === 0">
            <q-item-section>
              <q-item-label class="text-grey-7">No substitutes</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Validation Message (Edit Mode Only) -->
        <q-banner
          v-if="isEditing"
          :class="validation.is_valid ? 'bg-positive' : 'bg-warning'"
          class="text-white q-mt-md"
        >
          {{ validation.message }}
        </q-banner>

        <!-- Action Buttons (Edit Mode Only) -->
        <div v-if="isEditing" class="row q-col-gutter-md q-mt-md">
          <div class="col-6">
            <q-btn
              color="primary"
              icon="add"
              label="Add New Player"
              class="full-width"
              @click="$emit('add-player-click')"
            />
          </div>
          <div class="col-6">
            <q-btn
              color="secondary"
              icon="auto_fix_high"
              label="Auto-fill Lineup"
              class="full-width"
              @click="autoFillLineup"
            />
          </div>
          <div class="col-12">
            <q-btn
              color="positive"
              icon="save"
              label="Save Lineup"
              :disable="!validation.is_valid"
              :loading="loading"
              @click="handleSave"
              class="full-width"
            />
          </div>
          <div class="col-12">
            <q-btn
              color="negative"
              icon="cancel"
              label="Cancel"
              @click="cancelEditing"
              class="full-width"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Formation, Position } from 'src/gql/__generated__/graphql';
import type { Lineup, Team, MatchPlayer } from 'src/gql/__generated__/graphql';
import { usePlayerStore } from 'src/stores/players';
import { ratingService } from '../../services/ratingService';

// Define our own types for lineup functionality
type LineupPosition = {
  number: number;
  role: Position;
  player: MatchPlayer | null;
};
type LineupSubstitute = {
  number: number;
  player: MatchPlayer | null;
};
type LineupValidation = {
  is_valid: boolean;
  starting_count: number;
  substitute_count: number;
  message: string;
};

const props = defineProps<{
  team: Team;
  loading?: boolean;
  lineup?: Lineup;
}>();

const emit = defineEmits<{
  (e: 'update:lineup', lineup: Lineup): void;
  (e: 'save'): void;
  (e: 'add-player-click'): void;
  (e: 'update:team', team: Team): void;
}>();

const playerStore = usePlayerStore();
const teamPlayers = playerStore.playersByTeam[props.team.id] || [];

const formationOptions = [
  { label: 'Custom', value: Formation.FormationCustom },
  { label: '4-4-2', value: Formation.Formation442 },
  { label: '4-3-3', value: Formation.Formation433 },
  { label: '3-5-2', value: Formation.Formation352 },
  { label: '3-4-3', value: Formation.Formation343 },
  { label: '4-2-3-1', value: Formation.Formation4231 },
  { label: '4-3-2-1', value: Formation.Formation4321 },
  { label: '5-3-2', value: Formation.Formation532 },
  { label: '5-4-1', value: Formation.Formation541 },
  { label: '4-5-1', value: Formation.Formation451 },
  { label: '5-2-3', value: Formation.Formation523 },
  { label: '4-1-4-1', value: Formation.Formation4141 },
  { label: '3-1-4-2', value: Formation.Formation3142 },
];

const selectedFormation = ref<Formation>(Formation.Formation442);
if (props.lineup?.formation) {
  selectedFormation.value = props.lineup.formation;
}

const startingPositions = ref<LineupPosition[]>([]);
const substitutes = ref<LineupSubstitute[]>([]);

// Add internal editing state
const isEditing = ref(false);

// Store original lineup for cancel
const originalLineup = ref<Lineup | null>(null);
const originalFormation = ref<Formation>(Formation.Formation442);

// Start editing
const startEditing = () => {
  // Store original state
  originalLineup.value = props.lineup ? { ...props.lineup } : null;
  originalFormation.value = selectedFormation.value;
  isEditing.value = true;
};

// Cancel editing
const cancelEditing = () => {
  // Restore original state
  if (originalLineup.value) {
    selectedFormation.value = originalFormation.value;
    void loadPlayers();
  }
  isEditing.value = false;
};

// Load players from lineup
const loadPlayers = () => {
  if (!props.lineup) return;

  // Reset positions
  startingPositions.value.forEach(pos => pos.player = null);
  substitutes.value.forEach(sub => sub.player = null);

  // Load starting players
  for (const matchPlayer of props.lineup.players) {
    if (!matchPlayer.player) {
      console.warn('Skipping match player with no player data:', matchPlayer);
      continue;
    }

    const positionNumber = parseInt(matchPlayer.position);
    if (isNaN(positionNumber)) {
      console.warn('Invalid position number:', matchPlayer.position);
      continue;
    }

    if (positionNumber <= 11) {
      // Find the position by number
      const position = startingPositions.value.find(p => p.number === positionNumber);
      if (position) {
        position.player = matchPlayer;
      } else {
        console.warn(`Could not find position ${positionNumber} in starting positions. Available positions:`, startingPositions.value.map(p => p.number));
      }
    } else {
      // Handle substitutes (positions 12-18)
      const substitute = substitutes.value.find(s => s.number === positionNumber);
      if (substitute) {
        substitute.player = matchPlayer;
      } else {
        console.warn(`Could not find substitute position ${positionNumber}. Available substitute positions:`, substitutes.value.map(s => s.number));
      }
    }
  }
};

// Initialize positions based on formation
const initializePositions = () => {
  // Always create 11 positions
  startingPositions.value = Array.from({ length: 11 }, (_, i) => ({
    number: i + 1,
    role: Position.Goalkeeper, // Default role, will be updated based on formation
    player: null,
  }));

  // Get formation numbers from the enum value
  const formationValue = selectedFormation.value;
  let defenders = 4, midfielders = 4, forwards = 2; // Default 4-4-2

  // Map formation enum to numbers
  switch (formationValue) {
    case Formation.FormationCustom:
      // Custom formation means all players are available for selection in the starting positions
      break;
    case Formation.Formation442:
      defenders = 4; midfielders = 4; forwards = 2;
      break;
    case Formation.Formation433:
      defenders = 4; midfielders = 3; forwards = 3;
      break;
    case Formation.Formation352:
      defenders = 3; midfielders = 5; forwards = 2;
      break;
    case Formation.Formation343:
      defenders = 3; midfielders = 4; forwards = 3;
      break;
    case Formation.Formation4231:
      defenders = 4; midfielders = 2; forwards = 3;
      break;
    case Formation.Formation4321:
      defenders = 4; midfielders = 3; forwards = 2;
      break;
    case Formation.Formation532:
      defenders = 5; midfielders = 3; forwards = 2;
      break;
    case Formation.Formation541:
      defenders = 5; midfielders = 4; forwards = 1;
      break;
    case Formation.Formation451:
      defenders = 4; midfielders = 5; forwards = 1;
      break;
    case Formation.Formation523:
      defenders = 5; midfielders = 2; forwards = 3;
      break;
    case Formation.Formation4141:
      defenders = 4; midfielders = 1; forwards = 4;
      break;
    case Formation.Formation3142:
      defenders = 3; midfielders = 1; forwards = 4;
      break;
  }

  // Update roles based on formation
  let currentIndex = 1; // Start from 1 since 0 is goalkeeper
  // Set defenders
  for (let i = 0; i < defenders; i++) {
    startingPositions.value[currentIndex].role = Position.Defender;
    currentIndex++;
  }
  // Set midfielders
  for (let i = 0; i < midfielders; i++) {
    startingPositions.value[currentIndex].role = Position.Midfielder;
    currentIndex++;
  }
  // Set forwards
  for (let i = 0; i < forwards; i++) {
    startingPositions.value[currentIndex].role = Position.Forward;
    currentIndex++;
  }

  // Initialize substitutes (always 7)
  substitutes.value = Array.from({ length: 7 }, (_, i) => ({
    number: 12 + i, // Start from 12 since 1-11 are starting positions
    player: null,
  }));
};

// Watch for formation changes
watch(selectedFormation, () => {
  initializePositions();
});

// Watch for lineup changes
watch(() => props.lineup, (newLineup) => {
  console.log('Lineup changed:', newLineup);
  if (newLineup) {
    selectedFormation.value = newLineup.formation;
    initializePositions(); // Initialize positions first
    // Only load players if we have team players
    if (playerStore.playersByTeam[props.team.id]?.length > 0) {
      void loadPlayers();
    }
  }
}, { immediate: true });

// Watch for team players changes
watch(() => playerStore.playersByTeam[props.team.id], (newPlayers) => {
  console.log('Team players changed:', newPlayers);
  if (newPlayers && newPlayers.length > 0 && props.lineup) {
    void loadPlayers();
  }
}, { immediate: true });

// Initialize on mount
onMounted(async () => {
  console.log('LineupCard mounted with lineup:', props.lineup);
  initializePositions();

  // Fetch team players if not already loaded
  if (props.team && (!playerStore.playersByTeam[props.team.id] || playerStore.playersByTeam[props.team.id].length === 0)) {
    try {
      await playerStore.fetchPlayersByTeam(props.team.id);
      // After fetching players, load the lineup if it exists
      if (props.lineup) {
        void loadPlayers();
      }
    } catch (error) {
      console.error('Failed to fetch team players:', error);
    }
  }
});

// Create lineup object
const createLineup = (): Lineup => {
  return {
    id: props.lineup?.id || '',
    teamId: props.team.id,
    matchId: props.lineup?.matchId || '',
    formation: selectedFormation.value,
    players: [
      ...startingPositions.value
        .filter((p): p is LineupPosition & { player: MatchPlayer } => p.player !== null)
        .map(p => ({
          id: p.player.id,
          playerId: p.player.playerId,
          lineupId: props.lineup?.id || '',
          isStarter: true,
          position: p.number.toString(),
          teamId: props.team.id,
        })),
      ...substitutes.value
        .filter((p): p is LineupSubstitute & { player: MatchPlayer } => p.player !== null)
        .map(p => ({
          id: p.player.id,
          playerId: p.player.playerId,
          lineupId: props.lineup?.id || '',
          isStarter: false,
          position: p.number.toString(),
          teamId: props.team.id,
        })),
    ],
    createdAt: props.lineup?.createdAt || new Date().toISOString(),
    updatedAt: props.lineup?.updatedAt || new Date().toISOString(),
    isStarting: props.lineup?.isStarting || true,
  };
};

// Update the substitutePlayers computed property
const substitutePlayers = computed(() => {
  return substitutes.value
    .filter((sub): sub is LineupSubstitute & { player: MatchPlayer } => sub.player !== null)
    .map(sub => ({
      player_id: sub.player.playerId,
      name: `${sub.player.player?.firstName} ${sub.player.player?.lastName}`,
      shirt_number: sub.number,
      position: sub.player.player?.position
    }));
});

// Computed properties for player filtering
const availableSubstitutes = computed(() => {
  const teamPlayers = playerStore.playersByTeam[props.team.id] || [];
  const selectedIds = new Set([
    ...startingPositions.value.map(p => p.player?.playerId),
    ...substitutes.value.map(p => p.player?.playerId),
  ]);
  return teamPlayers.filter(p => !selectedIds.has(p.id));
});

const getAvailablePlayersByPosition = (position: Position) => {
  const teamPlayers = playerStore.playersByTeam[props.team.id] || [];
  const selectedIds = new Set([
    ...startingPositions.value.map(p => p.player?.playerId),
    ...substitutes.value.map(p => p.player?.playerId),
  ]);

  // Get the current player for this position
  const currentPlayer = startingPositions.value.find(p => p.role === position)?.player;

  return teamPlayers
    .filter(player => position === player.position)
    .filter(player => !selectedIds.has(player.id) || player.id === currentPlayer?.playerId)
    .map(player => ({
      id: '',
      playerId: player.id,
      lineupId: props.lineup?.id || '',
      isStarter: true,
      position: position.toString(),
      teamId: props.team.id,
      player: player
    }));
};

// Validation
const validation = computed<LineupValidation>(() => {
  const starting_count = startingPositions.value.filter(p => p.player).length;
  const substitute_count = substitutes.value.filter(p => p.player).length;

  return {
    is_valid: starting_count === 11 && substitute_count <= 8,
    starting_count,
    substitute_count,
    message: starting_count < 11
      ? `Need ${11 - starting_count} more starting players`
      : starting_count > 11
        ? 'Too many starting players'
        : substitute_count > 8
          ? 'Too many substitutes'
          : 'Valid lineup'
  };
});

// Player update handlers
const updatePlayer = (index: number, player: MatchPlayer | null) => {
  startingPositions.value[index].player = player;
};

const updateSubstitute = (index: number, player: MatchPlayer | null) => {
  if (validation.value.substitute_count >= 8 && !substitutes.value[index].player) return;
  substitutes.value[index].player = player;
};

// Auto-fill lineup
const autoFillLineup = async () => {
  console.log('Starting auto-fill with team players:', teamPlayers);

  // Ensure players are loaded
  if (!teamPlayers.length) {
    console.log('No players loaded, fetching team players...');
    try {
      await playerStore.fetchPlayersByTeam(props.team.id);
    } catch (error) {
      console.error('Failed to fetch team players:', error);
      return;
    }
  }

  // Get fresh reference to team players after potential fetch
  const availablePlayers = [...playerStore.playersByTeam[props.team.id] || []];
  console.log('Available players:', availablePlayers);

  if (!availablePlayers.length) {
    console.log('No players available for auto-fill');
    return;
  }

  // Reset current selections
  startingPositions.value.forEach(pos => pos.player = null);
  substitutes.value.forEach(sub => sub.player = null);

  // First, try to fill goalkeeper position
  const goalkeeper = availablePlayers.find(p => p.position === Position.Goalkeeper);
  if (goalkeeper) {
    console.log('Found goalkeeper:', goalkeeper);
    startingPositions.value[0].player = {
      id: '',
      playerId: goalkeeper.id,
      lineupId: props.lineup?.id || '',
      isStarter: true,
      position: '1',
      teamId: props.team.id,
      player: goalkeeper
    };
    availablePlayers.splice(availablePlayers.indexOf(goalkeeper), 1);
  }

  // Get formation numbers from the enum value
  const formationValue = selectedFormation.value;
  let defenders = 4, midfielders = 4, forwards = 2; // Default 4-4-2

  // Map formation enum to numbers
  switch (formationValue) {
    case Formation.Formation442:
      defenders = 4; midfielders = 4; forwards = 2;
      break;
    case Formation.Formation433:
      defenders = 4; midfielders = 3; forwards = 3;
      break;
    case Formation.Formation352:
      defenders = 3; midfielders = 5; forwards = 2;
      break;
    case Formation.Formation343:
      defenders = 3; midfielders = 4; forwards = 3;
      break;
    case Formation.Formation4231:
      defenders = 4; midfielders = 2; forwards = 3;
      break;
    case Formation.Formation4321:
      defenders = 4; midfielders = 3; forwards = 2;
      break;
    case Formation.Formation532:
      defenders = 5; midfielders = 3; forwards = 2;
      break;
    case Formation.Formation541:
      defenders = 5; midfielders = 4; forwards = 1;
      break;
    case Formation.Formation451:
      defenders = 4; midfielders = 5; forwards = 1;
      break;
    case Formation.Formation523:
      defenders = 5; midfielders = 2; forwards = 3;
      break;
    case Formation.Formation4141:
      defenders = 4; midfielders = 1; forwards = 4;
      break;
    case Formation.Formation3142:
      defenders = 3; midfielders = 1; forwards = 4;
      break;
  }


  // Fill starting positions by role
  let currentIndex = 1; // Start from 1 since 0 is goalkeeper

  // Helper function to find and assign a player for a position
  const assignPlayer = (position: Position, count: number) => {
    for (let i = 0; i < count && currentIndex < startingPositions.value.length; i++) {
      // First try to find a player with the exact position
      let playerIndex = availablePlayers.findIndex(p => p.position === position);

      // If no exact match, try to find any available player
      if (playerIndex === -1 && availablePlayers.length > 0) {
        playerIndex = 0;
      }

      if (playerIndex !== -1) {
        const player = availablePlayers[playerIndex];
        startingPositions.value[currentIndex].player = {
          id: '',
          playerId: player.id,
          lineupId: props.lineup?.id || '',
          isStarter: true,
          position: currentIndex.toString(),
          teamId: props.team.id,
          player: player
        };
        availablePlayers.splice(playerIndex, 1);
        currentIndex++;
      }
    }
  };

  // Assign players for each position type
  assignPlayer(Position.Defender, defenders);
  assignPlayer(Position.Midfielder, midfielders);
  assignPlayer(Position.Forward, forwards);

  // Fill substitutes with remaining players
  substitutes.value.forEach((sub, index) => {
    if (availablePlayers.length > 0) {
      const player = availablePlayers.shift();
      if (player) {
        sub.player = {
          id: '',
          playerId: player.id,
          lineupId: props.lineup?.id || '',
          isStarter: false,
          position: (12 + index).toString(),
          teamId: props.team.id,
          player: player
        };
      }
    }
  });
};

// Modify handleSave to also exit edit mode
const handleSave = () => {
  const lineup = createLineup();
  emit('update:lineup', lineup);
  emit('save');
  isEditing.value = false;
};

// Helper functions
const getPlayerName = (player: MatchPlayer | null) => {
  if (!player?.player) return '';
  return `${player.player.firstName} ${player.player.lastName}`;
};

const startRating = () => {
  ratingService.startRatingMode(props.lineup?.players || []);
};

const stopRating = () => {
  ratingService.stopRatingMode();
};

const saveRatings = async () => {
  try {
    await ratingService.saveAllRatings();
  } catch (error) {
    console.error('Error saving ratings:', error);
  }
};

const updatePlayerRating = async (playerId: string, rating: number) => {
  try {
    await ratingService.updatePlayerRating(playerId, rating);
  } catch (error) {
    console.error('Error updating player rating:', error);
  }
};

const getMatchPlayerRating = (playerId: string): number => {
  return ratingService.getPlayerRating(playerId, props.lineup?.players || []);
};

const getRatingColor = (rating: number): string => {
  return ratingService.getRatingColor(rating);
};

const removePlayerRating = async (playerId: string) => {
  try {
    await ratingService.removePlayerRating(playerId);
  } catch (error) {
    console.error('Error removing player rating:', error);
  }
};
</script>

<style scoped>

.lineup {
  width: 100%;
}
</style>
