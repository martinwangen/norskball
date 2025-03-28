<template>
  <q-card-section class="match-events-summary">
    <q-separator class="q-my-md" />
    <div class="text-subtitle2 q-mb-sm">{{ $t('matches.keyEvents') }}</div>

    <q-list dense>
      <q-item v-for="event in match.events.slice(0, 5)" :key="event.id">
        <q-item-section avatar>
          <q-avatar size="24px" color="grey-3" text-color="grey-8">
            {{ event.minuteOfMatch }}'
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <template v-if="event.type === 'GOAL'">
              <q-icon name="sports_soccer" color="green" size="xs" class="q-mr-xs" />
              {{ $t('matches.events.goal') }}: {{ event.player?.firstName }} {{ event.player?.lastName }}
              <span class="text-caption q-ml-xs">({{ event.team?.name }})</span>
            </template>
            <template v-else-if="event.type === 'YELLOW_CARD'">
              <q-icon name="square" color="amber" size="xs" class="q-mr-xs" />
              {{ $t('matches.events.yellowCard') }}: {{ event.player?.firstName }} {{ event.player?.lastName }}
            </template>
            <template v-else-if="event.type === 'RED_CARD'">
              <q-icon name="square" color="negative" size="xs" class="q-mr-xs" />
              {{ $t('matches.events.redCard') }}: {{ event.player?.firstName }} {{ event.player?.lastName }}
            </template>
            <template v-else-if="event.type === 'SUBSTITUTION'">
              <q-icon name="swap_vert" color="blue" size="xs" class="q-mr-xs" />
              {{ $t('matches.events.substitution') }}: {{ event.player?.firstName }} {{ event.player?.lastName }} {{ $t('matches.events.for') }} {{ event.secondaryPlayer?.firstName }} {{ event.secondaryPlayer?.lastName }}
            </template>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="match.events.length > 5">
        <q-item-section class="text-center text-caption">
          + {{ match.events.length - 5 }} {{ $t('matches.moreEvents') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<script setup lang="ts">
import type { Match } from '../../gql/__generated__/graphql';

defineProps<{
  match: Match;
}>();
</script>

<style scoped>
.match-events-summary {
  padding-top: 0;
}
</style>
