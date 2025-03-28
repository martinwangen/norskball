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
  background: linear-gradient(145deg, var(--q-color-surface), var(--q-color-surface-variant));
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--q-color-border);
  backdrop-filter: blur(10px);
}

.horizontal-list {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  gap: 1rem;
  min-width: min-content;
  padding: 0.5rem;
}

:deep(.q-item) {
  flex: 0 0 320px;
  height: 90px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  padding: 1rem;
  border: 1px solid var(--q-color-border);
  background: linear-gradient(145deg, var(--q-color-surface), var(--q-color-surface-variant));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.q-item-section) {
  padding: 0;
}

.team-names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.team-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--q-color-surface);
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid var(--q-color-border);
  transition: all 0.3s ease;
}

.team-name {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--q-color-on-surface);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.vs {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--q-color-on-surface);
  padding: 0.3rem 0.6rem;
  background: var(--q-color-surface);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--q-color-border);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.q-item-label.caption) {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--q-color-on-surface);
  opacity: 0.8;
  margin-top: 0.25rem;
}

:deep(.q-item--active) {
  background: linear-gradient(145deg, var(--q-color-primary), var(--q-color-secondary));
  border-color: var(--q-color-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

:deep(.q-item--active .team-logo) {
  border-color: var(--q-color-on-primary);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

:deep(.q-item--active .team-name),
:deep(.q-item--active .vs),
:deep(.q-item--active .q-item-label.caption) {
  color: var(--q-color-on-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.q-item:hover) {
  background: var(--q-color-surface-variant);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

:deep(.q-item--active:hover) {
  background: linear-gradient(145deg, var(--q-color-primary), var(--q-color-secondary));
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.match-selector-array::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.match-selector-array {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 768px) {
  :deep(.q-item) {
    flex: 0 0 280px;
    height: 80px;
    padding: 0.75rem;
  }

  .team-logo {
    width: 36px;
    height: 36px;
    padding: 3px;
  }

  .team-name {
    font-size: 0.85rem;
  }

  .vs {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  :deep(.q-item-label.caption) {
    font-size: 0.75rem;
  }
}
</style>
