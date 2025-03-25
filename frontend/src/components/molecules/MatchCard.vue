<template>
  <q-card class="match-card" @click="navigateToMatch">
    <q-card-section class="match-header">
      <div class="row items-center justify-between">
        <div class="col-5 text-center">
          <TeamLogo :team="match.homeTeam" size="50" />
          <div class="team-name q-mt-sm">{{ match.homeTeam?.name || 'Home Team' }}</div>
        </div>

        <div class="col-2 text-center">
          <div v-if="match.status === Status.Completed" class="score-display">
            {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
          </div>
          <div v-else-if="match.status === Status.InProgress" class="score-display text-primary">
            {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
            <q-badge color="green" class="q-mt-xs">LIVE</q-badge>
          </div>
          <div v-else class="vs-display">
            vs
          </div>
        </div>

        <div class="col-5 text-center">
          <TeamLogo :team="match.awayTeam" size="50" />
          <div class="team-name q-mt-sm">{{ match.awayTeam?.name || 'Away Team' }}</div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row items-center justify-between">
        <div class="col-auto">
          <q-badge :color="getStatusColor(match.status)">
            {{ formatMatchStatus(match.status) }}
          </q-badge>
        </div>
        <div class="col-auto text-caption text-grey-7">
          {{ formatDate(match.scheduledDate) }}
        </div>
      </div>
      <div class="text-caption q-mt-sm">
        {{ match.homeTeam?.stadium || 'TBD' }}
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="View Details" :to="`/matches/${match.id}`" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { type Match, Status } from '../../gql/__generated__/graphql';
import { date } from 'quasar';
import TeamLogo from '../atoms/TeamLogo.vue';

interface Props {
  match: Match;
}

const props = defineProps<Props>();
const router = useRouter();

const navigateToMatch = () => {
  void router.push(`/matches/${props.match.id}`);
};

const formatDate = (dateString: string) => {
  try {
    return date.formatDate(dateString, 'MMM D, YYYY - h:mm A');
  } catch {
    return dateString;
  }
};

const formatMatchStatus = (status: Status) => {
  switch (status) {
    case Status.Scheduled: return 'Scheduled';
    case Status.InProgress: return 'Live';
    case Status.Completed: return 'COMPLETED';
    case Status.Postponed: return 'Postponed';
    case Status.Cancelled: return 'Cancelled';
    default: return 'Unknown';
  }
};

const getStatusColor = (status: Status) => {
  switch (status) {
    case Status.Scheduled: return 'blue';
    case Status.InProgress: return 'green';
    case Status.Completed: return 'grey';
    case Status.Postponed: return 'orange';
    case Status.Cancelled: return 'red';
    default: return 'grey';
  }
};
</script>

<style scoped>
.match-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.team-name {
  font-size: 0.9rem;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-display {
  font-size: 1.2rem;
  font-weight: bold;
}

.vs-display {
  font-size: 1rem;
  color: #666;
}
</style>
