<template>
  <div class="match-event-form">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">{{ getEventTitle }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <!-- Minute Input -->
          <q-input
            v-if="eventType !== EventType.HalfTimeStart"
            v-model.number="minuteOfMatch"
            type="number"
            label="Minute"
            :rules="[
              val => !!val || 'Minute is required',
              val => val >= 0 || 'Minute must be positive',
              val => val <= 120 || 'Minute must be less than 120'
            ]"
            outlined
          />

          <!-- Team Selection -->
          <q-select
            v-if="eventType !== EventType.HalfTimeStart && eventType !== EventType.GameEnd"
            v-model="selectedTeam"
            :options="[match.homeTeam, match.awayTeam]"
            option-label="name"
            label="Team"
            :rules="[val => !!val || 'Team is required']"
            outlined
          />

          <!-- Player Selection -->
          <q-select
            v-if="selectedTeam && eventType !== EventType.HalfTimeStart && eventType !== EventType.GameEnd"
            v-model="selectedPlayer"
            :options="getTeamPlayers(selectedTeam.id)"
            :option-label="getPlayerFullName"
            :label="getPlayerLabel"
            :rules="[val => !!val || 'Player is required']"
            outlined
          />

          <!-- Assist Player Selection (for goals) -->
          <q-select
            v-if="selectedTeam && (eventType === EventType.Goal || eventType === EventType.OwnGoal)"
            v-model="selectedAssistPlayer"
            :options="getAssistPlayers(selectedTeam.id)"
            :option-label="getPlayerFullName"
            label="Assist (optional)"
            outlined
          />

          <!-- Substitute Player Selection -->
          <q-select
            v-if="eventType === EventType.Substitution && selectedTeam"
            v-model="selectedSecondaryPlayer"
            :options="getTeamPlayers(selectedTeam.id)"
            :option-label="getPlayerFullName"
            label="Substitute In"
            :rules="[val => !!val || 'Substitute player is required']"
            outlined
          />

          <!-- Added Minutes (for halftime and end game) -->
          <q-input
            v-if="eventType === EventType.HalfTimeStart || eventType === EventType.GameEnd"
            v-model.number="addedMinutes"
            type="number"
            label="Added Minutes"
            :rules="[
              val => !!val || 'Added minutes is required',
              val => val >= 0 || 'Added minutes must be positive',
              val => val <= 99 || 'Added minutes must be less than 100'
            ]"
            outlined
          />

          <!-- Score Confirmation for End Game -->
          <template v-if="eventType === EventType.GameEnd">
            <div class="text-subtitle1 q-mt-md">Final Score</div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model.number="homeScore"
                  type="number"
                  :label="match.homeTeam?.name"
                  :rules="[
                    val => !!val || 'Score is required',
                    val => val >= 0 || 'Score must be positive'
                  ]"
                  outlined
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="awayScore"
                  type="number"
                  :label="match.awayTeam?.name"
                  :rules="[
                    val => !!val || 'Score is required',
                    val => val >= 0 || 'Score must be positive'
                  ]"
                  outlined
                />
              </div>
            </div>
          </template>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancel"
              color="negative"
              @click="$emit('cancel')"
            />
            <q-btn
              label="Add Event"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EventType } from '../../gql/__generated__/graphql';
import type { Match, MatchEvent, Player } from '../../gql/__generated__/graphql';
import { matchService } from '../../services/matchService';
import { getPlayerFullName } from '../../services/playerService';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  match: Match;
  eventType: EventType;
}>();

const emit = defineEmits<{
  (e: 'event-added', event: MatchEvent): void;
  (e: 'cancel'): void;
}>();

const minuteOfMatch = ref<number | null>(null);
const selectedTeam = ref<{ id: string; name: string } | null>(null);
const selectedPlayer = ref<Player | null>(null);
const selectedAssistPlayer = ref<Player | null>(null);
const selectedSecondaryPlayer = ref<Player | null>(null);
const addedMinutes = ref<number | null>(null);
const homeScore = ref<number | null>(null);
const awayScore = ref<number | null>(null);
const loading = ref(false);

const { t } = useI18n();

// Initialize scores from match
if (props.match.score) {
  homeScore.value = props.match.score.homeTeamScore;
  awayScore.value = props.match.score.awayTeamScore;
}

const getEventTitle = computed(() => {
  switch (props.eventType) {
    case EventType.Goal: return t('matches.events.addGoal');
    case EventType.OwnGoal: return t('matches.events.addOwnGoal');
    case EventType.YellowCard: return t('matches.events.addYellowCard');
    case EventType.RedCard: return t('matches.events.addRedCard');
    case EventType.Substitution: return t('matches.events.addSubstitution');
    case EventType.HalfTimeStart: return t('matches.events.addHalftime');
    case EventType.GameEnd: return t('matches.events.endGame');
    default: return t('matches.events.addEvent');
  }
});

const getTeamPlayers = (teamId: string) => {
  const lineup = teamId === props.match.homeTeamId ? props.match.homeTeamLineup : props.match.awayTeamLineup;
  return lineup?.players.map(p => p.player).filter((p): p is Player => p !== null) || [];
};

const getAssistPlayers = (teamId: string) => {
  // For own goals, get players from the opposing team
  const isOwnGoal = props.eventType === EventType.OwnGoal;
  const targetTeamId = isOwnGoal
    ? (teamId === props.match.homeTeamId ? props.match.awayTeamId : props.match.homeTeamId)
    : teamId;

  const lineup = targetTeamId === props.match.homeTeamId ? props.match.homeTeamLineup : props.match.awayTeamLineup;
  return lineup?.players.map(p => p.player).filter((p): p is Player => p !== null) || [];
};

const getPlayerLabel = computed(() => {
  switch (props.eventType) {
    case EventType.Goal:
    case EventType.OwnGoal:
      return t('matches.events.goalscorer');
    case EventType.Substitution:
      return t('matches.events.substituteOut');
    case EventType.YellowCard:
    case EventType.RedCard:
      return t('matches.events.player');
    default:
      return t('matches.events.player');
  }
});

const handleSubmit = async () => {
  if (props.eventType === EventType.GameEnd) {
    if (!addedMinutes.value || homeScore.value === null || awayScore.value === null) return;
  } else if (props.eventType === EventType.HalfTimeStart) {
    if (!addedMinutes.value) return;
  } else {
    if (!minuteOfMatch.value || !selectedTeam.value || !selectedPlayer.value) return;
  }

  loading.value = true;
  try {
    const { addMatchEvent } = matchService.useAddMatchEvent();

    // Handle score updates for goals
    if (props.eventType === EventType.Goal || props.eventType === EventType.OwnGoal) {
      const isHomeTeam = selectedTeam.value?.id === props.match.homeTeamId;
      const currentHomeScore = props.match.score?.homeTeamScore || 0;
      const currentAwayScore = props.match.score?.awayTeamScore || 0;

      if (props.eventType === EventType.Goal) {
        if (isHomeTeam) {
          homeScore.value = currentHomeScore + 1;
        } else {
          awayScore.value = currentAwayScore + 1;
        }
      } else {
        if (isHomeTeam) {
          awayScore.value = currentAwayScore + 1;
        } else {
          homeScore.value = currentHomeScore + 1;
        }
      }
    }

    // Add the event
    const event = await addMatchEvent({
      matchId: props.match.id,
      type: props.eventType,
      minuteOfMatch: props.eventType === EventType.HalfTimeStart ? 45 : minuteOfMatch.value,
      playerId: props.eventType === EventType.HalfTimeStart ? undefined : selectedPlayer.value?.id,
      teamId: props.eventType === EventType.HalfTimeStart ? undefined : selectedTeam.value?.id,
      secondaryPlayerId: props.eventType === EventType.Substitution
        ? selectedSecondaryPlayer.value?.id
        : (props.eventType === EventType.Goal || props.eventType === EventType.OwnGoal)
          ? selectedAssistPlayer.value?.id
          : undefined,
      description: props.eventType === EventType.HalfTimeStart || props.eventType === EventType.GameEnd
        ? `Added minutes: ${addedMinutes.value}`
        : undefined,
      timestamp: new Date().toISOString()
    });

    // Update score if needed
    if (props.eventType === EventType.Goal || props.eventType === EventType.OwnGoal || props.eventType === EventType.GameEnd) {
      const { updateMatchScore } = matchService.useUpdateMatchScore();
      await updateMatchScore(props.match.id, {
        homeTeamScore: homeScore.value,
        awayTeamScore: awayScore.value
      });
    }

    emit('event-added', event);
  } catch (error) {
    console.error('Error adding match event:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.match-event-form {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
