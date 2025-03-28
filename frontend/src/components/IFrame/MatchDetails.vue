<template>
  <div class="match-selector">
    <div class="teams-container">
      <!-- Home Team -->
      <div v-if="match.homeTeamLineup?.players?.length" class="team-section">
        <q-expansion-item
          :disable="isDisabled"
          v-model="expandedHome"
          class="team-expansion"
        >
          <template v-slot:header>
              <q-img
                v-if="getTeamById(match.homeTeam?.id)?.logo"
                :src="getTeamById(match.homeTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="text-h6">{{ match.homeTeam?.name || 'Home Team' }}</div>
          </template>
          <q-table
            :rows="match.homeTeamLineup.players"
            :columns="playerColumns"
            row-key="id"
            flat
            bordered
            dense
            :pagination="{ rowsPerPage: 0 }"
            :class="{ 'opacity-5': !hasRatings(match.homeTeamLineup.players) }"
            dark
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="position" :props="props" class="text-center">{{ props.row.position }}</q-td>
                <q-td key="player" :props="props">{{ props.row.player?.firstName }} {{ props.row.player?.lastName }}</q-td>
                <q-td key="rating" :props="props" class="text-center">{{ props.row.ratings?.[0]?.score || '-' }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-expansion-item>
      </div>

      <!-- Away Team -->
      <div v-if="match.awayTeamLineup?.players?.length" class="team-section">
        <q-expansion-item
          :disable="isDisabled"
          v-model="expandedAway"
          class="team-expansion"
        >
          <template v-slot:header>
              <q-img
                v-if="getTeamById(match.awayTeam?.id)?.logo"
                :src="getTeamById(match.awayTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="text-h6">{{ match.awayTeam?.name || 'Away Team' }}</div>
          </template>
          <q-table
            :rows="match.awayTeamLineup.players"
            :columns="playerColumns"
            row-key="id"
            flat
            bordered
            dense
            :pagination="{ rowsPerPage: 0 }"
            :class="{ 'opacity-5': !hasRatings(match.awayTeamLineup.players) }"
            dark
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="position" :props="props" class="text-center">{{ props.row.position }}</q-td>
                <q-td key="player" :props="props">{{ props.row.player?.firstName }} {{ props.row.player?.lastName }}</q-td>
                <q-td key="rating" :props="props" class="text-center">{{ props.row.ratings?.[0]?.score || '-' }}</q-td>
              </q-tr>
            </template>
          </q-table>
        </q-expansion-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, computed, watch } from 'vue';
import { useTeamStore } from '../../stores/teams';

const teamStore = useTeamStore();
const expandedHome = ref(true);
const expandedAway = ref(true);

// Add window width tracking
const windowWidth = ref(window.innerWidth);

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

// Computed property for disable state
const isDisabled = computed(() => {
  return windowWidth.value >= 1050; // Disable on mobile
});

watch(isDisabled, (newVal) => {
  if (newVal) {
    expandedHome.value = true;
    expandedAway.value = true;
  }
});

defineProps<{
  match: {
    id: string;
    scheduledDate: string;
    homeTeam?: { id: string; name: string };
    awayTeam?: { id: string; name: string };
    homeTeamLineup?: {
      players: Array<{
        id: string;
        position: string;
        player?: {
          firstName: string;
          lastName: string;
        };
        ratings?: Array<{ score: number }>;
      }>;
    };
    awayTeamLineup?: {
      players: Array<{
        id: string;
        position: string;
        player?: {
          firstName: string;
          lastName: string;
        };
        ratings?: Array<{ score: number }>;
      }>;
    };
  };
}>();

const playerColumns = [
  { name: 'position', label: 'Pos', field: 'position', align: 'center' as const, sortable: false },
  { name: 'player', label: 'Player', field: 'player', align: 'left' as const, sortable: false },
  { name: 'rating', label: 'Rating', field: 'rating', align: 'center' as const, sortable: false }
];

const hasRatings = (players) => {
  if (!players) return false;
  return players.some(player => player?.ratings && player.ratings.length > 0);
};

const getTeamById = (id?: string) => {
  if (!id) return null;
  return teamStore.getTeamById(id);
};

onMounted(async () => {
  await teamStore.init();
});
</script>

<style scoped>
.team-section {
  background: var(--q-color-surface);
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--q-color-border);
  flex: 1;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--q-color-surface-variant);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid var(--q-color-border);
}

.team-logo {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--q-color-surface);
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 2px solid var(--q-color-border);
}

.team-header:hover .team-logo {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.team-section:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.match-selector {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem;
}

.teams-container {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 1.5rem;
}

:deep(.q-table) {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
}

:deep(.q-table__container) {
  background: var(--q-color-surface-variant);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--q-color-border);
}

:deep(.q-table tbody tr) {
  background: transparent;
  transition: all 0.2s ease;
}

:deep(.q-table tbody tr:hover) {
  background: var(--q-color-surface);
  transform: translateX(6px);
}

:deep(.q-table tbody tr:nth-child(even)) {
  background: var(--q-color-surface-variant);
}

:deep(.q-table td) {
  padding: 1.25rem 1.5rem;
  font-size: 1rem;
  border-bottom: 1px solid var(--q-color-border);
}

:deep(.q-table th) {
  padding: 1.25rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: var(--q-color-surface);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 2px solid var(--q-color-border);
}

:deep(.q-expansion-item__header) {
  display: none !important;
}

:deep(.q-expansion-item__content) {
  padding: 0;
}

:deep(.q-expansion-item__container) {
  border: none;
}

:deep(.q-expansion-item) {
  background: transparent;
}

:deep(.q-expansion-item__content) {
  background: transparent;
}

:deep(.q-expansion-item__content-container) {
  background: transparent;
}

@media (max-width: 1050px) {
  .teams-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .team-section {
    padding: 1.25rem;
  }

  .team-logo {
    width: 56px;
    height: 56px;
    padding: 6px;
  }

  :deep(.q-table td),
  :deep(.q-table th) {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }

  .match-selector {
    padding: 1.25rem;
  }
}
</style>
