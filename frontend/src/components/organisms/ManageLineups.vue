<template>
  <div class="manage-lineups">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <LineupCard
          :team="homeTeamClone"
          :lineup="homeLineup"
          :loading="loading"
          :editable="true"
          @update:lineup="updateHomeLineup"
          @save="saveHomeLineup"
          @add-player-click="showAddPlayerDialog('home')"
          @update:team="updateHomeTeam"
        />
      </div>
      <div class="col-12 col-md-6">
        <LineupCard
          :team="awayTeamClone"
          :lineup="awayLineup"
          :loading="loading"
          :editable="true"
          @update:lineup="updateAwayLineup"
          @save="saveAwayLineup"
          @add-player-click="showAddPlayerDialog('away')"
          @update:team="updateAwayTeam"
        />
      </div>
    </div>

    <!-- Add Player Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add New Player</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="handleAddPlayer" class="q-gutter-md">
            <q-input
              v-model="newPlayer.first_name"
              label="First Name"
              :rules="[val => !!val || 'First name is required']"
            />
            <q-input
              v-model="newPlayer.last_name"
              label="Last Name"
              :rules="[val => !!val || 'Last name is required']"
            />
            <q-select
              v-model="newPlayer.position"
              :options="positionOptions"
              label="Position"
              :rules="[val => !!val || 'Position is required']"
            />
            <q-input
              v-model.number="newPlayer.number"
              type="number"
              label="Jersey Number"
              :rules="[
                val => !!val || 'Jersey number is required',
                val => val > 0 || 'Jersey number must be positive',
                val => val <= 99 || 'Jersey number must be less than 100'
              ]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add Player" type="submit" @click="handleAddPlayer" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLineupStore } from 'src/stores/lineups';
import { usePlayerStore } from 'src/stores/players';
import LineupCard from 'src/components/organisms/LineupCard.vue';
import { useQuasar } from 'quasar';
import { playerService } from 'src/services/playerService';
import { lineupService } from 'src/services/lineupService';
import { matchService } from 'src/services/matchService';
import type { Match, Lineup, Team } from 'src/gql/__generated__/graphql';
import { Formation, Position } from 'src/gql/__generated__/graphql';
import { deepCopy } from '../../utils/deepCopy';
const props = defineProps<{
  match: Match
}>();

const homeTeamClone = deepCopy(props.match.homeTeam);
const awayTeamClone = deepCopy(props.match.awayTeam);

const lineupStore = useLineupStore();
const playerStore = usePlayerStore();
const q = useQuasar();

const loading = ref(false);
const showDialog = ref(false);
const selectedTeam = ref<'home' | 'away'>('home');

const defaultFormation = Formation.Formation442;

const homeLineup = ref<Lineup>({
  id: undefined,
  teamId: props.match.homeTeam.id,
  matchId: props.match.id,
  formation: defaultFormation,
  players: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isStarting: true
});

const awayLineup = ref<Lineup>({
  id: undefined,
  teamId: props.match.awayTeam.id,
  matchId: props.match.id,
  formation: defaultFormation,
  players: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isStarting: true
});

const positionOptions = [
  { label: 'Goalkeeper', value: Position.Goalkeeper },
  { label: 'Defender', value: Position.Defender },
  { label: 'Midfielder', value: Position.Midfielder },
  { label: 'Forward', value: Position.Forward }
];

const newPlayer = ref({
  first_name: '',
  last_name: '',
  position: Position.Midfielder,
  number: null as number | null,
});

const showAddPlayerDialog = (team: 'home' | 'away') => {
  selectedTeam.value = team;
  showDialog.value = true;
};

const emit = defineEmits(['update:match']);

const updateHomeLineup = (lineup: Lineup) => {
  emit('update:match', { ...props.match, homeTeamLineup: lineup });
  homeLineup.value = lineup;
};

const updateAwayLineup = (lineup: Lineup) => {
  emit('update:match', { ...props.match, awayTeamLineup: lineup });
  awayLineup.value = lineup;
};

const updateHomeTeam = (updatedTeam: Team) => {
  emit('update:match', { ...props.match, homeTeam: updatedTeam });
};

const updateAwayTeam = (updatedTeam: Team) => {
  emit('update:match', { ...props.match, awayTeam: updatedTeam });
};

const validateLineupBeforeSave = (lineup: Lineup): boolean => {
  if (!lineup.teamId) {
    console.error('Invalid lineup: missing teamId');
    return false;
  }
  if (!lineup.formation) {
    console.error('Invalid lineup: missing formation');
    return false;
  }
  if (!Array.isArray(lineup.players)) {
    console.error('Invalid lineup: players must be an array');
    return false;
  }
  if (lineup.players.length === 0) {
    console.error('Invalid lineup: no players in the lineup');
    return false;
  }
  return true;
};

const saveHomeLineup = async () => {
  loading.value = true;
  try {
    if (!validateLineupBeforeSave(homeLineup.value)) {
      throw new Error('Invalid lineup data');
    }

    const lineupToSave = {
      ...homeLineup.value,
      teamId: props.match.homeTeam.id,
    };

    const { saveLineup } = lineupService.useSaveLineup();
    const savedLineup = await saveLineup(lineupToSave);

    // Update the match with the new lineup ID
    const { updateMatch } = matchService.useUpdateMatch();
    const updatedMatch = await updateMatch({
      ...props.match,
      homeTeamLineupId: savedLineup.id
    });

    lineupStore.setLineup(savedLineup);
    homeLineup.value = savedLineup;
    emit('update:match', updatedMatch);

    q.notify({
      type: 'positive',
      message: 'Home team lineup saved successfully'
    });
  } catch (error) {
    console.error('Failed to save home team lineup:', error);
    q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'Failed to save home team lineup'
    });
  }
  loading.value = false;
};

const saveAwayLineup = async () => {
  loading.value = true;
  try {
    if (!validateLineupBeforeSave(awayLineup.value)) {
      throw new Error('Invalid lineup data');
    }

    const lineupToSave = {
      ...awayLineup.value,
      teamId: props.match.awayTeam.id,
    };

    const { saveLineup } = lineupService.useSaveLineup();
    const savedLineup = await saveLineup(lineupToSave);

    // Update the match with the new lineup ID
    const { updateMatch } = matchService.useUpdateMatch();
    const updatedMatch = await updateMatch({
      ...props.match,
      awayTeamLineupId: savedLineup.id
    });

    lineupStore.setLineup(savedLineup);
    awayLineup.value = savedLineup;
    emit('update:match', updatedMatch);

    q.notify({
      type: 'positive',
      message: 'Away team lineup saved successfully'
    });
  } catch (error) {
    console.error('Failed to save away team lineup:', error);
    q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'Failed to save away team lineup'
    });
  }
  loading.value = false;
};

const handleAddPlayer = async () => {
  if (!newPlayer.value.first_name || !newPlayer.value.last_name || !newPlayer.value.position || !newPlayer.value.number) {
    q.notify({
      type: 'warning',
      message: 'Please fill in all fields'
    });
    return;
  }

  try {
    const teamId = selectedTeam.value === 'home' ? props.match.homeTeamId : props.match.awayTeamId;
    const { createPlayer } = playerService.useCreatePlayer();
    await createPlayer({
      firstName: newPlayer.value.first_name,
      lastName: newPlayer.value.last_name,
      position: newPlayer.value.position,
      teamId: teamId
    });

    // Refresh the player list
    await playerStore.getPlayersByteam_id(teamId);

    q.notify({
      type: 'positive',
      message: 'Player added successfully'
    });

    // Reset form and close dialog
    newPlayer.value = {
      first_name: '',
      last_name: '',
      position: Position.Midfielder,
      number: null
    };
    showDialog.value = false;
  } catch {
    q.notify({
      type: 'negative',
      message: 'Failed to add player'
    });
  }
};

// Initialize lineups
onMounted(async () => {
  try {
    // Fetch players for both teams if they don't have players
    if (props.match.homeTeam && (!props.match.homeTeam.players || props.match.homeTeam.players.length === 0)) {
      try {
        const homePlayers = await playerStore.fetchPlayersByTeam(props.match.homeTeam.id);
        if (homePlayers) {
          console.log('Home team players fetched:', homePlayers);
          // Update the store's data instead of mutating props
          playerStore.playersByTeam[props.match.homeTeam.id] = homePlayers;
        }
      } catch (error) {
        console.error('Failed to fetch home team players:', error);
      }
    }

    if (props.match.awayTeam && (!props.match.awayTeam.players || props.match.awayTeam.players.length === 0)) {
      try {
        const awayPlayers = await playerStore.fetchPlayersByTeam(props.match.awayTeam.id);
        if (awayPlayers) {
          console.log('Away team players fetched:', awayPlayers);
          // Update the store's data instead of mutating props
          playerStore.playersByTeam[props.match.awayTeam.id] = awayPlayers;
        }
      } catch (error) {
        console.error('Failed to fetch away team players:', error);
      }
    }

    if (props.match.homeTeamLineup) {
      homeLineup.value = props.match.homeTeamLineup;
    }

    if (props.match.awayTeamLineup) {
      awayLineup.value = props.match.awayTeamLineup;
    }
  } catch (error) {
    console.error('Failed to initialize lineups:', error);
  }
});
</script>
