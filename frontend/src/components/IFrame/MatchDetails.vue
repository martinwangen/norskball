<template>
  <div class="match-selector">
    <div class="teams-container">
      <!-- Home Team -->
      <div v-if="match.homeTeamLineup?.players?.length" class="team-section">
        <q-expansion-item
          v-model="expandedHome"
          class="team-expansion"
        >
          <template v-slot:header>
            <div class="team-header">
              <q-img
                v-if="getTeamById(match.homeTeam?.id)?.logo"
                :src="getTeamById(match.homeTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="text-h6">{{ match.homeTeam?.name || 'Home Team' }}</div>
            </div>
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
          v-model="expandedAway"
          class="team-expansion"
        >
          <template v-slot:header>
            <div class="team-header">
              <q-img
                v-if="getTeamById(match.awayTeam?.id)?.logo"
                :src="getTeamById(match.awayTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="text-h6">{{ match.awayTeam?.name || 'Away Team' }}</div>
            </div>
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
import { defineProps, onMounted, ref } from 'vue';
import { useTeamStore } from '../../stores/teams';

const teamStore = useTeamStore();
const expandedHome = ref(true);
const expandedAway = ref(true);

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
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--q-color-border);
  flex: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem;
  background: var(--q-color-surface-variant);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.team-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--q-color-surface);
  padding: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.team-header:hover .team-logo {
  transform: scale(1.05);
}

.team-section:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.match-selector {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.teams-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

:deep(.q-table) {
  background: var(--q-color-surface);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.q-table__container) {
  background: var(--q-color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

:deep(.q-table tbody tr) {
  background: var(--q-color-surface);
  transition: all 0.2s ease;
}

:deep(.q-table tbody tr:hover) {
  background: var(--q-color-surface-variant);
  transform: translateX(4px);
}

:deep(.q-table tbody tr:nth-child(even)) {
  background: var(--q-color-surface-variant);
}

:deep(.q-table td) {
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
}

:deep(.q-table th) {
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--q-color-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.q-expansion-item__content) {
  padding: 0;
}

:deep(.q-expansion-item__container) {
  border: none;
}

:deep(.q-expansion-item__header) {
  background: var(--q-color-surface-variant);
  border-radius: 8px;
  padding: 0;
  transition: all 0.2s ease;
}

:deep(.q-expansion-item__header:hover) {
  background: var(--q-color-surface-variant);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .teams-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .team-section {
    padding: 1rem;
  }

  .team-logo {
    width: 48px;
    height: 48px;
  }

  :deep(.q-table td),
  :deep(.q-table th) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .match-selector {
    padding: 1rem;
  }
}
</style>
