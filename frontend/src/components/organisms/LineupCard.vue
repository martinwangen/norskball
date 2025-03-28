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
      <q-card-section :class="[!isEditing ? 'bg-primary' : 'bg-negative']" class="text-white">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h6">{{ team.name }}</div>
            <div class="text-subtitle2">Formation: {{ selectedFormation }}</div>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              v-if="!isEditing && isAuthorized"
              color="white"
              text-color="primary"
              icon="edit"
              label="Edit Lineup"
              @click="startEditing"
            />
            <q-btn
              v-if="!isEditing && isAuthorized && !isRating"
              color="white"
              text-color="primary"
              icon="star"
              label="Rate Players"
              @click="startRating"
            />
            <q-btn
              v-if="isRating"
              color="white"
              text-color="primary"
              icon="close"
              label="Close Rating"
              @click="stopRating"
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
                  <div class="col">
                    <q-item-label>{{ getPlayerName(position.player) }}</q-item-label>
                    <q-item-label caption>{{ position.role }}</q-item-label>
                  </div>
                  <div class="row items-center">
                    <q-rating
                      v-if="position.player"
                      :model-value="getMatchPlayerRating(position.player)"
                      size="1.5em"
                      :max="10"
                      icon="star_border"
                      icon-selected="star"
                      :disable="!isRating || ratingLoading"
                      @update:model-value="(val) => {
                        if (position.player) {
                          console.log('Rating updated for player:', position.player.id, 'value:', val);
                          updatePlayerRating(position.player.id, val);
                        }
                      }"
                    />
                    <q-btn
                      v-if="isRating && position.player && getMatchPlayerRating(position.player) > 0"
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
            <q-item v-for="(sub, index) in substitutes" :key="sub.player?.id || index">
              <q-item-section avatar>
                <q-avatar :color="sub.player ? 'grey-6' : 'grey'" text-color="white">
                  {{ sub.number }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-select
                  v-model="sub.player"
                  :options="getAvailablePlayersByPosition(Position.Undefined)"
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
            <q-item v-for="(sub, index) in substitutes" :key="sub.player?.id || index">
              <q-item-section avatar>
                <q-avatar color="grey-4" text-color="grey-8">
                  {{ sub.number }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="row items-center justify-between">
                  <div class="col">
                    <q-item-label>{{ getPlayerName(sub.player) }}</q-item-label>
                    <q-item-label caption>{{ sub.player?.player?.position }}</q-item-label>
                  </div>
                  <div class="row items-center">
                    <q-rating
                      v-if="sub.player"
                      :model-value="getMatchPlayerRating(sub.player)"
                      size="1.5em"
                      :max="10"
                      icon="star_border"
                      icon-selected="star"
                      :disable="!isRating || ratingLoading"
                      @update:model-value="(val) => {
                        if (sub.player) {
                          console.log('Rating updated for substitute:', sub.player.id, 'value:', val);
                          updatePlayerRating(sub.player.id, val);
                        }
                      }"
                    />
                    <q-btn
                      v-if="isRating && sub.player && getMatchPlayerRating(sub.player) > 0"
                      flat
                      round
                      dense
                      color="negative"
                      icon="close"
                      size="sm"
                      class="q-ml-sm"
                      @click="removePlayerRating(sub.player.id)"
                    />
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </template>
          <q-item v-if="substitutes.length === 0">
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
              :loading="saveLoading"
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
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { lineupService } from '../../services/lineupService';

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

type PlayerName = {
  firstName: string;
  lastName: string;
};

const props = defineProps<{
  matchId: string;
  team: Team;
  loading?: boolean;
  lineup?: Lineup;
}>();


const playerStore = usePlayerStore();
const authStore = useAuthStore();
const isAuthorized = computed(() => authStore.isAdmin);

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

const $q = useQuasar();
const saveLoading = ref(false);
const ratingLoading = ref(false);
const isRating = ref(false);

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
      // For custom formation, we'll set all non-goalkeeper positions to undefined
      defenders = 0; midfielders = 0; forwards = 0;
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

  // For custom formation, set all remaining positions to undefined
  if (formationValue === Formation.FormationCustom) {
    while (currentIndex < startingPositions.value.length) {
      startingPositions.value[currentIndex].role = Position.Undefined;
      currentIndex++;
    }
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
  if (newPlayers && newPlayers.length > 0 && props.lineup) {
    void loadPlayers();
  }
}, { immediate: true });

// Initialize on mount
onMounted(async () => {
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
    matchId: props.matchId,
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
          ratings: p.player.ratings,
          averageRating: p.player.averageRating
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
          ratings: p.player.ratings,
          averageRating: p.player.averageRating
        })),
    ],
    createdAt: props.lineup?.createdAt || new Date().toISOString(),
    updatedAt: props.lineup?.updatedAt || new Date().toISOString(),
    isStarting: props.lineup?.isStarting || true,
  };
};

const getAvailablePlayersByPosition = (position: Position) => {
  const teamPlayers = playerStore.playersByTeam[props.team.id] || [];

  // Create a set of all selected player IDs (both starters and substitutes)
  const selectedIds = new Set([
    ...startingPositions.value
      .filter(p => p.player)
      .map(p => p.player.playerId),
    ...substitutes.value
      .filter(p => p.player)
      .map(p => p.player.playerId)
  ]);

  //if position is undefined, dont filter by position
  if (position === Position.Undefined) {
    return teamPlayers
      .filter(player => !selectedIds.has(player.id))
      .map(player => ({
        id: '',
        playerId: player.id,
        lineupId: props.lineup?.id || '',
        isStarter: true,
        position: position.toString(),
        teamId: props.team.id,
        player: player
      }));
  }
  return teamPlayers
    .filter(player => position === player.position)
    .filter(player => !selectedIds.has(player.id))
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
  if (player && !validatePlayerSelection(player.playerId, index + 1)) {
    return;
  }
  startingPositions.value[index].player = player;
};

const updateSubstitute = (index: number, player: MatchPlayer | null) => {
  if (validation.value.substitute_count >= 8 && !substitutes.value[index].player) return;

  if (player && !validatePlayerSelection(player.playerId, 12 + index)) {
    return;
  }
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
const handleSave = async () => {
  if (!validateFormation.value.isValid) {
    $q.notify({
      color: 'negative',
      message: `Invalid formation. Expected: ${validateFormation.value.expected.defenders}-${validateFormation.value.expected.midfielders}-${validateFormation.value.expected.forwards}`
    });
    return;
  }

  try {
    saveLoading.value = true;
    const lineup = createLineup();

    // Save the lineup using the lineup service
    const savedLineup = await lineupService.useSaveLineup().saveLineup(lineup);

    if (savedLineup) {
      // Update the positions with the new match player IDs
      startingPositions.value.forEach(pos => {
        if (pos.player) {
          const savedPlayer = savedLineup.players.find(p =>
            p.playerId === pos.player?.playerId
          );
          if (savedPlayer) {
            pos.player = {
              ...pos.player,
              id: savedPlayer.id,
              lineupId: savedPlayer.lineupId,
              player: pos.player.player // Preserve the original player data
            };
          }
        }
      });

      // Update substitutes
      substitutes.value.forEach(sub => {
        if (sub.player) {
          const savedPlayer = savedLineup.players.find(p =>
            p.playerId === sub.player?.playerId
          );
          if (savedPlayer) {
            sub.player = {
              ...sub.player,
              id: savedPlayer.id,
              lineupId: savedPlayer.lineupId,
              player: sub.player.player // Preserve the original player data
            };
          }
        }
      });
    }

    isEditing.value = false;
  } finally {
    saveLoading.value = false;
  }
};

// Helper functions
const isPlayerName = (player: MatchPlayer | PlayerName): player is PlayerName => {
  return 'firstName' in player && 'lastName' in player && !('player' in player);
};

const getPlayerName = (player: MatchPlayer | null | PlayerName) => {
  if (!player) return '';
  if ('player' in player) {
    return `${player.player.firstName} ${player.player.lastName}`;
  }
  if (isPlayerName(player)) {
    return `${player.firstName} ${player.lastName}`;
  }
  return '';
};

const startRating = async () => {
  // Get all starting players
  const startingPlayers = startingPositions.value.map(pos => pos.player).filter(p => p !== null);
  console.log('Starting players:', startingPlayers);

  // Set default rating of 5 for players without ratings
  for (const player of startingPlayers) {
    if (!player.ratings || player.ratings.length === 0) {
      try {
        const result = await ratingService.useAddSimpleRating().addSimpleRating(player.id, 5);
        if (result?.matchPlayer?.ratings) {
          // Update the player's ratings in the starting positions by creating a new object
          const position = startingPositions.value.find(p => p.player?.id === player.id);
          if (position?.player) {
            position.player = {
              ...position.player,
              ratings: result.matchPlayer.ratings,
              averageRating: result.matchPlayer.averageRating
            };
          }
        }
      } catch (error) {
        console.error('Error setting default rating for player:', error);
      }
    }
  }
  isRating.value = true;
};

const stopRating = () => {
  isRating.value = false;
};

const updatePlayerRating = async (playerId: string, rating: number) => {
  try {
    // Validate rating range
    if (rating < 1 || rating > 10) {
      $q.notify({
        color: 'negative',
        message: 'Rating must be between 1 and 10'
      });
      return;
    }

    ratingLoading.value = true;
    const result = await ratingService.useAddSimpleRating().addSimpleRating(playerId, rating);

    if (result?.matchPlayer?.ratings) {
      // Update the player's ratings in both starting positions and substitutes
      const startingPosition = startingPositions.value.find(p => p.player?.id === playerId);
      if (startingPosition?.player) {
        startingPosition.player = {
          ...result.matchPlayer,
          player: startingPosition.player.player // Preserve the original player data
        };
      }

      const substitute = substitutes.value.find(s => s.player?.id === playerId);
      if (substitute?.player) {
        substitute.player = {
          ...result.matchPlayer,
          player: substitute.player.player // Preserve the original player data
        };
      }
    }

    $q.notify({
      color: 'positive',
      message: 'Rating updated successfully'
    });
  } catch (error) {
    console.error('Error updating player rating:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to update rating'
    });
  } finally {
    ratingLoading.value = false;
  }
};

const getMatchPlayerRating = (player: MatchPlayer | null): number => {
  if (!player?.ratings?.length) return 0;
  // Just use the last rating in the array (most recent)
  return player.ratings[player.ratings.length - 1].score;
};

const removePlayerRating = async (playerId: string) => {
  try {
    ratingLoading.value = true;
    await ratingService.removePlayerRating(playerId);
    $q.notify({
      color: 'positive',
      message: 'Rating removed successfully'
    });
  } catch (error) {
    console.error('Error removing player rating:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to remove rating'
    });
  } finally {
    ratingLoading.value = false;
  }
};

// Add validation for player selection
const validatePlayerSelection = (playerId: string, currentPosition: number): boolean => {
  // Check if player is already selected in another position
  const isSelectedInStarting = startingPositions.value.some(
    pos => pos.player?.playerId === playerId && pos.number !== currentPosition
  );

  const isSelectedInSubstitutes = substitutes.value.some(
    sub => sub.player?.playerId === playerId && sub.number !== currentPosition
  );

  if (isSelectedInStarting || isSelectedInSubstitutes) {
    $q.notify({
      color: 'negative',
      message: 'Player is already selected in another position'
    });
    return false;
  }
  return true;
};

// Add formation validation
const validateFormation = computed(() => {
  const formationValue = selectedFormation.value;

  // For custom formation, always return valid
  if (formationValue === Formation.FormationCustom) {
    return {
      isValid: true,
      expected: { defenders: 0, midfielders: 0, forwards: 0 },
      current: {
        defenders: startingPositions.value.filter(p => p.role === Position.Defender).length,
        midfielders: startingPositions.value.filter(p => p.role === Position.Midfielder).length,
        forwards: startingPositions.value.filter(p => p.role === Position.Forward).length
      }
    };
  }

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

  const currentDefenders = startingPositions.value.filter(p => p.role === Position.Defender).length;
  const currentMidfielders = startingPositions.value.filter(p => p.role === Position.Midfielder).length;
  const currentForwards = startingPositions.value.filter(p => p.role === Position.Forward).length;

  return {
    isValid: currentDefenders === defenders &&
             currentMidfielders === midfielders &&
             currentForwards === forwards,
    expected: { defenders, midfielders, forwards },
    current: { defenders: currentDefenders, midfielders: currentMidfielders, forwards: currentForwards }
  };
});
</script>

<style scoped>

.lineup {
  width: 100%;
}
</style>
