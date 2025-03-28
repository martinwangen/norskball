<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4 q-my-none">{{ $t('players.title') }}</h1>
      <q-btn color="primary" icon="add" :label="$t('players.addPlayer')" @click="openAddDialog" />
    </div>

    <!-- Filters -->
    <div class="q-mb-md">
      <q-select
        v-model="selectedTeam"
        :options="teamOptions"
        :label="$t('players.filterByTeam')"
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
            :team-id="props.row.teamId"
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
            {{ $t(`players.positions.${props.row.position.toLowerCase()}`) }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn flat round color="primary" icon="edit" @click="editPlayer(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editingPlayer ? $t('players.editPlayer') : $t('players.addPlayer') }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="savePlayer" class="q-gutter-md">
            <q-input
              v-model="form.firstName"
              :label="$t('players.form.firstName')"
              :rules="[val => !!val || $t('players.form.firstNameRequired')]"
            />
            <q-input
              v-model="form.lastName"
              :label="$t('players.form.lastName')"
              :rules="[val => !!val || $t('players.form.lastNameRequired')]"
            />
            <q-input
              v-model="form.dateOfBirth"
              :label="$t('players.form.dateOfBirth')"
              type="date"
              :rules="[val => !!val || $t('players.form.dateOfBirthRequired')]"
            />
            <q-select
              v-model="form.position"
              :options="['GK', 'DF', 'MF', 'FW']"
              :label="$t('players.form.position')"
              :rules="[val => !!val || $t('players.form.positionRequired')]"
            />
            <q-input
              v-model="form.nationality"
              :label="$t('players.form.nationality')"
              :rules="[val => !!val || $t('players.form.nationalityRequired')]"
            />
            <q-select
              v-model="form.teamId"
              :options="teams"
              option-value="id"
              option-label="name"
              :label="$t('players.form.team')"
              :rules="[val => !!val || $t('players.form.teamRequired')]"
            />

            <div class="row justify-end q-mt-md">
              <q-btn :label="$t('common.cancel')" color="primary" flat v-close-popup />
              <q-btn :label="$t('common.save')" type="submit" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Position, type Player, type PlayerInput } from '../gql/__generated__/graphql';
import { getPlayerFullName, getPositionColor, getPositionSortOrder } from '../services/playerService';
import { useTeamStore } from '../stores/teams';
import TeamLogo from '../components/atoms/TeamLogo.vue';
import { usePlayerStore } from 'src/stores/players';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const teamStore = useTeamStore();
const playerStore = usePlayerStore();
const loading = ref(false);
const dialog = ref(false);
const editingPlayer = ref<Player | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

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
    label: t('players.table.team'),
    field: 'team_id',
    align: 'center' as const,
  },
  {
    name: 'name',
    label: t('players.table.name'),
    field: (row: Player) => getPlayerFullName(row),
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'position',
    label: t('players.table.position'),
    field: (row: Player) => row.position,
    format: (val: string) => val,
    sortable: true,
    sort: (a: string, b: string) => getPositionSortOrder(a as Position) - getPositionSortOrder(b as Position),
    align: 'center' as const
  },
  { name: 'nationality', label: t('players.table.nationality'), field: 'nationality', align: 'left' as const },
  { name: 'dateOfBirth', label: t('players.table.dateOfBirth'), field: 'dateOfBirth', align: 'left' as const, sortable: true },
  { name: 'jerseyNumber', label: t('players.table.jersey'), field: 'jerseyNumber', align: 'center' as const },
  { name: 'actions', label: t('players.table.actions'), field: 'actions', align: 'center' as const },
];

const teams = computed(() => {
  return teamStore.teams || [];
});

const teamOptions = computed(() => {
  return [
    { label: t('players.allTeams'), value: null },
    ...(teams.value || []).map(team => ({ label: team.name, value: String(team.id) }))
  ];
});

const selectedTeam = ref<string | null>(null);

const filteredPlayers = computed(() => {
  if (!playerStore.players) return [];
  if (!selectedTeam.value) return playerStore.players;
  return playerStore.getPlayersByTeam(selectedTeam.value);
});

const loadPlayers = async () => {
  loading.value = true;
  try {
    if (selectedTeam.value) {
      await playerStore.fetchPlayersByTeam(selectedTeam.value);
    } else {
      await playerStore.fetchPlayers();
    }
  } catch (err) {
    console.error('Failed to load players:', err);
    $q.notify({
      color: 'negative',
      message: 'Failed to load players',
      icon: 'error',
    });
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
      await playerStore.updatePlayer({
        ...form.value,
        id: editingPlayer.value.id
      } as PlayerInput);
    } else {
      await playerStore.createPlayer(form.value as Omit<PlayerInput, 'id' | 'createdAt' | 'updatedAt'>);
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
