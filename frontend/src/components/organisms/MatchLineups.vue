<template>
  <div class="match-lineups">
    <div class="text-h6 q-mb-md">Lineups</div>

    <div v-if="loading" class="flex justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="error" class="text-negative q-pa-md">
      {{ error }}
    </div>

    <div v-else class="row q-col-gutter-md">
      <!-- Home Team Lineup -->
      <div class="col-12 col-md-6">
        <lineup-card
          v-if="match?.homeTeam"
          :team="match.homeTeam"
          :lineup="match.homeTeamLineup"
          :loading="loading"
          @update:lineup="updateHomeLineup"
          @save="saveHomeLineup"
          @add-player-click="showAddPlayerDialog('home')"
          @update:team="updateHomeTeam"
        />
      </div>

      <!-- Away Team Lineup -->
      <div class="col-12 col-md-6">
        <lineup-card
          v-if="match?.awayTeam"
          :team="match.awayTeam"
          :lineup="match.awayTeamLineup"
          :loading="loading"
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
import { usePlayerStore } from 'src/stores/players';
import LineupCard from 'src/components/organisms/LineupCard.vue';
import { useQuasar } from 'quasar';
import { lineupService } from 'src/services/lineupService';
import type { Match, Lineup, Team } from 'src/gql/__generated__/graphql';
import { Position } from 'src/gql/__generated__/graphql';

const props = defineProps<{
  match: Match;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:match', match: Match): void;
}>();

const playerStore = usePlayerStore();
const q = useQuasar();

const showDialog = ref(false);
const selectedTeam = ref<'home' | 'away'>('home');

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
  nationality: '',
  date_of_birth: ''
});

const showAddPlayerDialog = (team: 'home' | 'away') => {
  selectedTeam.value = team;
  showDialog.value = true;
};

const updateHomeLineup = async (lineup: Lineup) => {
  await lineupService.useSaveLineup().saveLineup({
    ...lineup,
    matchId: props.match.id,
    teamId: props.match.homeTeam.id
  });
};

const updateAwayLineup = async (lineup: Lineup) => {
  await lineupService.useSaveLineup().saveLineup({
    ...lineup,
    matchId: props.match.id,
    teamId: props.match.awayTeam.id
  });
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
  if (!props.match.homeTeamLineup) return;

  try {
    if (!validateLineupBeforeSave(props.match.homeTeamLineup)) {
      throw new Error('Invalid lineup data');
    }

    const lineupToSave = {
      ...props.match.homeTeamLineup,
      matchId: props.match.id,
      teamId: props.match.homeTeam.id,
    };

    await lineupService.useSaveLineup().saveLineup(lineupToSave);

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
};

const saveAwayLineup = async () => {
  if (!props.match.awayTeamLineup) return;

  try {
    if (!validateLineupBeforeSave(props.match.awayTeamLineup)) {
      throw new Error('Invalid lineup data');
    }

    const lineupToSave = {
      ...props.match.awayTeamLineup,
      matchId: props.match.id,
      teamId: props.match.awayTeam.id,
    };

    await lineupService.useSaveLineup().saveLineup(lineupToSave);

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
    await playerStore.createPlayer({
      firstName: newPlayer.value.first_name,
      lastName: newPlayer.value.last_name,
      position: newPlayer.value.position,
      teamId: teamId
    });

    // Refresh the player list
    await playerStore.fetchPlayersByTeam(teamId);

    q.notify({
      type: 'positive',
      message: 'Player added successfully'
    });

    // Reset form and close dialog
    newPlayer.value = {
      first_name: '',
      last_name: '',
      position: Position.Midfielder,
      number: null,
      nationality: '',
      date_of_birth: ''
    };
    showDialog.value = false;
  } catch (error) {
    console.error('Error adding player:', error);
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
          playerStore.playersByTeam[props.match.awayTeam.id] = awayPlayers;
        }
      } catch (error) {
        console.error('Failed to fetch away team players:', error);
      }
    }
  } catch (error) {
    console.error('Failed to initialize lineups:', error);
  }
});
</script>

<style scoped>
.match-lineups {
  width: 100%;
}
</style>
