<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4 q-my-none">Players</h1>
      <q-btn color="primary" icon="add" label="Add Player" @click="openAddDialog" />
    </div>

    <!-- Filters -->
    <div class="q-mb-md">
      <q-select
        v-model="selectedTeam"
        :options="teamOptions"
        label="Filter by Team"
        option-value="value"
        clearable
        emit-value
        map-options
        style="width: 300px"
      />
    </div>

    <!-- Players Table -->
    <q-table
      :rows="filteredPlayers"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      @row-click="onRowClick"
      binary-state-sort
    >
      <template v-slot:body-cell-team_logo="props">
        <q-td :props="props" class="text-center">
          <team-logo
            :team="teams.find(t => t.id === props.row.team_id)"
            size="md"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-position="props">
        <q-td :props="props">
          <q-chip
            :color="getPositionColor(props.row.position)"
            text-color="white"
            size="sm"
          >
            {{ props.row.position }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn flat round color="primary" icon="edit" @click="editPlayer(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingPlayer ? 'Edit Player' : 'Add Player' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="savePlayer" class="q-gutter-md">
            <q-input
              v-model="form.firstName"
              label="First Name"
              :rules="[val => !!val || 'First name is required']"
            />
            <q-input
              v-model="form.lastName"
              label="Last Name"
              :rules="[val => !!val || 'Last name is required']"
            />
            <q-input
              v-model="form.dateOfBirth"
              label="Date of Birth"
              type="date"
              :rules="[val => !!val || 'Date of birth is required']"
            />
            <q-select
              v-model="form.position"
              :options="['GK', 'DF', 'MF', 'FW']"
              label="Position"
              :rules="[val => !!val || 'Position is required']"
            />
            <q-input
              v-model="form.nationality"
              label="Nationality"
              :rules="[val => !!val || 'Nationality is required']"
            />
            <q-select
              v-model="form.teamId"
              :options="teams"
              option-value="id"
              option-label="name"
              label="Team"
              :rules="[val => !!val || 'Team is required']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn label="Save" type="submit" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete this player?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deletePlayer" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Position, type Player } from '../gql/__generated__/graphql';
import { playerService, getPlayerFullName, getPositionColor, getPositionSortOrder } from '../services/playerService';
import { useTeamStore } from '../stores/teams';
import TeamLogo from '../components/atoms/TeamLogo.vue';
import { usePlayerStore } from 'src/stores/players';

const $q = useQuasar();
const router = useRouter();
const teamStore = useTeamStore();
const playerStore = usePlayerStore();
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const editingPlayer = ref<Player | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

// Initialize players array
const players = ref<Player[]>([]);

const form = ref<Partial<Player>>({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  position: Position.Undefined,
  nationality: '',
  teamId: undefined,
  imageUrl: undefined
});

const columns = [
  {
    name: 'team_logo',
    label: 'Team',
    field: 'team_id',
    align: 'center' as const,
  },
  {
    name: 'name',
    label: 'Name',
    field: (row: Player) => getPlayerFullName(row),
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'position',
    label: 'Position',
    field: (row: Player) => row.position,
    format: (val: string) => val,
    sortable: true,
    sort: (a: string, b: string) => getPositionSortOrder(a as Position) - getPositionSortOrder(b as Position),
    align: 'center' as const
  },
  { name: 'nationality', label: 'Nationality', field: 'nationality', align: 'left' as const },
  { name: 'dateOfBirth', label: 'Date of Birth', field: 'dateOfBirth', align: 'left' as const, sortable: true },
  { name: 'jerseyNumber', label: 'Jersey', field: 'jerseyNumber', align: 'center' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const },
];

const teams = computed(() => {
  return teamStore.teams || [];
});

const teamOptions = computed(() => {
  return [
    { label: 'All Teams', value: null },
    ...(teams.value || []).map(team => ({ label: team.name, value: team.id }))
  ];
});

const selectedTeam = ref<string | null>(null);

const filteredPlayers = computed(() => {
  if (!playerStore.players) return [];
  if (!selectedTeam.value) return playerStore.players;
  return playerStore.players.filter(player => player.teamId === selectedTeam.value);
});

const loadPlayers = async () => {
  loading.value = true;
  try {
    if (selectedTeam.value) {
      await playerStore.fetchPlayersByTeam(selectedTeam.value);
    } else {
      await playerStore.fetchPlayers();
    }
    // Update local players ref after successful fetch
    players.value = playerStore.players || [];
  } catch (err) {
    console.error('Failed to load players:', err);
    $q.notify({
      color: 'negative',
      message: 'Failed to load players',
      icon: 'error',
    });
    // Ensure players is an empty array on error
    players.value = [];
  } finally {
    loading.value = false;
  }
};

const onRequest = async (props: { pagination: { page: number; rowsPerPage: number } }) => {
  pagination.value.page = props.pagination.page;
  pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  await loadPlayers();
};

const openAddDialog = () => {
  editingPlayer.value = null;
  resetForm();
  dialog.value = true;
};

const editPlayer = (player: Player) => {
  editingPlayer.value = player;
  form.value = { ...player };
  dialog.value = true;
};

const resetForm = () => {
  form.value = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    position: Position.Undefined,
    nationality: '',
    teamId: undefined,
    imageUrl: undefined
  };
};

const savePlayer = async () => {
  try {
    if (editingPlayer.value?.id) {
      await playerService.useUpdatePlayer().updatePlayer({
        ...form.value,
        id: editingPlayer.value.id
      } as Player);
    } else {
      await playerService.useCreatePlayer().createPlayer(form.value as Player);
    }
    dialog.value = false;
    await loadPlayers();
    $q.notify({
      color: 'positive',
      message: `Player ${editingPlayer.value ? 'updated' : 'created'} successfully`,
      icon: 'check',
    });
  } catch (err) {
    console.error('Failed to save player:', err);
    $q.notify({
      color: 'negative',
      message: `Failed to ${editingPlayer.value ? 'update' : 'create'} player`,
      icon: 'error',
    });
  }
};

const confirmDelete = (player: Player) => {
  editingPlayer.value = player;
  deleteDialog.value = true;
};

const deletePlayer = async () => {
  if (!editingPlayer.value?.id) return;

  try {
    await playerService.useDeletePlayer().deletePlayer(editingPlayer.value.id);
    await loadPlayers();
    $q.notify({
      color: 'positive',
      message: 'Player deleted successfully',
      icon: 'check',
    });
  } catch (err) {
    console.error('Failed to delete player:', err);
    $q.notify({
      color: 'negative',
      message: 'Failed to delete player',
      icon: 'error',
    });
  }
};

const onRowClick = (evt: Event, row: Player) => {
  void router.push(`/players/${row.id}`);
};

watch(selectedTeam, async () => {
  await loadPlayers();
});

onMounted(async () => {
  try {
    await Promise.all([
      teamStore.fetchTeams(),
      loadPlayers()
    ]);
  } catch (err) {
    console.error('Failed to initialize data:', err);
    $q.notify({
      color: 'negative',
      message: 'Failed to initialize data',
      icon: 'error',
    });
  }
});
</script>
