<template>
  <div class="match-info">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Match Information</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Date & Time</q-item-label>
                  <q-item-label>{{ formatDate(match.scheduledDate) }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Status</q-item-label>
                  <q-item-label>{{ match.status }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Score</q-item-label>
                  <q-item-label>
                    {{ match.homeTeam?.name }} {{ match.score?.homeTeamScore }} - {{ match.score?.awayTeamScore }} {{ match.awayTeam?.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm">Match Events</div>
            <q-timeline color="primary">
              <q-timeline-entry
                v-for="event in match.events"
                :key="event.id"
                :title="formatEventTitle(event)"
                :subtitle="`${event.minuteOfMatch}' - ${formatEventType(event.type)}`"
                icon="sports_soccer"
              >
                <div v-if="event.description">{{ event.description }}</div>
              </q-timeline-entry>
              <q-timeline-entry
                v-if="match.events.length === 0"
                title="No Events"
                icon="sports_soccer"
              >
                <div>No events recorded for this match yet.</div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { EventType } from '../../gql/__generated__/graphql';
import type { Match, MatchEvent } from '../../gql/__generated__/graphql';

defineProps<{
  match: Match;
}>();

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return date.formatDate(dateStr, 'MMMM D, YYYY [at] h:mm A');
  } catch {
    return dateStr;
  }
};

const formatEventType = (type: EventType): string => {
  switch (type) {
    case EventType.Goal: return '⚽ Goal';
    case EventType.YellowCard: return '🟨 Yellow Card';
    case EventType.RedCard: return '🟥 Red Card';
    case EventType.Substitution: return '🔄 Substitution';
    default: return type;
  }
};

const formatEventTitle = (event: MatchEvent): string => {
  const playerName = event.player ? `${event.player.firstName} ${event.player.lastName}` : 'Unknown Player';
  const secondaryPlayerName = event.secondaryPlayer ? `${event.secondaryPlayer.firstName} ${event.secondaryPlayer.lastName}` : '';
  const teamName = event.team?.name || '';

  switch (event.type) {
    case EventType.Goal:
      return `Goal by ${playerName} (${teamName})${secondaryPlayerName ? ` - Assist by ${secondaryPlayerName}` : ''}`;
    case EventType.YellowCard:
    case EventType.RedCard:
      return `${event.type === EventType.YellowCard ? 'Yellow' : 'Red'} card shown to ${playerName} (${teamName})`;
    case EventType.Substitution:
      return `${playerName} replaced by ${secondaryPlayerName} (${teamName})`;
    default:
      return event.description || 'Event';
  }
};
</script>

<style scoped>
.match-info {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
