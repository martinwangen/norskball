<template>
  <q-card class="match-card" @click="navigateToMatch">
    <q-card-section class="match-header">
      <div class="row items-center justify-between">
        <div class="col-5 text-center">
          <TeamLogo :team-id="match.homeTeam.id" size="50" />
          <div class="team-name q-mt-sm">{{ match.homeTeam?.name || $t('matches.homeTeam') }}</div>
        </div>

        <div class="col-2 text-center">
          <div v-if="match.status === Status.Completed" class="score-display">
            {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
          </div>
          <div v-else-if="match.status === Status.InProgress" class="score-display text-primary">
            {{ match.score.homeTeamScore }} - {{ match.score.awayTeamScore }}
            <q-badge color="green" class="q-mt-xs">{{ $t('matches.live') }}</q-badge>
          </div>
          <div v-else class="vs-display">
            {{ $t('matches.vs') }}
          </div>
        </div>

        <div class="col-5 text-center">
          <TeamLogo :team-id="match.awayTeam.id" size="50" />
          <div class="team-name q-mt-sm">{{ match.awayTeam?.name || $t('matches.awayTeam') }}</div>
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
        {{ match.homeTeam?.stadium || $t('matches.tbd') }}
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" :label="$t('matches.viewDetails')" :to="`/matches/${match.id}`" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { type Match, Status } from '../../gql/__generated__/graphql';
import TeamLogo from '../atoms/TeamLogo.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    const date = new Date(dateString);
    // Add 1 hour for timezone
    date.setHours(date.getHours() + 1);
    const formattedDate = date.toLocaleString('nb-NO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    // Remove "kl." and replace comma+space with line break
    return formattedDate.replace('kl.', '').replace(', ', '\n').trim();
  } catch {
    return dateString;
  }
};

const formatMatchStatus = (status: Status) => {
  switch (status) {
    case Status.Scheduled: return t('matches.status.scheduled');
    case Status.InProgress: return t('matches.status.live');
    case Status.Completed: return t('matches.status.finished');
    case Status.Postponed: return t('matches.status.postponed');
    case Status.Cancelled: return t('matches.status.cancelled');
    default: return t('common.unknown');
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
