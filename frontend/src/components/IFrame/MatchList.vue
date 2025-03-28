<template>
  <div class="match-selector-array">
    <q-list separator class="horizontal-list">
      <q-item
        v-for="match in matches"
        :key="match.id"
        clickable
        v-ripple
        :active="selectedMatchId === match.id"
        @click="selectMatch(match.id)"
      >
        <q-item-section>
          <div class="team-names">
            <div class="team home">
              <q-img
                v-if="getTeamById(match.homeTeam?.id)?.logo"
                :src="getTeamById(match.homeTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="team-name">{{ match.homeTeam?.name || 'Home Team' }}</div>
            </div>
            <div class="vs">vs</div>
            <div class="team away">
              <q-img
                v-if="getTeamById(match.awayTeam?.id)?.logo"
                :src="getTeamById(match.awayTeam?.id)?.logo"
                class="team-logo"
                fit="contain"
              />
              <div class="team-name">{{ match.awayTeam?.name || 'Away Team' }}</div>
            </div>
          </div>
          <q-item-label caption>{{ formatDate(match.scheduledDate) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import { useTeamStore } from '../../stores/teams';

const teamStore = useTeamStore();

defineProps<{
  matches: Array<{
    id: string;
    scheduledDate: string;
    homeTeam?: { id: string; name: string };
    awayTeam?: { id: string; name: string };
  }>;
  selectedMatchId?: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedMatchId', value: string): void;
}>();

const selectMatch = (matchId: string) => {
  emit('update:selectedMatchId', matchId);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
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
.match-selector-array {
  width: 100%;
  overflow-x: auto;
  background: var(--q-color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.horizontal-list {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  gap: 0.5rem;
  min-width: min-content;
}

:deep(.q-item) {
  flex: 0 0 300px;
  height: 75px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-align: center;
  padding: 0.5rem;
  background: var(--q-color-surface-variant);
}

:deep(.q-item-section) {
  padding: 0;
}

.team-names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.team-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--q-color-surface);
  padding: 2px;
}

.team-name {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
}

.vs {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 500;
}

:deep(.q-item-label.caption) {
  font-size: 0.75rem;
  opacity: 0.8;
}

:deep(.q-item--active) {
  background: var(--q-color-primary);
  color: var(--q-color-on-primary);
  transform: translateY(-2px);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.q-item--active .team-name),
:deep(.q-item--active .vs) {
  color: var(--q-color-on-primary);
}

:deep(.q-item:hover) {
  background: var(--q-color-primary-light);
  color: var(--q-color-on-primary);
  transform: translateY(-1px);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.match-selector-array::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.match-selector-array {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
