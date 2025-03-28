<template>
  <div class="match-event-bar">
    <q-card flat bordered>
      <q-card-section class="row items-center justify-center q-gutter-md">
        <!-- Pre-match -->
        <template v-if="match.status === Status.Scheduled">
          <q-btn
            flat
            round
            color="primary"
            icon="play_arrow"
            @click="startMatch"
          >
            <q-tooltip>{{ $t('matches.startMatch') }}</q-tooltip>
          </q-btn>
        </template>

        <!-- During match -->
        <template v-else-if="match.status === Status.InProgress">
          <template v-if="!hasHalfTimeStart">
            <q-btn
              flat
              round
              color="positive"
              icon="sports_soccer"
              @click="showEventDialog(EventType.Goal)"
            >
              <q-tooltip>{{ $t('matches.addGoal') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="sports_soccer"
              @click="showEventDialog(EventType.OwnGoal)"
            >
              <q-tooltip>{{ $t('matches.addOwnGoal') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="warning"
              icon="square"
              @click="showEventDialog(EventType.YellowCard)"
            >
              <q-tooltip>{{ $t('matches.addYellowCard') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="square"
              @click="showEventDialog(EventType.RedCard)"
            >
              <q-tooltip>{{ $t('matches.addRedCard') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="info"
              icon="swap_vert"
              @click="showEventDialog(EventType.Substitution)"
            >
              <q-tooltip>{{ $t('matches.addSubstitution') }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="grey"
              icon="timer"
              @click="showEventDialog(EventType.HalfTimeStart)"
            >
              <q-tooltip>{{ $t('matches.addHalftime') }}</q-tooltip>
            </q-btn>
          </template>
          <template v-else>
            <q-btn
              flat
              round
              color="primary"
              icon="play_arrow"
              @click="resumeMatch"
            >
              <q-tooltip>{{ $t('matches.resumeMatch') }}</q-tooltip>
            </q-btn>
          </template>
          <q-btn
            flat
            round
            color="negative"
            icon="stop"
            @click="endMatch"
          >
            <q-tooltip>{{ $t('matches.endMatch') }}</q-tooltip>
          </q-btn>
        </template>
      </q-card-section>
    </q-card>

    <!-- Event Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 500px">
        <match-event-form
          :match="match"
          :event-type="selectedEventType"
          @event-added="handleEventAdded"
          @cancel="showDialog = false"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Status, EventType } from '../../gql/__generated__/graphql';
import type { Match } from '../../gql/__generated__/graphql';
import MatchEventForm from '../organisms/MatchEventForm.vue';
import { matchService } from '../../services/matchService';

const props = defineProps<{
  match: Match;
}>();

const emit = defineEmits<{
  (e: 'update:match', match: Match): void;
}>();

const showDialog = ref(false);
const selectedEventType = ref<EventType | null>(null);

const hasHalfTimeStart = computed(() => {
  return props.match.events?.some(event => event.type === EventType.HalfTimeStart);
});

const showEventDialog = (type: EventType) => {
  selectedEventType.value = type;
  showDialog.value = true;
};

const startMatch = async () => {
  try {
    const { updateMatchStatus } = matchService.useUpdateMatchStatus();
    await updateMatchStatus(props.match.id, Status.InProgress);
    emit('update:match', { ...props.match, status: Status.InProgress });
  } catch (error) {
    console.error('Error starting match:', error);
  }
};

const resumeMatch = async () => {
  try {
    const { updateMatchStatus } = matchService.useUpdateMatchStatus();
    await updateMatchStatus(props.match.id, Status.InProgress);
    emit('update:match', { ...props.match, status: Status.InProgress });
  } catch (error) {
    console.error('Error resuming match:', error);
  }
};

const endMatch = () => {
  selectedEventType.value = EventType.GameEnd;
  showDialog.value = true;
};

const handleEventAdded = async () => {
  showDialog.value = false;
  selectedEventType.value = null;
  try {
    const { updateMatchStatus } = matchService.useUpdateMatchStatus();
    await updateMatchStatus(props.match.id, Status.Completed);
    emit('update:match', { ...props.match, status: Status.Completed });
  } catch (error) {
    console.error('Error ending match:', error);
  }
};
</script>

<style scoped>
.match-event-bar {
  margin: 8px 0;
}
</style>
